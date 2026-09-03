// Copyright (c) ZeroC, Inc.
//
// Cross-page link resolution.
//
// Migrated content links to other pages by *page name*, relative to the page
// being read (`[Object Adapters](../object-adapters)`) — the shape the Confluence
// export produced. Resolving those relatively in the browser is fragile: the
// answer depends on how deep the current URL happens to be, so any change to the
// information architecture silently breaks thousands of links.
//
// Instead we resolve links at build time against a *page index* keyed by the
// page's final slug segment, which is stable and globally unique. A page can
// move from `learn/slice/enumerations` to `reference/slice/enumerations` and
// every link to it keeps working, untouched.
//
// Pure and dependency-free, so it is unit-testable with plain objects.

/** slug segment (`enumerations`) -> full page path (`learn/slice/enumerations`). */
export type PageIndex = Record<string, string>;

/** A page as the index sees it: where it lives, and its stable id. */
export interface PageEntry {
  path: string;
  /** The page's `id` frontmatter — stable across moves and renames. */
  id?: string;
}

/**
 * Index every page by its final path segment, by its full path, and by its
 * stable id, all lower-cased (authored links do not always match the slug's
 * case). Indexing by id is what keeps links working when a page is renamed as
 * part of a move — `the-ice-threading-model` becoming `learn/threading` does not
 * break the 48 pages that link to it.
 *
 * A collision between two pages' final segments is reported by `duplicates` and
 * resolves to the first path in sorted order (deterministic).
 */
export function buildPageIndex(
  pages: (string | PageEntry)[]
): { index: PageIndex; duplicates: string[] } {
  const entries = [...pages]
    .map((p) => (typeof p === 'string' ? { path: p } : p))
    .sort((a, b) => a.path.localeCompare(b.path));
  const index: PageIndex = {};
  const duplicates: string[] = [];

  // Three passes, weakest key last, so a page's own path always wins over
  // another page's final segment, and both win over an id alias.
  for (const { path } of entries) index[path.toLowerCase()] = path;

  const bySegment: Record<string, string> = {};
  for (const { path } of entries) {
    const key = path.split('/').pop()!.toLowerCase();
    if (key === path.toLowerCase()) continue; // already indexed by its own path
    if (bySegment[key] && bySegment[key] !== path) duplicates.push(key);
    else bySegment[key] ??= path;
  }
  for (const [key, path] of Object.entries(bySegment)) index[key] ??= path;

  for (const { path, id } of entries) {
    if (id) index[id.toLowerCase()] ??= path;
  }

  return { index, duplicates };
}

export interface LinkContext {
  version: string;
  language: string;
  index: PageIndex;
}

export interface ResolvedLink {
  href: string;
  /** False when the link points at a page name that is not in the index. */
  resolved: boolean;
}

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i;
const MAILTO = /^mailto:/i;

/**
 * Resolve one authored href to a site URL.
 *
 * - external / mailto / in-page anchors / already-absolute: unchanged
 * - `attachments/...`: left alone (assets, not pages)
 * - anything else: the final path segment is looked up in the page index and
 *   rewritten to `/ice/<version>/<language>/<path>`, preserving `#anchor`.
 */
export function resolveDocLink(href: string, ctx: LinkContext): ResolvedLink {
  const raw = (href ?? '').trim();
  if (!raw) return { href: raw, resolved: true };
  if (EXTERNAL.test(raw) || MAILTO.test(raw)) return { href: raw, resolved: true };
  if (raw.startsWith('#')) return { href: raw, resolved: true };
  if (raw.startsWith('/')) return { href: raw, resolved: true };

  const hashAt = raw.indexOf('#');
  const path = hashAt === -1 ? raw : raw.slice(0, hashAt);
  const hash = hashAt === -1 ? '' : raw.slice(hashAt);

  // Drop the `./` and `../` prefixes the export produced: they encoded "a sibling
  // page", not a real filesystem relationship.
  const segments = path.split('/').filter((s) => s !== '' && s !== '.' && s !== '..');
  if (segments.length === 0) return { href: raw, resolved: true };
  if (segments[0] === 'attachments') return { href: raw, resolved: true };

  // A spelled-out path is unambiguous, so try it before the bare page name.
  const full = decodeURIComponent(segments.join('/')).toLowerCase();
  const key = decodeURIComponent(segments[segments.length - 1]).toLowerCase();
  const target = ctx.index[full] ?? ctx.index[key];
  if (!target) return { href: raw, resolved: false };

  return { href: `/ice/${ctx.version}/${ctx.language}/${target}${hash}`, resolved: true };
}
