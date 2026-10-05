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
  OPEN_GRAPH,
  pageHref,
  prevNext,
  versionTitle,
  type DocsVersion
} from '@/lib/docs-model/nav';
import { type VersionOption } from '@/components/ice/VersionSelect';
import { HeaderControls } from '@/components/ice/HeaderControls';
import { size as imageSize } from '@/components/ice/OpenGraphImage';
import { SITE_URL } from '@/lib/site';
import {
  listPages,
  readApiLinks,
  readPageSources,
  readNavigation,
  snippetReader,
  writtenFor
} from '@/lib/docs-model/content';

// The page route of every version: `app/<product>/<version>/[[...slug]]/page.tsx`
// is a thin wrapper that names its version and hands the rest to these.

export type PageProps = {
  params: Promise<{ slug?: string[] }>;
};

type Pagination = ReturnType<typeof prevNext> & { langs: string[] };

// GitHub's editor for one of a page's files. Every version lives on main.
function editUrl(file: string): string {
  return `https://github.com/zeroc-ice/ice-docs/edit/main/${path.relative(process.cwd(), file)}`;
}

/** Every page of `version`, for the route's `generateStaticParams`. */
export function docsPageParams(version: DocsVersion) {
  // The front page's slug is empty: it is served at the version root.
  return listPages(version).map((page) => ({
    slug: page.slug ? page.slug.split('/') : []
  }));
}

/** The page the route's params name, and its slug. */
async function pageOf(version: DocsVersion, props: PageProps) {
  const slug = (await props.params).slug?.join('/') ?? '';
  return { slug, page: listPages(version).find((p) => p.slug === slug)! };
}

/** A page's title, for the route's link preview card. */
export async function docsPageTitle(
  version: DocsVersion,
  props: PageProps
): Promise<string> {
  const { page } = await pageOf(version, props);
  return readPageSources(page).frontmatter.title;
}

/** A page's metadata, for the route's `generateMetadata`. */
export async function docsPageMetadata(
  version: DocsVersion,
  props: PageProps
): Promise<Metadata> {
  const { slug, page } = await pageOf(version, props);
  const { title, description = '' } = readPageSources(page).frontmatter;
  // One URL for every language mapping: `?lang=` only picks the one shown.
  return {
    // The front page's title is the site's name, which the template would
    // repeat.
    title: slug ? title : { absolute: versionTitle(version) },
    description,
    alternates: { canonical: pageHref(version, slug) },
    // The page's own card, from app/og; the Twitter card follows it.
    openGraph: {
      ...OPEN_GRAPH,
      images: [
        { url: `/og${pageHref(version, slug)}`, ...imageSize, alt: title }
      ]
    }
  };
}

/** A page of `version`; `versions` are the ones the switcher offers. */
export async function DocsPage({
  version,
  versions,
  params
}: PageProps & { version: DocsVersion; versions: DocsVersion[] }) {
  const slug = (await params).slug?.join('/') ?? '';
  const { sidebar } = readNavigation(version);
  const { languages } = version;

  const pages = listPages(version);
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
  // Cross-page links are resolved against this index at build time.
  const pageIndex = buildPageIndex(pages.map((p) => p.slug));

  // One dropdown entry per version, at this page's path.
  const versionOptions: VersionOption[] = versions.map((other) => ({
    version: other,
    href: pageHref(other, slug)
  }));

  const body = resolveDocument({
    shared: shared ?? '',
    overlays,
    readFile: snippetReader(version)
  });
  const content = renderMarkdownString({
    source: body,
    path: routePath,
    slug,
    version,
    pageIndex,
    apiLinks: readApiLinks(version),
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
      writtenFor: writtenFor(current, frontmatter),
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
      <HeaderControls version={version} versionOptions={versionOptions} />
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
