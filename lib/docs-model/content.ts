// Copyright (c) ZeroC, Inc.
//
// Filesystem layer for the Ice docs content model. Reads page sources and
// discovers routes under a content root laid out as:
//
//   <root>/<version>/navigation.yaml
//   <root>/<version>/index.md                  the manual's front page
//   <root>/<version>/<dir>/…/<name>/index.md   a page, at its URL path
//   <root>/<version>/<dir>/…/<name>/<lang>.md  one of its language overlays
//   <root>/<version>/examples/...              (snippet sources)
//
// A page is a directory, and its path under the version is its slug, the path in
// its URL: `slice/enumerations/index.md` is the page named `enumerations`, served
// at /ice/<version>/<language>/slice/enumerations, and the pages under it are its
// subdirectories. A directory with overlays but no index.md is a page that exists
// in those languages only.
//
// Only depends on node builtins, so it is unit-testable with
// `node lib/docs-model/content.test.ts` and usable from Next server components.
// Pure content transforms live in ./resolve.ts; the route composes the two.

import fs from 'node:fs';
import path from 'node:path';

function readIfExists(file: string): string | null {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

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
    for (const entry of fs.readdirSync(current)) {
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
  /** Its `index.md`, absolute; absent for a page that exists in some languages only. */
  shared?: string;
  /** language -> its `<lang>.md`, absolute. */
  overlays: Record<string, string>;
}

/** Whether a page exists for a language: it has a shared text, or an overlay for that language. */
export function pageExists(page: PageFiles, language: string): boolean {
  return !!page.shared || language in page.overlays;
}

const pagesCache = new Map<string, PageFiles[]>();

/**
 * Every page in a version, with the files that make it up, sorted by slug.
 *
 * Pass a `language` to get only the pages that exist for it: a link resolved
 * against the whole version would happily point a Python reader at a page that
 * only exists in C++, and that URL is never generated.
 *
 * Cached per version in production: one build renders thousands of pages and
 * each would otherwise re-walk the whole content tree. Never cached in
 * development, where pages change while the server is running.
 */
export function listPages(
  root: string,
  version: string,
  language?: string
): PageFiles[] {
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
  return language ? pages.filter((page) => pageExists(page, language)) : pages;
}

/** Read the shared page and the language overlay for a slug (either may be absent). */
export function readPageSources(
  root: string,
  version: string,
  language: string,
  slug: string
): { shared: string | null; overlay: string | null } {
  const dir = path.join(root, version, slug);
  return {
    shared: readIfExists(path.join(dir, 'index.md')),
    overlay: readIfExists(path.join(dir, `${language}.md`))
  };
}

export interface PageParam {
  version: string;
  language: string;
  slug: string;
}

/** Every (version, language, slug) that should be statically generated. */
export function listPageParams(
  root: string,
  languagesByVersion: Record<string, string[]>
): PageParam[] {
  const params: PageParam[] = [];
  for (const version of listVersions(root)) {
    for (const page of listPages(root, version)) {
      for (const language of languagesByVersion[version] ?? []) {
        if (pageExists(page, language))
          params.push({ version, language, slug: page.slug });
      }
    }
  }
  return params;
}

/** Raw navigation.yaml text for a version (parsed by the caller with js-yaml). */
export function readNavigationYaml(
  root: string,
  version: string
): string | null {
  return readIfExists(path.join(root, version, 'navigation.yaml'));
}

/** A snippet reader bound to a version: resolves `file=` relative to `<root>/<version>/`. */
export function snippetReader(
  root: string,
  version: string
): (file: string) => string {
  const base = path.join(root, version);
  return (file: string) => fs.readFileSync(path.join(base, file), 'utf8');
}
