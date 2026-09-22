// Copyright (c) ZeroC, Inc.
//
// Pure navigation model: turn a parsed navigation.yaml — one recursive tree, the
// manual's table of contents — into the pieces a page needs: the sidebar with
// its active branch, the breadcrumb trail, and the previous/next links. No
// imports, so it is unit-testable with plain objects.
//
// The tree mirrors the chapter structure of the Ice manual, and the content
// tree mirrors it in turn: a node's page is a directory inside the group's. Nodes
// name pages by name, which is globally unique within a version (`enumerations`,
// `ice-default-properties`); where a page sits, and so its slug and URL, comes
// from the filesystem.

/** A node in the authored navigation tree. May be a link, a group, or both. */
export interface NavNode {
  title: string;
  /** The name of the page this node links to (a group can have its own page). */
  page?: string;
  /** Child nodes (makes this an expandable group). */
  items?: NavNode[];
}

/** Diátaxis-derived page kinds a page may declare in its frontmatter. */
export type PageType =
  | 'tutorial'
  | 'how-to'
  | 'concept'
  | 'reference'
  | 'troubleshooting'
  | 'release-note';

export interface PreviousVersions {
  label: string;
  url: string;
}

export interface NavDoc {
  version: string;
  languages: string[];
  /** `latest` gets no banner; anything else gets an "older version" notice. */
  status?: 'latest' | 'maintenance' | 'archived';
  /** Optional link to older docs kept on the previous platform. */
  previousVersions?: PreviousVersions;
  /** The table of contents. */
  sidebar: NavNode[];
}

/** A resolved sidebar node ready to render (serializable: passed server -> client). */
export interface SideNavNode {
  title: string;
  /** Absent for a group with no page of its own. */
  href?: string;
  /** The languages the page is written for; absent when it is written for all. */
  writtenFor?: string[];
  /** True when this node is the page currently being viewed. */
  active: boolean;
  items: SideNavNode[];
}

export interface BuildSideNavOptions {
  version: string;
  /** The name of the page currently being viewed. */
  currentPage: string;
  /** A page's slug. */
  slugOf: (page: string) => string;
  /** The languages a page is written for; `undefined` when it is written for all. */
  writtenFor: (page: string) => string[] | undefined;
}

/**
 * The label a group's own page takes once it moves inside the group.
 */
export const GROUP_OVERVIEW_TITLE = 'Overview';

/**
 * Resolve the authored tree into a renderable sidebar: every node is kept (so
 * the manual's full shape shows), with a link for each page, and `active` set
 * on the current page.
 */
export function buildSideNav(
  nodes: NavNode[],
  opts: BuildSideNavOptions
): SideNavNode[] {
  return (nodes ?? []).map((node) => {
    const href = node.page
      ? pageHref(opts.version, opts.slugOf(node.page))
      : undefined;
    const writtenFor = node.page ? opts.writtenFor(node.page) : undefined;
    const active = !!node.page && node.page === opts.currentPage;
    const items = buildSideNav(node.items ?? [], opts);

    // A group that also has a page of its own would have to answer two
    // gestures with one row: navigate, and open. Splitting them means the
    // whole row — title included — becomes the toggle, and the page moves to
    // an "Overview" child where it is still one click away. Clicking a group
    // title is how readers expect to open it, and how Stripe's sidebar reads.
    if (items.length > 0 && href) {
      return {
        title: node.title,
        active: false,
        items: [
          { title: GROUP_OVERVIEW_TITLE, href, writtenFor, active, items: [] },
          ...items
        ]
      };
    }

    return { title: node.title, href, writtenFor, active, items };
  });
}

/** The URL of the page with `slug`; the front page, whose slug is empty, is at the root. */
export function pageHref(version: string, slug?: string): string {
  return slug ? `/ice/${version}/${slug}` : `/ice/${version}`;
}

/** Whether a resolved node is, or contains, the active page (used to auto-expand). */
export function containsActive(node: SideNavNode): boolean {
  return node.active || node.items.some(containsActive);
}

/**
 * A sidebar group's key: the titles (or hrefs) on the path down to it.
 *
 * Deliberately not positional, so a key names the same group whatever is
 * rendered above it.
 */
export function sideNavKey(path: readonly string[]): string {
  return path.join(' > ');
}

/**
 * The keys of every group on the way down to the active page: what the sidebar
 * opens on its own, so the current page is always visible. Keys are built the
 * way the sidebar builds them (see `sideNavKey`), so the two agree.
 */
export function activeTrailKeys(
  nodes: SideNavNode[],
  path: readonly string[] = []
): string[] {
  const out: string[] = [];
  for (const node of nodes) {
    const nodePath = [...path, node.href ?? node.title];
    if (node.items.length > 0 && containsActive(node)) {
      out.push(sideNavKey(nodePath), ...activeTrailKeys(node.items, nodePath));
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Tree lookups
// ---------------------------------------------------------------------------

/**
 * The path down to `page`: every ancestor group, then the node itself. `null`
 * when the page is not in the tree.
 */
export function trailTo(nodes: NavNode[], page: string): NavNode[] | null {
  for (const node of nodes ?? []) {
    if (node.page === page) return [node];
    const found = trailTo(node.items ?? [], page);
    if (found) return [node, ...found];
  }
  return null;
}

/** Every page the tree names, in reading order. */
export function navigationPages(nodes: NavNode[]): string[] {
  const out: string[] = [];
  const walk = (items: NavNode[]) => {
    for (const node of items ?? []) {
      if (node.page) out.push(node.page);
      walk(node.items ?? []);
    }
  };
  walk(nodes);
  return out;
}

// ---------------------------------------------------------------------------
// Breadcrumbs and sequential navigation
// ---------------------------------------------------------------------------

export interface Crumb {
  title: string;
  href?: string;
}

/** What the root of every breadcrumb trail is called. */
export const MANUAL_TITLE = 'Ice Manual';

/**
 * The trail from the manual's front page down to `page`: the manual itself,
 * then every ancestor group, then the page. Groups without a page of their own
 * are shown as plain text (no href). The last crumb is the current page and is
 * never a link. Empty when the page is not in the tree.
 */
export function breadcrumbs(
  nav: Pick<NavDoc, 'sidebar'>,
  page: string,
  opts: BuildSideNavOptions
): Crumb[] {
  const trail = trailTo(nav.sidebar, page);
  if (!trail) return [];

  const crumbs: Crumb[] = [
    { title: MANUAL_TITLE, href: pageHref(opts.version) },
    ...trail.map((node) =>
      node.page
        ? {
            title: node.title,
            href: pageHref(opts.version, opts.slugOf(node.page))
          }
        : { title: node.title }
    )
  ];
  return crumbs.map((crumb, i) =>
    i === crumbs.length - 1 ? { title: crumb.title } : crumb
  );
}

export interface PageLink {
  title: string;
  href: string;
}

/**
 * The previous and next pages in reading order for a reader of `language` —
 * the tree walked depth-first, so the last page of one chapter leads into the
 * first page of the next. Only the pages the sidebar shows that reader take
 * part: those written for the language, plus the page itself, so "next" never
 * points at a page they would not find there.
 */
export function prevNext(
  nodes: NavNode[],
  page: string,
  opts: BuildSideNavOptions,
  language: string
): { prev?: PageLink; next?: PageLink } {
  const flat: NavNode[] = [];
  const walk = (items: NavNode[]) => {
    for (const node of items ?? []) {
      if (node.page) {
        const writtenFor = opts.writtenFor(node.page);
        if (node.page === page || !writtenFor || writtenFor.includes(language))
          flat.push(node);
      }
      walk(node.items ?? []);
    }
  };
  walk(nodes);

  const i = flat.findIndex((n) => n.page === page);
  if (i === -1) return {};
  const link = (node?: NavNode): PageLink | undefined =>
    node?.page
      ? {
          title: node.title,
          href: pageHref(opts.version, opts.slugOf(node.page))
        }
      : undefined;
  return { prev: link(flat[i - 1]), next: link(flat[i + 1]) };
}

// ---------------------------------------------------------------------------
// Languages
// ---------------------------------------------------------------------------

// The mapping a reader sees before they have chosen one, and where the choice
// is kept in the browser.
export const DEFAULT_LANGUAGE = 'cpp';
export const LANGUAGE_STORAGE_KEY = 'language';

// Display names for programming-language slugs, in the manual's canonical order.
export const LANGUAGE_LABELS: Record<string, string> = {
  cpp: 'C++',
  csharp: 'C#',
  java: 'Java',
  js: 'JavaScript',
  matlab: 'MATLAB',
  php: 'PHP',
  python: 'Python',
  ruby: 'Ruby',
  swift: 'Swift'
};

/** Human-readable label for a language slug (falls back to the slug itself). */
export function languageLabel(language: string): string {
  return LANGUAGE_LABELS[language] ?? language;
}
