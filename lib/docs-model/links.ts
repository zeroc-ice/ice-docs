// Copyright (c) ZeroC, Inc.
//
// Cross-page link resolution.
//
// A link names a page by its slug under the version, as in
// `slice/user-defined-types/enumerations`, and is resolved at build time against
// the version's page index, so a link to a page that does not exist is reported
// rather than rendered as a dead link. The lookup is case-insensitive and
// URL-decoded, since authored links do not always match the slug's spelling.
//
// Pure, so it is unit-testable with plain objects.

import { pageHref } from './nav.ts';

/** lower-cased slug -> slug (`learn/slice/enumerations`). */
export type PageIndex = Record<string, string>;

/** Index every page by its slug, lower-cased. */
export function buildPageIndex(slugs: string[]): PageIndex {
  const index: PageIndex = {};
  for (const slug of slugs) index[slug.toLowerCase()] = slug;
  return index;
}

export interface LinkContext {
  version: string;
  index: PageIndex;
}

export interface ResolvedLink {
  href: string;
  /** False when the link names a page that is not in the index. */
  resolved: boolean;
}

const EXTERNAL = /^(?:[a-z][a-z0-9+.-]*:)?\/\//i;
const MAILTO = /^mailto:/i;

/**
 * Resolve one authored href to a site URL.
 *
 * - external / mailto / in-page anchors / already-absolute: unchanged
 * - anything else: the slug is looked up in the page index and rewritten to
 *   `/ice/<version>/<slug>`, preserving the query, such as a `?lang=` that
 *   names the language mapping to show, and `#anchor`.
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
  // A query or anchor alone, such as `?lang=java`, stays on the current page.
  if (path === '') return { href: raw, resolved: true };

  const slug = decodeURIComponent(path).toLowerCase();
  const target = ctx.index[slug];
  if (!target) return { href: raw, resolved: false };

  return { href: pageHref(ctx.version, target) + query + hash, resolved: true };
}
