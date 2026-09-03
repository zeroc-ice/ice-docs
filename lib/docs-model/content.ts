// Copyright (c) ZeroC, Inc.
//
// Filesystem layer for the Ice docs content model. Reads page sources and
// discovers routes under a content root laid out as:
//
//   <root>/<version>/navigation.yaml
//   <root>/<version>/shared/<slug>.md
//   <root>/<version>/languages/<lang>/<slug>.md
//   <root>/<version>/examples/...            (snippet sources)
//
// Only depends on node builtins, so it is unit-testable with
// `node lib/docs-model/content.test.ts` and usable from Next server components.
// Pure content transforms live in ./resolve.ts; the route composes the two.

import fs from 'node:fs';
import path from 'node:path';

import { FRONTMATTER_RE } from './resolve.ts';

export const DEFAULT_CONTENT_ROOT = 'content';

function readIfExists(file: string): string | null {
  return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : null;
}

/** Version directories look like `3.8`, `0.6`, etc. — this filters out any non-version dirs. */
export function listVersions(root: string): string[] {
  if (!fs.existsSync(root)) return [];
  return fs
    .readdirSync(root)
    .filter((name) => /^\d+\.\d+/.test(name) && fs.statSync(path.join(root, name)).isDirectory())
    .sort();
}

function collectMarkdownSlugs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const out: string[] = [];
  const walk = (current: string) => {
    for (const entry of fs.readdirSync(current)) {
      const abs = path.join(current, entry);
      if (fs.statSync(abs).isDirectory()) walk(abs);
      else if (entry.endsWith('.md')) {
        out.push(path.relative(dir, abs).replace(/\.md$/, '').split(path.sep).join('/'));
      }
    }
  };
  walk(dir);
  return out;
}

/** Every page slug in a version: the union of shared pages and all language overlays. */
export function listSlugs(root: string, version: string): string[] {
  const base = path.join(root, version);
  const slugs = new Set(collectMarkdownSlugs(path.join(base, 'shared')));
  const langDir = path.join(base, 'languages');
  if (fs.existsSync(langDir)) {
    for (const lang of fs.readdirSync(langDir)) {
      for (const slug of collectMarkdownSlugs(path.join(langDir, lang))) slugs.add(slug);
    }
  }
  return [...slugs].sort();
}

/** Read the shared page and the language overlay for a slug (either may be absent). */
export function readPageSources(
  root: string,
  version: string,
  language: string,
  slug: string
): { shared: string | null; overlay: string | null } {
  const base = path.join(root, version);
  return {
    shared: readIfExists(path.join(base, 'shared', `${slug}.md`)),
    overlay: readIfExists(path.join(base, 'languages', language, `${slug}.md`)),
  };
}

/** Whether a page exists in a version for a language (shared page or language overlay). */
export function pageExists(root: string, version: string, language: string, slug: string): boolean {
  const { shared, overlay } = readPageSources(root, version, language, slug);
  return shared !== null || overlay !== null;
}

/**
 * Which of `allLanguages` a page is available in: all of them if a shared page
 * exists, otherwise just the languages that have an overlay/page for the slug.
 */
export function pageLanguages(
  root: string,
  version: string,
  slug: string,
  allLanguages: string[]
): string[] {
  const base = path.join(root, version);
  if (fs.existsSync(path.join(base, 'shared', `${slug}.md`))) return [...allLanguages];
  return allLanguages.filter((lang) =>
    fs.existsSync(path.join(base, 'languages', lang, `${slug}.md`))
  );
}

export interface PageParam {
  version: string;
  language: string;
  slug: string;
}

/** Every (version, language, slug) that should be statically generated. */
export function listPageParams(root: string, languagesByVersion: Record<string, string[]>): PageParam[] {
  const params: PageParam[] = [];
  for (const version of listVersions(root)) {
    const langs = languagesByVersion[version] ?? [];
    for (const slug of listSlugs(root, version)) {
      for (const language of pageLanguages(root, version, slug, langs)) {
        params.push({ version, language, slug });
      }
    }
  }
  return params;
}

/** Raw navigation.yaml text for a version (parsed by the caller with js-yaml). */
export function readNavigationYaml(root: string, version: string): string | null {
  return readIfExists(path.join(root, version, 'navigation.yaml'));
}

/** The `id:` line of a page's frontmatter, without parsing the whole document. */
function readPageId(file: string): string | undefined {
  const source = readIfExists(file);
  if (!source) return undefined;
  const frontmatter = FRONTMATTER_RE.exec(source);
  const id = frontmatter && /^id:\s*(.+)$/m.exec(frontmatter[1]);
  return id ? id[1].trim().replace(/^["']|["']$/g, '') : undefined;
}

export interface PageEntry {
  path: string;
  /** The page's `id` frontmatter — stable across moves and renames. */
  id?: string;
}

const pageEntryCache = new Map<string, PageEntry[]>();

/**
 * Every page in a version, with its stable id, for the cross-page link index.
 *
 * Pass a `language` to get only the pages that exist for it: a link resolved
 * against the whole version would happily point a Python reader at a page that
 * only exists in C++, and that URL is never generated.
 *
 * Cached per (root, version, language) in production: one build renders
 * thousands of pages and each would otherwise re-walk the whole content tree.
 * Never cached in development, where pages change while the server is running.
 */
export function listPageEntries(root: string, version: string, language?: string): PageEntry[] {
  const cacheable = process.env.NODE_ENV === 'production';
  // U+001F, not NUL: a NUL byte anywhere in a file makes git classify it as
  // binary, which excludes it from `* text=auto` normalization and from diffs.
  const key = [root, version, language ?? ''].join('\u001f');
  const cached = cacheable ? pageEntryCache.get(key) : undefined;
  if (cached) return cached;

  const base = path.join(root, version);
  const entries: PageEntry[] = [];
  for (const slug of listSlugs(root, version)) {
    const shared = path.join(base, 'shared', `${slug}.md`);
    const overlay = language ? path.join(base, 'languages', language, `${slug}.md`) : null;

    if (fs.existsSync(shared)) {
      entries.push({ path: slug, id: readPageId(shared) });
      continue;
    }
    // No shared page: this is a language-specific page. Include it only when it
    // exists for the language being rendered.
    if (overlay) {
      if (fs.existsSync(overlay)) entries.push({ path: slug, id: readPageId(overlay) });
      continue;
    }
    const langDir = path.join(base, 'languages');
    for (const lang of fs.existsSync(langDir) ? fs.readdirSync(langDir) : []) {
      const file = path.join(langDir, lang, `${slug}.md`);
      if (fs.existsSync(file)) {
        entries.push({ path: slug, id: readPageId(file) });
        break;
      }
    }
  }

  if (cacheable) pageEntryCache.set(key, entries);
  return entries;
}

/** A snippet reader bound to a version: resolves `file=` relative to `<root>/<version>/`. */
export function snippetReader(root: string, version: string): (file: string) => string {
  const base = path.join(root, version);
  return (file: string) => fs.readFileSync(path.join(base, file), 'utf8');
}
