// Copyright (c) ZeroC, Inc.

import path from 'path';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import { Metadata } from 'next';
import { load as yamlLoad } from 'js-yaml';

import { components } from '@/markdoc/schema';
import { renderMarkdownString } from '@/lib/markdown';
import {
  demoteHeadings,
  resolveDocument,
  splitFrontmatter,
  stripRedundantTitle
} from '@/lib/docs-model/resolve';
import { buildPageIndex } from '@/lib/docs-model/links';
import {
  MANUAL_TITLE,
  buildSideNav,
  breadcrumbs,
  pageHref,
  prevNext,
  trailTo,
  type BuildSideNavOptions,
  type NavDoc
} from '@/lib/docs-model/nav';
import { type VersionOption } from '@/components/ice/VersionSelect';
import { HeaderControls } from '@/components/ice/HeaderControls';
import { SideNav } from '@/components/ice/SideNav';
import { VersionBanner } from '@/components/ice/VersionBanner';
import {
  listVersions,
  listPages,
  listPageParams,
  readPageSources,
  readNavigationYaml,
  snippetReader
} from '@/lib/docs-model/content';

export const dynamicParams = false;

type Params = {
  version: string;
  slug?: string[];
};

type PageProps = {
  params: Promise<Params>;
};

type Pagination = ReturnType<typeof prevNext> & { langs: string[] };

function contentRoot(): string {
  return path.join(process.cwd(), 'content', 'ice');
}

function navFor(version: string): NavDoc {
  return yamlLoad(readNavigationYaml(contentRoot(), version)!) as NavDoc;
}

function frontmatterOf(source: string): Record<string, string> {
  const { frontmatter } = splitFrontmatter(source);
  return frontmatter
    ? ((yamlLoad(frontmatter) as Record<string, string>) ?? {})
    : {};
}

/**
 * A version's pages by name. The tree names pages by name; where a page's
 * files are — and so its URL — and which languages it is written for come
 * from the content tree.
 */
function pageLookup(root: string, version: string) {
  const byName = new Map(listPages(root, version).map((p) => [p.name, p]));
  return {
    slugOf: (name: string) => byName.get(name)!.slug,
    writtenFor: (name: string) => {
      const page = byName.get(name)!;
      return page.shared ? undefined : Object.keys(page.overlays);
    }
  };
}

/** A page's frontmatter: its shared text's, or a language's when there is no shared text. */
function pageFrontmatter(sources: ReturnType<typeof readPageSources>) {
  return frontmatterOf(sources.shared ?? Object.values(sources.overlays)[0]);
}

export function generateStaticParams() {
  // The front page's slug is empty: it is served at the version root.
  return listPageParams(contentRoot()).map((p) => ({
    version: p.version,
    slug: p.slug ? p.slug.split('/') : []
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { version, slug: segments } = await props.params;
  const slug = segments?.join('/') ?? '';
  const fm = pageFrontmatter(readPageSources(contentRoot(), version, slug));
  // The front page is the manual itself, so its title is not suffixed with the
  // manual's name.
  const title = slug ? (fm.title ?? '') : { absolute: fm.title ?? '' };
  return { title, description: fm.description ?? '' };
}

export default async function Page(props: PageProps) {
  const { version, slug: segments } = await props.params;
  const root = contentRoot();
  const nav = navFor(version);
  const { languages, sidebar } = nav;
  const slug = segments?.join('/') ?? '';

  const sources = readPageSources(root, version, slug);
  const { shared, overlays } = sources;
  const { slugOf, writtenFor } = pageLookup(root, version);
  const frontmatter = pageFrontmatter(sources);
  const page = segments?.at(-1) ?? '';

  // The manual is one tree, and this page's place in it gives the sidebar its
  // active branch, the breadcrumb trail and the reading order. A page outside
  // the tree still renders; it just gets no trail and no previous/next, which
  // makes the omission obvious.
  const navOpts: BuildSideNavOptions = {
    version,
    currentPage: page,
    slugOf,
    writtenFor
  };
  const sideNav = buildSideNav(sidebar, navOpts);
  const crumbs = breadcrumbs(nav, page, navOpts);
  // Previous and next follow the sidebar, which hides the pages not written
  // for the reader's language: one pair per language, alike ones sharing.
  const pagination = new Map<string, Pagination>();
  for (const language of languages) {
    const links = prevNext(sidebar, page, navOpts, language);
    const variant = pagination.get(JSON.stringify(links));
    if (variant) variant.langs.push(language);
    else pagination.set(JSON.stringify(links), { langs: [language], ...links });
  }
  const trail = trailTo(sidebar, page) ?? [];

  const routePath = pageHref(version, slug);
  // Cross-page links are resolved against this index at build time, so moving a
  // page never breaks the links pointing at it.
  const { index: pageIndex } = buildPageIndex(
    listPages(root, version).map((p) => p.slug)
  );

  // One dropdown entry per version, at this page's path.
  const versionOptions: VersionOption[] = listVersions(root).map((other) => ({
    value: other,
    href: pageHref(other, slug)
  }));

  // The Release Notes chapter's pages, newest first, each with the date its
  // frontmatter gives. Only the front page lists them, and reading every one
  // of them for every page would multiply across the manual.
  const releases = slug
    ? []
    : (sidebar.find((n) => n.page === 'release-notes')?.items ?? []).map(
        (n) => {
          const s = slugOf(n.page!);
          return {
            title: n.title,
            href: pageHref(version, s),
            date: pageFrontmatter(readPageSources(root, version, s)).date
          };
        }
      );

  const body = resolveDocument({
    shared: shared ?? '',
    overlays,
    readFile: snippetReader(root, version)
  });
  const content = renderMarkdownString({
    source: demoteHeadings(stripRedundantTitle(body, frontmatter.title)),
    path: routePath,
    version,
    languages,
    pageIndex,
    frontmatter,
    chrome: {
      breadcrumbs: crumbs,
      pagination: [...pagination.values()],
      // A page written per language tells readers of the other languages
      // which ones have it.
      writtenFor: writtenFor(page),
      // For the front page's switches and release list.
      versionOptions,
      previousVersions: nav.previousVersions,
      releases,
      // The property tables are a list of exact identifiers, not an essay, and
      // are typeset as such. Derived from the page's place in the manual — the
      // pages under the Property Reference chapter — rather than restated in
      // the frontmatter of every one of them; a page can still override it.
      shape:
        page !== 'property-reference' &&
        trail.some((n) => n.page === 'property-reference')
          ? 'property-list'
          : undefined
    }
  });

  return (
    <div className="flex grow flex-col">
      {/* Search + version + language controls live in the global header (portal). */}
      <HeaderControls
        version={version}
        languages={languages}
        versionOptions={versionOptions}
        previousVersions={nav.previousVersions}
      />
      <VersionBanner
        version={version}
        status={nav.status}
        latestUrl={nav.previousVersions?.url}
      />
      <div className="mt-8 flex grow flex-row justify-center">
        <div className="flex max-w-400 grow flex-row justify-center gap-6 px-6">
          {/* Sidebar: the manual's table of contents. */}
          <SideNav
            nodes={sideNav}
            title={MANUAL_TITLE}
            homeHref={pageHref(version)}
          />

          {/* Content */}
          <div className="grow pb-8">
            <div id="skip-nav" />
            {Markdoc.renderers.react(content, React, { components })}
          </div>
        </div>
      </div>
    </div>
  );
}
