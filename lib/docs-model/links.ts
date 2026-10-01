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
// page's name, the last segment of its slug, which is stable and globally
// unique. A page can move from `learn/slice/enumerations` to
// `reference/slice/enumerations` and every link to it keeps working, untouched.
//
// Pure, so it is unit-testable with plain objects.

import { pageHref } from './nav.ts';

/** page name (`enumerations`) or slug -> slug (`learn/slice/enumerations`). */
export type PageIndex = Record<string, string>;

/**
 * Index every page by its slug and by its name, lower-cased (authored links do
 * not always match the name's case).
 *
 * A collision between two pages' names is reported by `duplicates` and resolves
 * to the first slug in sorted order (deterministic).
 */
export function buildPageIndex(slugs: string[]): {
  index: PageIndex;
  duplicates: string[];
} {
  const sorted = [...slugs].sort((a, b) => a.localeCompare(b));
  const index: PageIndex = {};
  const duplicates: string[] = [];

  // Two passes, so a page's own slug always wins over another page's name.
  for (const slug of sorted) index[slug.toLowerCase()] = slug;

  const byName: Record<string, string> = {};
  for (const slug of sorted) {
    const name = slug.split('/').pop()!.toLowerCase();
    if (name in byName) duplicates.push(name);
    else byName[name] = slug;
  }
  for (const [name, slug] of Object.entries(byName)) index[name] ??= slug;

  return { index, duplicates };
}

export interface LinkContext {
  version: string;
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
 * - anything else: the page named by the link is looked up in the page index
 *   and rewritten to `/ice/<version>/<slug>`, preserving the query, such as a
 *   `?lang=` that names the language mapping to show, and `#anchor`.
 */
export function resolveDocLink(href: string, ctx: LinkContext): ResolvedLink {
  const raw = (href ?? '').trim();
  if (!raw) return { href: raw, resolved: true };
  if (EXTERNAL.test(raw) || MAILTO.test(raw))
    return { href: raw, resolved: true };
  if (raw.startsWith('#')) return { href: raw, resolved: true };
  if (raw.startsWith('/')) return { href: raw, resolved: true };

  const hashAt = raw.indexOf('#');
  const beforeHash = hashAt === -1 ? raw : raw.slice(0, hashAt);
  const hash = hashAt === -1 ? '' : raw.slice(hashAt);
  const queryAt = beforeHash.indexOf('?');
  const path = queryAt === -1 ? beforeHash : beforeHash.slice(0, queryAt);
  const query = queryAt === -1 ? '' : beforeHash.slice(queryAt);

  // Drop the `./` and `../` prefixes the export produced: they encoded "a sibling
  // page", not a real filesystem relationship.
  const segments = path
    .split('/')
    .filter((s) => s !== '' && s !== '.' && s !== '..');
  if (segments.length === 0) return { href: raw, resolved: true };
  if (segments[0] === 'attachments') return { href: raw, resolved: true };

  // A spelled-out slug is unambiguous, so try it before the bare page name.
  const full = decodeURIComponent(segments.join('/')).toLowerCase();
  const name = decodeURIComponent(segments[segments.length - 1]).toLowerCase();
  const target = ctx.index[full] ?? ctx.index[name];
  if (!target) return { href: raw, resolved: false };

  return { href: pageHref(ctx.version, target) + query + hash, resolved: true };
}
