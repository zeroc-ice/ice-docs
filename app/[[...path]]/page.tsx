// Copyright (c) ZeroC, Inc.

import path from 'path';
import Markdoc from '@markdoc/markdoc';
import React from 'react';
import { Metadata } from 'next';

import { components } from '@/markdoc/schema';
import { renderMarkdownString } from '@/lib/markdown';
import { resolveDocument } from '@/lib/docs-model/resolve';
import { buildPageIndex } from '@/lib/docs-model/links';
import {
  breadcrumbs,
  pageHref,
  prevNext,
  versionTitle
} from '@/lib/docs-model/nav';
import { type VersionOption } from '@/components/ice/VersionSelect';
import { HeaderControls } from '@/components/ice/HeaderControls';
import { SITE_URL } from '@/lib/site';
import {
  CONTENT_ROOT,
  listVersions,
  listPages,
  locate,
  readPageSources,
  readNavigation,
  readVersionSettings,
  snippetReader,
  writtenFor
} from '@/lib/docs-model/content';

export const dynamicParams = false;

type Params = {
  /** The URL's segments: the version's path, then the page's slug. */
  path?: string[];
};

type PageProps = {
  params: Promise<Params>;
};

type Pagination = ReturnType<typeof prevNext> & { langs: string[] };

// GitHub's editor for one of a page's files. Every version lives on main.
function editUrl(file: string): string {
  return `https://github.com/zeroc-ice/ice-docs/edit/main/${path.relative(process.cwd(), file)}`;
}

export function generateStaticParams() {
  // The front page's slug is empty: it is served at the version root.
  return listVersions(CONTENT_ROOT).flatMap((version) =>
    listPages(CONTENT_ROOT, version).map((page) => ({
      path: [...version.split('/'), ...page.slug.split('/').filter(Boolean)]
    }))
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { path: segments } = await props.params;
  const { version, slug } = locate(CONTENT_ROOT, segments ?? []);
  const page = listPages(CONTENT_ROOT, version).find((p) => p.slug === slug)!;
  const { title, description = '' } = readPageSources(page).frontmatter;
  // One URL for every language mapping: `?lang=` only picks the one shown.
  return {
    // The front page's title is the site's name, which the template would
    // repeat.
    title: slug
      ? title
      : {
          absolute: versionTitle(
            readVersionSettings(CONTENT_ROOT, version).title
          )
        },
    description,
    alternates: { canonical: pageHref(version, slug) }
  };
}

export default async function Page(props: PageProps) {
  const { path: segments } = await props.params;
  const { version, slug } = locate(CONTENT_ROOT, segments ?? []);
  const nav = readNavigation(CONTENT_ROOT, version);
  const { title: versionName, languages, sidebar } = nav;

  const pages = listPages(CONTENT_ROOT, version);
  const current = pages.find((p) => p.slug === slug)!;
  const { shared, overlays, frontmatter } = readPageSources(current);

  // The documentation is one tree, and this page's place in it gives the breadcrumb
  // trail and the reading order. A page outside the tree still renders; it just
  // gets no trail and no previous/next, which makes the omission obvious.
  const crumbs = breadcrumbs(sidebar, version, slug);
  // The same trail as structured data, which search results can show in place
  // of the page's URL.
  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.title,
      item: crumb.href && new URL(crumb.href, SITE_URL).href
    }))
  };
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

  // One dropdown entry per version of the same product, the versions in the
  // same directory as this one, at this page's path.
  const product = path.posix.dirname(version);
  const versionOptions: VersionOption[] = listVersions(CONTENT_ROOT)
    .filter((other) => path.posix.dirname(other) === product)
    .map((other) => ({
      value: other,
      label: readVersionSettings(CONTENT_ROOT, other).title,
      href: pageHref(other, slug)
    }));

  // The Release Notes chapter's pages, newest first, each with the date its
  // frontmatter gives. Only the front page shows them, and reading every one
  // of them for every page would multiply across the site.
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
    readFile: snippetReader(CONTENT_ROOT, version)
  });
  const content = renderMarkdownString({
    source: body,
    path: routePath,
    version,
    languages,
    pageIndex,
    frontmatter,
    chrome: {
      breadcrumbs: crumbs,
      pagination: [...pagination.values()],
      edit: {
        shared: current.shared && editUrl(current.shared),
        overlays: Object.fromEntries(
          Object.entries(current.overlays).map(([language, file]) => [
            language,
            editUrl(file)
          ])
        )
      },
      // A page written per language tells readers of the other languages
      // which ones have it.
      writtenFor: writtenFor(current),
      // For the front page's switches and release list.
      versionTitle: versionName,
      versionOptions,
      releases,
      // The property tables are a list of exact identifiers, not an essay, and
      // are typeset as such. Derived from the page's place in the tree — the
      // pages under the Property Reference chapter — rather than restated in
      // the frontmatter of every one of them; a page can still override it.
      shape: slug.startsWith('property-reference/')
        ? 'property-list'
        : undefined
    }
  });

  return (
    <>
      {/* Search + version + language controls live in the global header (portal). */}
      <HeaderControls
        version={version}
        title={versionName}
        languages={languages}
        versionOptions={versionOptions}
      />
      {crumbs.length > 0 && (
        <script
          type="application/ld+json"
          // `<` escaped, so no title can close the script element, as
          // https://nextjs.org/docs/app/guides/json-ld recommends.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(breadcrumbList).replace(/</g, '\\u003c')
          }}
        />
      )}
      {Markdoc.renderers.react(content, React, { components })}
    </>
  );
}
