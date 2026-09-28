// Copyright (c) ZeroC, Inc.
//
// Filesystem layer for the Ice docs content model. Reads page sources and
// discovers routes under a content root laid out as:
//
//   <root>/<version>/index.md                  the manual's front page
//   <root>/<version>/<dir>/…/<name>/index.md   a page, at its URL path
//   <root>/<version>/<dir>/…/<name>/<lang>.md  one of its language overlays
//   <root>/<version>/examples/...              (snippet sources)
//   <root>/<version>/redirects.yaml            old URL to new URL
//
// A page is a directory, and its path under the version is its slug, the path in
// its URL: `slice/enumerations/index.md` is the page named `enumerations`, served
// at /ice/<version>/slice/enumerations, and the pages under it are its
// subdirectories, in the order its frontmatter lists them under `pages:`. A
// directory with overlays but no index.md is a page written per language: each
// overlay is the whole page for its language.
//
// Unit-testable with `node lib/docs-model/content.test.ts` and usable from Next
// server components. Pure content transforms live in ./resolve.ts; the route
// composes the two.

import fs from 'node:fs';
import path from 'node:path';
import { load as yamlLoad } from 'js-yaml';

import { pageHref, type NavDoc, type NavNode } from './nav.ts';
import { splitFrontmatter } from './resolve.ts';

/** The content root, under the repository root that npm and Next run from. */
export const CONTENT_ROOT = path.join(process.cwd(), 'content', 'ice');

/** Version directories look like `3.8`, `0.6`, etc. — this filters out any non-version dirs. */
export function listVersions(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root)
    .filter(
      (name) =>
        /^\d+\.\d+/.test(name) &&
        fs.statSync(path.join(root, name)).isDirectory()
    )
    .sort();
}

/** Every .md file under `dir`, as paths relative to it with `/` separators. */
function markdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  const walk = (current: string) => {
    for (const entry of fs.readdirSync(current).sort()) {
      const abs = path.join(current, entry);
      if (fs.statSync(abs).isDirectory()) walk(abs);
      else if (entry.endsWith('.md')) {
        out.push(path.relative(dir, abs).split(path.sep).join('/'));
      }
    }
  };
  walk(dir);
  return out;
}

/** The files that make up one page. */
export interface PageFiles {
  /** The page's path under the version, as in its URL: `''` for the front page. */
  slug: string;
  /** The page's name, unique within the version: the last segment of its slug. */
  name: string;
  /** Its `index.md`, absolute; absent for a page written per language. */
  shared?: string;
  /** language -> its `<lang>.md`, absolute. */
  overlays: Record<string, string>;
}

const pagesCache = new Map<string, PageFiles[]>();

/**
 * Every page in a version, with the files that make it up, sorted by slug.
 *
 * Cached per version in production: one build renders hundreds of pages and
 * each would otherwise re-walk the whole content tree. Never cached in
 * development, where pages change while the server is running.
 */
export function listPages(root: string, version: string): PageFiles[] {
  const base = path.join(root, version);
  const cacheable = process.env.NODE_ENV === 'production';
  let pages = cacheable ? pagesCache.get(base) : undefined;
  if (!pages) {
    const bySlug = new Map<string, PageFiles>();
    for (const file of markdownFiles(base)) {
      const segments = file.replace(/\.md$/, '').split('/');
      const stem = segments.pop()!;
      const slug = segments.join('/');
      const page = bySlug.get(slug) ?? {
        slug,
        name: segments[segments.length - 1] ?? '',
        overlays: {}
      };
      const abs = path.join(base, file);
      if (stem === 'index') page.shared = abs;
      else page.overlays[stem] = abs;
      bySlug.set(slug, page);
    }
    pages = [...bySlug.values()].sort((a, b) => a.slug.localeCompare(b.slug));
    if (cacheable) pagesCache.set(base, pages);
  }
  return pages;
}

/** A markdown file's frontmatter, parsed; an overlay of a shared page has none. */
export function frontmatterOf<T = Record<string, string>>(source: string): T {
  const { frontmatter } = splitFrontmatter(source);
  return (frontmatter ? yamlLoad(frontmatter) : {}) as T;
}

/**
 * A page's frontmatter: its index.md's, or on a page written per language, its
 * first overlay's.
 */
function readFrontmatter<T = Record<string, string>>(page: PageFiles): T {
  return frontmatterOf<T>(
    fs.readFileSync(page.shared ?? Object.values(page.overlays)[0], 'utf8')
  );
}

/**
 * A page's shared text, its overlays' text by language, and its frontmatter:
 * the shared text's, or on a page written per language, the first overlay's.
 */
export function readPageSources(page: PageFiles) {
  const read = (file: string) => fs.readFileSync(file, 'utf8');
  const shared = page.shared ? read(page.shared) : null;
  const overlays = Object.fromEntries(
    Object.entries(page.overlays).map(([language, file]) => [
      language,
      read(file)
    ])
  );
  return { shared, overlays, frontmatter: readFrontmatter(page) };
}

/** The languages a page is written for; `undefined` when it is written for all. */
export function writtenFor(page: PageFiles): string[] | undefined {
  return page.shared ? undefined : Object.keys(page.overlays);
}

/**
 * A version's table of contents and settings, read from its pages: the front
 * page's frontmatter holds the settings and lists the chapters under `pages:`,
 * and a page with children lists them the same way. The front page is the
 * first entry, ahead of the chapters. A node takes its page's title. Throws
 * when the version has no front page, or when a page lists a page it does not
 * contain.
 */
export function readNavigation(root: string, version: string): NavDoc {
  type Listed = { title: string; pages?: string[] };
  const bySlug = new Map(listPages(root, version).map((p) => [p.slug, p]));
  const nodes = (parent: string, names: string[] = []): NavNode[] =>
    names.map((name) => {
      const slug = parent ? `${parent}/${name}` : name;
      const page = bySlug.get(slug);
      if (!page)
        throw new Error(
          `${version}/${parent || 'index.md'} lists "${name}", which is not a page in it`
        );
      const { title, pages } = readFrontmatter<Listed>(page);
      return {
        title,
        slug,
        writtenFor: writtenFor(page),
        items: nodes(slug, pages)
      };
    });

  const front = bySlug.get('');
  if (!front)
    throw new Error(
      `${version} has no front page (index.md at the version root)`
    );
  const { title, pages, languages, status, previousVersions } = readFrontmatter<
    Listed & Omit<NavDoc, 'sidebar'>
  >(front);
  return {
    languages,
    status,
    previousVersions,
    sidebar: [
      { title, slug: '', writtenFor: undefined, items: [] },
      ...nodes('', pages)
    ]
  };
}

/**
 * The site's redirects, for Next's `redirects` config: the site root and `/ice`
 * go to the newest version's front page, and each version's `redirects.yaml`
 * sends old URLs to new ones.
 */
export function readRedirects(root: string) {
  const versions = listVersions(root).sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true })
  );
  const newest = pageHref(versions[versions.length - 1]);
  const redirects = [
    { source: '/', destination: newest, permanent: false },
    { source: '/ice', destination: newest, permanent: false }
  ];
  for (const version of versions) {
    const file = path.join(root, version, 'redirects.yaml');
    if (!fs.existsSync(file)) continue;
    const manifest = yamlLoad(fs.readFileSync(file, 'utf8')) as {
      redirects: { from: string; to: string; permanent?: boolean }[];
    };
    for (const { from, to, permanent = false } of manifest.redirects) {
      redirects.push({ source: from, destination: to, permanent });
    }
  }
  return redirects;
}

/** A snippet reader bound to a version: resolves `file=` relative to `<root>/<version>/`. */
export function snippetReader(
  root: string,
  version: string
): (file: string) => string {
  const base = path.join(root, version);
  return (file: string) => fs.readFileSync(path.join(base, file), 'utf8');
}
