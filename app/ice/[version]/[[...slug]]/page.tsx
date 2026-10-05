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

// GitHub's editor for one of a page's files. Every version lives on main.
function editUrl(file: string): string {
  return `https://github.com/zeroc-ice/ice-docs/edit/main/${path.relative(process.cwd(), file)}`;
}

export function generateStaticParams() {
  // The front page's slug is empty: it is served at the version root.
  return listVersions(CONTENT_ROOT).flatMap((version) =>
    listPages(CONTENT_ROOT, version).map((page) => ({
      version,
      slug: page.slug ? page.slug.split('/') : []
    }))
  );
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { version, slug: segments } = await props.params;
  const slug = segments?.join('/') ?? '';
  const page = listPages(CONTENT_ROOT, version).find((p) => p.slug === slug)!;
  const { title, description = '' } = readPageSources(page).frontmatter;
  // One URL for every language mapping: `?lang=` only picks the one shown.
  return {
    // The front page's title is the site's name, which the template would
    // repeat.
    title: slug ? title : { absolute: versionTitle(version) },
    description,
    alternates: { canonical: pageHref(version, slug) }
  };
}

export default async function Page(props: PageProps) {
  const { version, slug: segments } = await props.params;
  const nav = readNavigation(CONTENT_ROOT, version);
  const { languages, sidebar } = nav;
  const slug = segments?.join('/') ?? '';

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
  // Cross-page links are resolved against this index at build time.
  const pageIndex = buildPageIndex(pages.map((p) => p.slug));

  // One dropdown entry per version, at this page's path.
  const versionOptions: VersionOption[] = listVersions(CONTENT_ROOT).map(
    (other) => ({
      value: other,
      href: pageHref(other, slug)
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
    slug,
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
      writtenFor: writtenFor(current, frontmatter),
      // For the front page's switches.
      versionOptions,
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
