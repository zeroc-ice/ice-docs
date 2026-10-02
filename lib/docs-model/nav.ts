// Copyright (c) ZeroC, Inc.
//
// Pure navigation model: turn the table of contents — one recursive
// tree of pages, read from the pages themselves — into the pieces a page needs:
// the sidebar with its active branch, the breadcrumb trail, and the
// previous/next links. No imports, so it is unit-testable with plain objects.

/** A page in the table of contents. */
export interface NavNode {
  title: string;
  /** The page's path under the version, as in its URL. */
  slug: string;
  /** The languages the page is written for; absent when it is written for all. */
  writtenFor?: string[];
  /** The pages under it; a node with any is an expandable group. */
  items: NavNode[];
}

/** Diátaxis-derived page kinds a page may declare in its frontmatter. */
export type PageType =
  | 'tutorial'
  | 'how-to'
  | 'concept'
  | 'reference'
  | 'troubleshooting'
  | 'release-note';

/** A version's settings, from its `version.yaml`. */
export interface VersionSettings {
  /** The language mappings the version is written for. */
  languages: string[];
  /**
   * `latest` gets no banner and is where `/`, `/ice`, and `/ice/latest/…`
   * redirect; anything else gets an "older version" notice.
   */
  status?: 'latest' | 'maintenance' | 'archived';
}

export interface NavDoc extends VersionSettings {
  /** The table of contents. */
  sidebar: NavNode[];
}

/** A resolved sidebar node ready to render (serializable: passed server -> client). */
export interface SideNavNode {
  title: string;
  /** Absent on a group's row, whose page is its Overview entry. */
  href?: string;
  /** The languages the page is written for; absent when it is written for all. */
  writtenFor?: string[];
  items: SideNavNode[];
}

/**
 * The label a group's own page takes once it moves inside the group.
 */
export const GROUP_OVERVIEW_TITLE = 'Overview';

/** The label the front page takes in the sidebar, under the site's name in the header. */
export const FRONT_PAGE_NAV_TITLE = 'Documentation';

/**
 * Resolve the authored tree into a renderable sidebar: every node is kept (so
 * the full shape shows), with a link for each page.
 */
export function buildSideNav(nodes: NavNode[], version: string): SideNavNode[] {
  return nodes.map((node) => {
    const href = pageHref(version, node.slug);
    const { writtenFor } = node;
    const items = buildSideNav(node.items, version);

    // A group's row would have to answer two gestures: navigate to its page,
    // and open. Splitting them means the whole row — title included — becomes
    // the toggle, and the page moves to an "Overview" child where it is still
    // one click away. Clicking a group title is how readers expect to open it,
    // and how Stripe's sidebar reads.
    if (items.length > 0) {
      return {
        title: node.title,
        items: [
          { title: GROUP_OVERVIEW_TITLE, href, writtenFor, items: [] },
          ...items
        ]
      };
    }

    return { title: node.title, href, writtenFor, items };
  });
}

/** The URL of the page with `slug`; the front page, whose slug is empty, is at the root. */
export function pageHref(version: string, slug?: string): string {
  return slug ? `/ice/${version}/${slug}` : `/ice/${version}`;
}

/**
 * Whether a resolved node is, or contains, the active page, the one at
 * `activeHref` (used to auto-expand).
 */
function containsActive(node: SideNavNode, activeHref: string): boolean {
  return (
    node.href === activeHref ||
    node.items.some((item) => containsActive(item, activeHref))
  );
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
 * The keys of every group on the way down to the active page, the one at
 * `activeHref`: what the sidebar opens on its own, so the current page is
 * always visible. Keys are built the way the sidebar builds them (see
 * `sideNavKey`), so the two agree.
 */
export function activeTrailKeys(
  nodes: SideNavNode[],
  activeHref: string,
  path: readonly string[] = []
): string[] {
  const out: string[] = [];
  for (const node of nodes) {
    const nodePath = [...path, node.href ?? node.title];
    if (node.items.length > 0 && containsActive(node, activeHref)) {
      out.push(
        sideNavKey(nodePath),
        ...activeTrailKeys(node.items, activeHref, nodePath)
      );
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Tree lookups
// ---------------------------------------------------------------------------

/**
 * The path down to the page at `slug`: every ancestor group, then the node
 * itself. `null` when the page is not in the tree.
 */
export function trailTo(nodes: NavNode[], slug: string): NavNode[] | null {
  for (const node of nodes) {
    if (node.slug === slug) return [node];
    const found = trailTo(node.items, slug);
    if (found) return [node, ...found];
  }
  return null;
}

/** The slug of every page in the tree, in reading order. */
export function navigationPages(nodes: NavNode[]): string[] {
  const out: string[] = [];
  const walk = (items: NavNode[]) => {
    for (const node of items) {
      out.push(node.slug);
      walk(node.items);
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

/** The site's name, and the root of every breadcrumb trail. */
export const SITE_TITLE = 'Ice Documentation';

/** The site's name for one version, which every page of that version's tab title ends with. */
export function versionTitle(version: string): string {
  return `Ice ${version} Documentation`;
}

/**
 * The trail from the front page down to the page at `slug`: the front
 * page, then every ancestor, then the page. The last crumb is the current page
 * and is never a link. Empty for the front page itself, and when the page is
 * not in the tree.
 */
export function breadcrumbs(
  nodes: NavNode[],
  version: string,
  slug: string
): Crumb[] {
  const trail = slug ? trailTo(nodes, slug) : null;
  if (!trail) return [];

  const crumbs: Crumb[] = [
    { title: SITE_TITLE, href: pageHref(version) },
    ...trail.map((node) => ({
      title: node.title,
      href: pageHref(version, node.slug)
    }))
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
  version: string,
  slug: string,
  language: string
): { prev?: PageLink; next?: PageLink } {
  const flat: NavNode[] = [];
  const walk = (items: NavNode[]) => {
    for (const node of items) {
      const { writtenFor } = node;
      if (node.slug === slug || !writtenFor || writtenFor.includes(language))
        flat.push(node);
      walk(node.items);
    }
  };
  walk(nodes);

  const i = flat.findIndex((n) => n.slug === slug);
  if (i === -1) return {};
  const link = (node?: NavNode): PageLink | undefined =>
    node && { title: node.title, href: pageHref(version, node.slug) };
  return { prev: link(flat[i - 1]), next: link(flat[i + 1]) };
}

// ---------------------------------------------------------------------------
// Languages
// ---------------------------------------------------------------------------

// The mapping a reader sees before they have chosen one, and where the choice
// is kept in the browser.
export const DEFAULT_LANGUAGE = 'cpp';
export const LANGUAGE_STORAGE_KEY = 'language';

// Display names for programming-language slugs, in canonical order.
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
