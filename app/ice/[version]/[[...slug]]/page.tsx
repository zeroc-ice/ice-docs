// Copyright (c) ZeroC, Inc.

import path from 'path';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import { Metadata } from 'next';

import { components } from '@/markdoc/schema';
import { renderMarkdownString } from '@/lib/markdown';
import {
  demoteHeadings,
  resolveDocument,
  stripRedundantTitle
} from '@/lib/docs-model/resolve';
import { buildPageIndex } from '@/lib/docs-model/links';
import {
  MANUAL_TITLE,
  buildSideNav,
  breadcrumbs,
  pageHref,
  prevNext
} from '@/lib/docs-model/nav';
import { type VersionOption } from '@/components/ice/VersionSelect';
import { HeaderControls } from '@/components/ice/HeaderControls';
import { SideNav } from '@/components/ice/SideNav';
import { VersionBanner } from '@/components/ice/VersionBanner';
import {
  listVersions,
  listPages,
  readPageSources,
  readNavigation,
  snippetReader,
  writtenFor
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

export function generateStaticParams() {
  const root = contentRoot();
  // The front page's slug is empty: it is served at the version root.
  return listVersions(root).flatMap((version) =>
    listPages(root, version).map((page) => ({
      version,
      slug: page.slug ? page.slug.split('/') : []
    }))
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { version, slug: segments } = await props.params;
  const slug = segments?.join('/') ?? '';
  const page = listPages(contentRoot(), version).find((p) => p.slug === slug)!;
  const { title, description = '' } = readPageSources(page).frontmatter;
  // The front page is the manual itself, so its title is not suffixed with the
  // manual's name.
  return { title: slug ? title : { absolute: title }, description };
}

export default async function Page(props: PageProps) {
  const { version, slug: segments } = await props.params;
  const root = contentRoot();
  const nav = readNavigation(root, version);
  const { languages, sidebar } = nav;
  const slug = segments?.join('/') ?? '';

  const pages = listPages(root, version);
  const current = pages.find((p) => p.slug === slug)!;
  const { shared, overlays, frontmatter } = readPageSources(current);

  // The manual is one tree, and this page's place in it gives the sidebar its
  // active branch, the breadcrumb trail, and the reading order. A page outside
  // the tree still renders; it just gets no trail and no previous/next, which
  // makes the omission obvious.
  const sideNav = buildSideNav(sidebar, version, slug);
  const crumbs = breadcrumbs(sidebar, version, slug);
  // Previous and next follow the sidebar, which hides the pages not written
  // for the reader's language: one pair per language, alike ones sharing.
  const pagination = new Map<string, Pagination>();
  for (const language of languages) {
    const links = prevNext(sidebar, version, slug, language);
    const key = JSON.stringify(links);
    const variant = pagination.get(key);
    if (variant) variant.langs.push(language);
    else pagination.set(key, { langs: [language], ...links });
  }

  const routePath = pageHref(version, slug);
  // Cross-page links are resolved against this index at build time, so moving a
  // page never breaks the links pointing at it.
  const { index: pageIndex } = buildPageIndex(pages.map((p) => p.slug));

  // One dropdown entry per version, at this page's path.
  const versionOptions: VersionOption[] = listVersions(root).map((other) => ({
    value: other,
    href: pageHref(other, slug)
  }));

  // The Release Notes chapter's pages, newest first, each with the date its
  // frontmatter gives. Only the front page shows them, and reading every one
  // of them for every page would multiply across the manual.
  const releases = slug
    ? []
    : (sidebar.find((n) => n.slug === 'release-notes')?.items ?? []).map(
        (n) => ({
          title: n.title,
          href: pageHref(version, n.slug),
          date: readPageSources(pages.find((p) => p.slug === n.slug)!)
            .frontmatter.date
        })
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
      writtenFor: writtenFor(current),
      // For the front page's switches and release list.
      versionOptions,
      previousVersions: nav.previousVersions,
      releases,
      // The property tables are a list of exact identifiers, not an essay, and
      // are typeset as such. Derived from the page's place in the manual — the
      // pages under the Property Reference chapter — rather than restated in
      // the frontmatter of every one of them; a page can still override it.
      shape: slug.startsWith('property-reference/')
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
