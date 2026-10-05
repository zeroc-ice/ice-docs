// Copyright (c) ZeroC, Inc.
//
// Filesystem layer for the Ice docs content model. Reads page sources and
// discovers routes under a content root laid out as:
//
//   <root>/…/<version>/index.md               the front page
//   <root>/…/<version>/<dir>/…/<name>/index.md a page, at its URL path
//   <root>/…/<version>/<dir>/…/<name>/<lang>.md one of its language overlays
//   <root>/…/<version>/examples/...           (snippet sources)
//   <root>/…/<version>/api-links.yaml         each type's API reference pages
//   <root>/…/redirects.yaml                   redirects, relative to that directory's URL
//
// A version is one the site defines (app/ice/versions.ts), named by its path under
// the root, `ice/3.8`, which is also its URL. A page is a directory, and its
// path under the version is its slug, the path in its URL:
// `ice/3.8/slice/enumerations/index.md` is the page named `enumerations`,
// served at /ice/3.8/slice/enumerations, and the pages under it are its
// subdirectories, in the order its frontmatter lists them under `pages:`. A
// directory with overlays but no index.md is a page written per language: each
// overlay is the whole page for its language. A shared page that applies to
// only some languages lists them under `languages:` in its frontmatter.
//
// Usable from Next server components and from the scripts under plain Node.
// Pure content transforms live in ./resolve.ts; the route composes the two.

import fs from 'node:fs';
import path from 'node:path';
import { load as yamlLoad } from 'js-yaml';

import type { ApiLinks } from './links.ts';
import {
  FRONT_PAGE_NAV_TITLE,
  pageHref,
  type NavDoc,
  type NavNode,
  type DocsVersion
} from './nav.ts';
import { splitFrontmatter } from './resolve.ts';

/** The content root, under the repository root that npm and Next run from. */
export const CONTENT_ROOT = path.join(process.cwd(), 'content');

/** Every `redirects.yaml` under `dir`. */
function redirectFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return redirectFiles(full);
    return entry.name === 'redirects.yaml' ? [full] : [];
  });
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
  /** The page's name: the last segment of its slug. */
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
export function listPages(version: DocsVersion): PageFiles[] {
  const base = path.join(CONTENT_ROOT, version.path);
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

/**
 * The languages a page is written for: a page written per language's overlays,
 * or the `languages:` its index.md lists in `frontmatter`, the frontmatter the
 * caller already read; `undefined` when it is written for all. Throws when
 * `languages:` is not a list of languages.
 */
export function writtenFor(
  page: PageFiles,
  frontmatter: { languages?: unknown }
): string[] | undefined {
  if (!page.shared) return Object.keys(page.overlays);
  const { languages } = frontmatter;
  if (languages === undefined) return undefined;
  if (
    !Array.isArray(languages) ||
    languages.length === 0 ||
    !languages.every((language) => typeof language === 'string')
  )
    throw new Error(
      `${page.shared} lists its languages as ${JSON.stringify(languages)}, not a list of languages`
    );
  return languages;
}

/**
 * A version's table of contents, read from its pages: the front page's
 * frontmatter lists the chapters under
 * `pages:`, and a page with children lists them the same way. The front page
 * is the first entry, ahead of the chapters, under its own label; every other
 * node takes its page's title. Throws when the version has no front page, or
 * when a page lists a page it does not contain.
 */
export function readNavigation(version: DocsVersion): NavDoc {
  type Listed = { title: string; pages?: string[]; languages?: unknown };
  const bySlug = new Map(listPages(version).map((p) => [p.slug, p]));
  const nodes = (parent: string, names: string[] = []): NavNode[] =>
    names.map((name) => {
      const slug = parent ? `${parent}/${name}` : name;
      const page = bySlug.get(slug);
      if (!page)
        throw new Error(
          `${version.path}/${parent || 'index.md'} lists "${name}", which is not a page in it`
        );
      const frontmatter = readFrontmatter<Listed>(page);
      return {
        title: frontmatter.title,
        slug,
        writtenFor: writtenFor(page, frontmatter),
        items: nodes(slug, frontmatter.pages)
      };
    });

  const front = bySlug.get('');
  if (!front)
    throw new Error(
      `${version.path} has no front page (index.md at the version root)`
    );
  const { pages } = readFrontmatter<Listed>(front);
  return {
    sidebar: [
      {
        title: FRONT_PAGE_NAV_TITLE,
        slug: '',
        writtenFor: undefined,
        items: []
      },
      ...nodes('', pages)
    ]
  };
}

/** The site's redirects, for Next's `redirects` config: every `redirects.yaml` under the root (see listRedirects). */
export function readRedirects(versions: DocsVersion[]) {
  // Next rejects a redirect with a key it doesn't know, so `file` stays behind.
  return listRedirects(versions).map(({ source, destination, permanent }) => ({
    source,
    destination,
    permanent
  }));
}

/**
 * The redirects every `redirects.yaml` under the root lists, with the file each
 * came from, relative to the root. A file holds a `permanent` map, a
 * `temporary` map, or both, from source pattern to destination as Next's
 * `redirects` config takes them, relative to the URL of the file's directory:
 * in `ice/3.8/services/redirects.yaml` both are under `/ice/3.8/services`, and
 * `.` is that URL itself. Its `include` list names files beside it of the same
 * shape. Throws when a destination names a page that does not exist.
 */
export function listRedirects(versions: DocsVersion[]) {
  const pages = new Set(
    versions.flatMap((version) =>
      listPages(version).map((page) => pageHref(version, page.slug))
    )
  );
  const read = (
    file: string
  ): {
    file: string;
    source: string;
    destination: string;
    permanent: boolean;
  }[] => {
    const directory = path
      .relative(CONTENT_ROOT, path.dirname(file))
      .split(path.sep)
      .join('/');
    const prefix = directory ? `/${directory}` : '';
    const under = (relative: string) => {
      if (relative === '.') return prefix || '/';
      if (relative.startsWith('?') || relative.startsWith('#'))
        return (prefix || '/') + relative;
      return `${prefix}/${relative}`;
    };
    const doc = yamlLoad(fs.readFileSync(file, 'utf8')) as {
      include?: string[];
      permanent?: Record<string, string>;
      temporary?: Record<string, string>;
    };
    const where = path.relative(CONTENT_ROOT, file);
    const own = [
      ...Object.entries(doc.permanent ?? {}).map(
        (entry) => [...entry, true] as const
      ),
      ...Object.entries(doc.temporary ?? {}).map(
        (entry) => [...entry, false] as const
      )
    ].map(([source, destination, permanent]) => {
      const page = under(destination).split(/[?#]/)[0];
      // A destination with a route parameter, `:rest*`, is not one page.
      if (!page.includes(':') && !pages.has(page))
        throw new Error(
          `${where} sends ${source} to ${page}, which is not a page`
        );
      return {
        file: where,
        source: under(source),
        destination: under(destination),
        permanent
      };
    });
    return [
      ...own,
      ...(doc.include ?? []).flatMap((name) =>
        read(path.join(path.dirname(file), name))
      )
    ];
  };
  return redirectFiles(CONTENT_ROOT).flatMap(read);
}

/** A version's API reference pages, from its `api-links.yaml`. */
export function readApiLinks(version: DocsVersion): ApiLinks {
  return yamlLoad(
    fs.readFileSync(
      path.join(CONTENT_ROOT, version.path, 'api-links.yaml'),
      'utf8'
    )
  ) as ApiLinks;
}

/** A snippet reader bound to a version: resolves `file=` relative to `<root>/<version>/`. */
export function snippetReader(version: DocsVersion): (file: string) => string {
  const base = path.join(CONTENT_ROOT, version.path);
  return (file: string) => fs.readFileSync(path.join(base, file), 'utf8');
}
