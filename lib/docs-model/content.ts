// Copyright (c) ZeroC, Inc.
//
// Filesystem layer for the Ice docs content model. Reads page sources and
// discovers routes under a content root laid out as:
//
//   <root>/<version>/version.yaml              the version's settings
//   <root>/<version>/index.md                  the front page
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
// overlay is the whole page for its language. A shared page that applies to
// only some languages lists them under `languages:` in its frontmatter.
//
// Unit-testable with `node lib/docs-model/content.test.ts` and usable from Next
// server components. Pure content transforms live in ./resolve.ts; the route
// composes the two.

import fs from 'node:fs';
import path from 'node:path';
import { load as yamlLoad } from 'js-yaml';

import {
  FRONT_PAGE_NAV_TITLE,
  pageHref,
  type NavDoc,
  type NavNode,
  type VersionSettings
} from './nav.ts';
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

/** A version's settings, read from its `version.yaml`. */
function readVersionSettings(root: string, version: string): VersionSettings {
  return yamlLoad(
    fs.readFileSync(path.join(root, version, 'version.yaml'), 'utf8')
  ) as VersionSettings;
}

/**
 * A version's settings, from its `version.yaml`, and its table of contents,
 * read from its pages: the front page's frontmatter lists the chapters under
 * `pages:`, and a page with children lists them the same way. The front page
 * is the first entry, ahead of the chapters, under its own label; every other
 * node takes its page's title. Throws when the version has no front page, or
 * when a page lists a page it does not contain.
 */
export function readNavigation(root: string, version: string): NavDoc {
  type Listed = { title: string; pages?: string[]; languages?: unknown };
  const bySlug = new Map(listPages(root, version).map((p) => [p.slug, p]));
  const nodes = (parent: string, names: string[] = []): NavNode[] =>
    names.map((name) => {
      const slug = parent ? `${parent}/${name}` : name;
      const page = bySlug.get(slug);
      if (!page)
        throw new Error(
          `${version}/${parent || 'index.md'} lists "${name}", which is not a page in it`
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
      `${version} has no front page (index.md at the version root)`
    );
  const { pages } = readFrontmatter<Listed>(front);
  return {
    ...readVersionSettings(root, version),
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

/**
 * The site's redirects, for Next's `redirects` config: the site root, `/ice`,
 * and `/ice/latest/…` go to the version whose `version.yaml` says `status: latest`,
 * and each URL a version's pages had on the Scroll Viewport site goes to its
 * page here. Throws unless exactly one version says `status: latest`, and when a
 * `redirects.yaml` names a page its version doesn't have.
 */
export function readRedirects(root: string) {
  const versions = listVersions(root);
  const settings = new Map(
    versions.map((version) => [version, readVersionSettings(root, version)])
  );
  const latest = versions.filter(
    (version) => settings.get(version)!.status === 'latest'
  );
  if (latest.length !== 1)
    throw new Error(
      `expected one version with status: latest, found ${latest.length}`
    );
  const front = pageHref(latest[0]);
  return [
    // Temporary, since the latest version changes.
    { source: '/', destination: front, permanent: false },
    { source: '/ice', destination: front, permanent: false },
    {
      source: '/ice/latest/:path*',
      destination: `${front}/:path*`,
      permanent: false
    },
    ...versions.flatMap((version) =>
      scrollRedirects(root, version, settings.get(version)!.languages)
    )
  ];
}

/**
 * The redirects for the URLs a version's pages had on the Scroll Viewport site,
 * `/ice/<version>/<language>/<name>`, when the version has a `redirects.yaml`:
 * each goes to the page here with the same name, or the one `redirects.yaml`
 * names, keeping the language as `?lang=`.
 */
function scrollRedirects(root: string, version: string, languages: string[]) {
  const file = path.join(root, version, 'redirects.yaml');
  if (!fs.existsSync(file)) return [];
  const { renamed } = yamlLoad(fs.readFileSync(file, 'utf8')) as {
    renamed: Record<string, string>;
  };
  const slugs = new Map(
    listPages(root, version).map((page) => [page.name, page.slug])
  );
  // A page name here, with an optional heading anchor, keeping the language.
  const to = (target: string) => {
    const [name, anchor] = target.split('#');
    const slug = slugs.get(name);
    if (slug === undefined)
      throw new Error(
        `${version}/redirects.yaml names "${name}", which is not a page`
      );
    return `${pageHref(version, slug)}?lang=:lang${anchor ? `#${anchor}` : ''}`;
  };
  const scroll = `/ice/${version}/:lang(${languages.join('|')})`;
  return [
    // The Scroll Viewport site spelled `js` as `javascript`.
    {
      source: `/ice/${version}/javascript/:rest*`,
      destination: `/ice/${version}/js/:rest*`,
      permanent: true
    },
    ...[...slugs.keys()].map((name) => ({
      source: name ? `${scroll}/${name}` : scroll,
      destination: to(name),
      permanent: true
    })),
    ...Object.entries(renamed).map(([name, target]) => ({
      source: `${scroll}/${name}`,
      destination: to(target),
      permanent: true
    }))
  ];
}

/** A snippet reader bound to a version: resolves `file=` relative to `<root>/<version>/`. */
export function snippetReader(
  root: string,
  version: string
): (file: string) => string {
  const base = path.join(root, version);
  return (file: string) => fs.readFileSync(path.join(base, file), 'utf8');
}
