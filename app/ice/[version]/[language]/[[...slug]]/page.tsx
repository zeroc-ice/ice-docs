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
  counterpartSlug,
  landingSlug,
  languageLabel,
  prevNext,
  trailTo,
  versionSwitchTarget,
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
  listPageEntries,
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
  return path.join(process.cwd(), 'content');
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

export function generateStaticParams() {
  const root = contentRoot();
  const languagesByVersion: Record<string, string[]> = {};
  for (const version of listVersions(root)) {
    languagesByVersion[version] = navFor(version)?.languages ?? [];
  }
  return listPageParams(root, languagesByVersion).map((p) => ({
    version: p.version,
    language: p.language,
    slug: p.slug.split('/')
  }));
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { version, language, slug } = await props.params;
  const page = (slug ?? []).join('/');
  const { shared, overlay } = readPageSources(
    contentRoot(),
    version,
    language,
    page
  );
  const fm = frontmatterOf(shared ?? overlay ?? '');
  return { title: fm.title ?? '', description: fm.description ?? '' };
}

export default async function Page(props: PageProps) {
  const { version, language, slug } = await props.params;
  const root = contentRoot();
  const page = (slug ?? []).join('/');
  if (!page) return notFound();

  const { shared, overlay } = readPageSources(root, version, language, page);
  if (!shared && !overlay) return notFound();

  const nav = navFor(version);
  const languages = nav?.languages ?? [];
  const sidebar = nav?.sidebar ?? [];
  const isAvailable = (s: string) => pageExists(root, version, language, s);

  // The manual is one tree, and this page's place in it gives the sidebar its
  // active branch, the breadcrumb trail and the reading order. A page outside
  // the tree still renders; it just gets no trail and no previous/next, which
  // makes the omission obvious.
  const navOpts = { version, language, currentSlug: page, isAvailable };
  const sideNav = buildSideNav(sidebar, navOpts);
  const crumbs = nav ? breadcrumbs(nav, page, { version, language }) : [];
  const { prev, next } = prevNext(sidebar, page, navOpts);
  const trail = trailTo(sidebar, page) ?? [];

  const frontmatter = frontmatterOf(shared ?? overlay ?? '');
  const routePath = `/ice/${version}/${language}/${page}`;
  // Cross-page links are resolved against this index at build time, so moving or
  // renaming a page never breaks the links pointing at it. The index holds only
  // the pages this language actually has, so a link is never rewritten to a URL
  // that was not generated.
  const { index: pageIndex } = buildPageIndex(
    listPageEntries(root, version, language)
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

  const landing = nav ? landingSlug(nav) : 'get-started';

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
    const exists = (slug: string) => pageExists(root, version, lang, slug);
    const counterpart = counterpartSlug(sidebar, page, lang);
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
      href: equivalent
        ? `/ice/${version}/${lang}/${equivalent}`
        : `/ice/${version}/${lang}/${nearest?.page ?? landing}${fellBack}`
    };
  });

  // Same rule for versions: the equivalent page, else the version's landing.
  const versionOptions: VersionOption[] = listVersions(root).map((other) => {
    const otherNav = other === version ? nav : navFor(other);
    const otherLanguages = otherNav?.languages ?? languages;
    const otherLanguage = otherLanguages.includes(language)
      ? language
      : (otherLanguages[0] ?? language);
    const exists = pageExists(root, other, otherLanguage, page);
    const href = versionSwitchTarget({
      targetVersion: other,
      targetLanguages: otherLanguages,
      currentLanguage: language,
      slug: page,
      landing: otherNav ? landingSlug(otherNav) : landing,
      pageExists: (lang, slug) => pageExists(root, other, lang, slug)
    });
    return { value: other, href: exists ? href : `${href}${fellBack}` };
  });

  return (
    <div className="flex grow flex-col">
      {/* Search + version + language controls live in the global header (portal). */}
      <HeaderControls
        version={version}
        currentLanguage={language}
        languageOptions={languageOptions}
        versionOptions={versionOptions}
        previousVersions={nav?.previousVersions}
      />
      <VersionBanner
        version={version}
        status={nav?.status}
        latestUrl={nav?.previousVersions?.url}
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
          <SideNav nodes={sideNav} title={MANUAL_TITLE} />

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
