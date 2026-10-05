// Copyright (c) ZeroC, Inc.
//
// Cross-page link resolution.
//
// A link names a page by its slug under the version, as in
// `slice/user-defined-types/enumerations`, or by a path relative to the page it
// is on, as in `../structures`, which starts with `.` or `..`. Either is
// resolved at build time against the version's page index, so a link to a page
// that does not exist is reported rather than rendered as a dead link. The lookup
// is case-insensitive and URL-decoded, since authored links do not always match
// the slug's spelling.
//
// A link to the API reference names a type (`api:Ice/Communicator`) rather
// than a URL, since each language's API reference has its own page for it. It
// resolves against the version's `api-links.yaml`, once per language.
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
  /** The slug of the page the link is on; `''` for the front page. */
  slug: string;
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
 * - a path starting with `.` or `..`: joined to the page's slug
 * - anything else: a slug
 *
 * The slug is looked up in the page index and rewritten to
 * `/ice/<version>/<slug>`, preserving the query, such as a `?lang=` that names
 * the language mapping to show, and `#anchor`.
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

  const relative = /^\.\.?(?:\/|$)/.test(path);
  const slug = (relative ? joinSlug(ctx.slug, path) : path).toLowerCase();
  const target = ctx.index[decodeURIComponent(slug)];
  if (target === undefined) return { href: raw, resolved: false };

  return { href: pageHref(ctx.version, target) + query + hash, resolved: true };
}

/**
 * Join a relative path to the slug of the page it is on: `..` steps up one
 * page. A path that steps above the version comes back unchanged, so it is
 * reported as unresolved.
 */
function joinSlug(slug: string, relative: string): string {
  const segments = slug ? slug.split('/') : [];
  for (const segment of relative.split('/')) {
    if (segment === '' || segment === '.') continue;
    if (segment === '..') {
      if (segments.length === 0) return relative;
      segments.pop();
    } else segments.push(segment);
  }
  return segments.join('/');
}

/** What starts a link to a type in the API reference: `api:Ice/Communicator`. */
export const API_SCHEME = 'api:';

/**
 * A version's `api-links.yaml`: for each type, by `<Module>/<Type>`, the URL of
 * its page in the API reference of each language that has one.
 */
export type ApiLinks = Record<string, Record<string, string>>;

/** What a link to a type renders as for the readers of some languages. */
export interface ApiLinkVariant {
  /** The type's page in their API reference; empty when it has none. */
  href: string;
  langs: string[];
}

/**
 * Resolve a link to `type` (`Ice/Communicator`) for the readers of
 * `languages`: one variant per page, plus one with an empty href for the
 * languages whose API reference has no page for it. Undefined when the table
 * does not list the type.
 */
export function resolveApiLink(
  type: string,
  languages: string[],
  apiLinks: ApiLinks
): ApiLinkVariant[] | undefined {
  const pages = apiLinks[type];
  if (!pages) return undefined;

  const byHref = new Map<string, string[]>();
  for (const language of languages) {
    const href = pages[language] ?? '';
    byHref.set(href, [...(byHref.get(href) ?? []), language]);
  }
  return [...byHref].map(([href, langs]) => ({ href, langs }));
}
