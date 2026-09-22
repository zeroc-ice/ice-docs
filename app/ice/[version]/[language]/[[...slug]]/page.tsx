// Copyright (c) ZeroC, Inc.

import path from 'path';
import Markdoc from '@markdoc/markdoc';
import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
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
  counterpartPage,
  languageLabel,
  pageHref,
  prevNext,
  trailTo,
  versionSwitchTarget,
  type BuildSideNavOptions,
  type NavDoc
} from '@/lib/docs-model/nav';
import { type LanguageOption } from '@/components/ice/LanguageSelect';
import { type VersionOption } from '@/components/ice/VersionSelect';
import { HeaderControls } from '@/components/ice/HeaderControls';
import { SideNav } from '@/components/ice/SideNav';
import { SwitchNotice } from '@/components/ice/SwitchNotice';
import { VersionBanner } from '@/components/ice/VersionBanner';
import {
  listVersions,
  listPages,
  listPageParams,
  readPageSources,
  readNavigationYaml,
  pageExists,
  snippetReader
} from '@/lib/docs-model/content';

export const dynamicParams = false;

type Params = {
  version: string;
  language: string;
  slug?: string[];
};

type PageProps = {
  params: Promise<Params>;
};

function contentRoot(): string {
  return path.join(process.cwd(), 'content', 'ice');
}

function navFor(version: string): NavDoc | null {
  const yaml = readNavigationYaml(contentRoot(), version);
  return yaml ? (yamlLoad(yaml) as NavDoc) : null;
}

function frontmatterOf(source: string): Record<string, string> {
  const { frontmatter } = splitFrontmatter(source);
  return frontmatter
    ? ((yamlLoad(frontmatter) as Record<string, string>) ?? {})
    : {};
}

/**
 * A version's pages' slugs by name, when they exist for a language. The tree
 * names pages by name; a page's slug — where its files are, and so its URL —
 * comes from the content tree.
 */
function slugLookup(root: string, version: string) {
  const byName = new Map(listPages(root, version).map((p) => [p.name, p]));
  return (language: string, name: string): string | undefined => {
    const page = byName.get(name);
    return page && pageExists(page, language) ? page.slug : undefined;
  };
}

export function generateStaticParams() {
  const root = contentRoot();
  const languagesByVersion: Record<string, string[]> = {};
  for (const version of listVersions(root)) {
    languagesByVersion[version] = navFor(version)?.languages ?? [];
  }
  // The front page's slug is empty: it is served at the version and language root.
  return listPageParams(root, languagesByVersion).map((p) => ({
    version: p.version,
    language: p.language,
    slug: p.slug ? p.slug.split('/') : []
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { version, language, slug: segments } = await props.params;
  const slug = segments?.join('/') ?? '';
  const { shared, overlay } = readPageSources(
    contentRoot(),
    version,
    language,
    slug
  );
  const fm = frontmatterOf(shared ?? overlay ?? '');
  // The front page is the manual itself, so its title is not suffixed with the
  // manual's name.
  const title = slug ? (fm.title ?? '') : { absolute: fm.title ?? '' };
  return { title, description: fm.description ?? '' };
}

export default async function Page(props: PageProps) {
  const { version, language, slug: segments } = await props.params;
  const root = contentRoot();
  const nav = navFor(version);
  if (!nav) return notFound();
  const { languages, sidebar } = nav;
  const slug = segments?.join('/') ?? '';

  const { shared, overlay } = readPageSources(root, version, language, slug);
  if (!shared && !overlay) return notFound();

  const slugFor = slugLookup(root, version);
  const hrefFor = (lang: string, page?: string) =>
    pageHref(version, lang, page && slugFor(lang, page));

  const frontmatter = frontmatterOf(shared ?? overlay ?? '');
  const page = segments?.at(-1) ?? '';

  // The manual is one tree, and this page's place in it gives the sidebar its
  // active branch, the breadcrumb trail and the reading order. A page outside
  // the tree still renders; it just gets no trail and no previous/next, which
  // makes the omission obvious.
  const navOpts: BuildSideNavOptions = {
    version,
    language,
    currentPage: page,
    slugOf: (p) => slugFor(language, p)
  };
  const sideNav = buildSideNav(sidebar, navOpts);
  const crumbs = breadcrumbs(nav, page, navOpts);
  const { prev, next } = prevNext(sidebar, page, navOpts);
  const trail = trailTo(sidebar, page) ?? [];

  const routePath = pageHref(version, language, slug);
  // Cross-page links are resolved against this index at build time, so moving a
  // page never breaks the links pointing at it. The index holds only the pages
  // this language actually has, so a link is never rewritten to a URL that was
  // not generated.
  const { index: pageIndex } = buildPageIndex(
    listPages(root, version, language).map((p) => p.slug)
  );

  // One dropdown entry per supported language. Selecting a language keeps the
  // current page when it exists there, or lands on the same page written for
  // that language when the tree has one beside it (the C++ server walkthrough
  // becomes the Java one). Only when neither exists does it fall back — to the
  // nearest chapter above the page, else the manual's front page — and it says
  // so on arrival instead of pretending the page is equivalent. The label is
  // the page's own title: the link back carries the language, so naming it
  // here just stutters ("C++ Plug-in API (C++)").
  const fellBack = `?from=${encodeURIComponent(routePath)}&fromLabel=${encodeURIComponent(
    frontmatter.title ?? page
  )}`;
  const languageOptions: LanguageOption[] = languages.map((lang) => {
    const exists = (p: string) => slugFor(lang, p) !== undefined;
    const counterpart = counterpartPage(sidebar, page, lang);
    const equivalent = exists(page)
      ? page
      : counterpart && exists(counterpart)
        ? counterpart
        : undefined;
    const nearest = [...trail]
      .reverse()
      .find((n) => n.page && n.page !== page && exists(n.page));
    return {
      value: lang,
      label: languageLabel(lang),
      href: !slug
        ? pageHref(version, lang)
        : equivalent
          ? hrefFor(lang, equivalent)
          : `${hrefFor(lang, nearest?.page)}${fellBack}`
    };
  });

  // Same rule for versions: the equivalent page, else the version's front page.
  // A page is looked up by name, since the same page may sit elsewhere in
  // another version's tree.
  const versionOptions: VersionOption[] = listVersions(root).map((other) => {
    const otherNav = other === version ? nav : navFor(other);
    const otherLanguages = otherNav?.languages ?? languages;
    const otherLanguage = otherLanguages.includes(language)
      ? language
      : (otherLanguages[0] ?? language);
    const slugIn = other === version ? slugFor : slugLookup(root, other);
    const kept = !slug || slugIn(otherLanguage, page) !== undefined;
    const href = versionSwitchTarget({
      targetVersion: other,
      targetLanguages: otherLanguages,
      currentLanguage: language,
      page: slug ? page : undefined,
      slugOf: slugIn
    });
    return { value: other, href: kept ? href : `${href}${fellBack}` };
  });

  // The Release Notes chapter's pages, newest first, each with the date its
  // frontmatter gives. Only the front page lists them, and reading every one
  // of them for every page would multiply across the page-by-language matrix.
  const releases = slug
    ? []
    : (sidebar.find((n) => n.page === 'release-notes')?.items ?? []).flatMap(
        (n) => {
          const s = n.page && slugFor(language, n.page);
          if (s === undefined) return [];
          const sources = readPageSources(root, version, language, s);
          return {
            title: n.title,
            href: pageHref(version, language, s),
            date: frontmatterOf(sources.shared ?? sources.overlay ?? '').date
          };
        }
      );

  // Migrated content can contain conversion artifacts; surface a render error on
  // the page instead of failing the whole build, so we can see what's broken.
  let content: ReturnType<typeof renderMarkdownString>['content'] | null = null;
  let renderError: string | null = null;
  try {
    const body = resolveDocument({
      shared: shared ?? '',
      overlay: overlay ?? undefined,
      readFile: snippetReader(root, version)
    });
    content = renderMarkdownString({
      source: demoteHeadings(stripRedundantTitle(body, frontmatter.title)),
      path: routePath,
      version,
      language,
      pageIndex,
      frontmatter,
      chrome: {
        breadcrumbs: crumbs,
        prev,
        next,
        // For the front page's switches, code showcase, and release list.
        languageOptions,
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
    }).content;
  } catch (error) {
    renderError = error instanceof Error ? error.message : String(error);
  }

  return (
    <div className="flex grow flex-col">
      {/* Search + version + language controls live in the global header (portal). */}
      <HeaderControls
        version={version}
        currentLanguage={language}
        languageOptions={languageOptions}
        versionOptions={versionOptions}
        previousVersions={nav.previousVersions}
      />
      <VersionBanner
        version={version}
        status={nav.status}
        latestUrl={nav.previousVersions?.url}
      />
      {/* Says so when a version or language switch could not keep the page.
          Keyed by route so the notice belongs to the page the switch landed on
          and never follows the reader to the next one. It reads the URL's
          query, which a statically rendered page can only do on the client —
          the boundary keeps the rest of the page static. */}
      <Suspense fallback={null}>
        <SwitchNotice key={routePath} />
      </Suspense>

      <div className="mt-8 flex grow flex-row justify-center">
        <div className="flex max-w-400 grow flex-row justify-center gap-6 px-6">
          {/* Sidebar: the manual's table of contents. */}
          <SideNav
            nodes={sideNav}
            title={MANUAL_TITLE}
            homeHref={hrefFor(language)}
          />

          {/* Content */}
          <div className="grow pb-8">
            <div id="skip-nav" />
            {renderError ? (
              <div className="mt-10 rounded border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-800 dark:bg-red-950/40 dark:text-red-200">
                <strong>Page failed to render:</strong> {renderError}
              </div>
            ) : (
              Markdoc.renderers.react(content, React, { components })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
