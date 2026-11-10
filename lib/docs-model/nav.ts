// Copyright (c) ZeroC, Inc.
//
// Pure navigation model: turn the table of contents — one recursive
// tree of pages, read from the pages themselves — into the pieces a page needs:
// the sidebar with its active branch, the breadcrumb trail, and the
// previous/next links. No imports, so it is unit-testable with plain objects.

/** An entry in the table of contents: a page, or a group with no page of its own. */
export interface NavNode {
  title: string;
  /** The page's path under the version, as in its URL; absent on a group with no page of its own. */
  slug?: string;
  /** The languages the page is written for; absent when it is written for all. */
  writtenFor?: string[];
  /** The pages under it; a node with any is an expandable group. */
  items: NavNode[];
  /** What the sidebar says for the page, or for the group whose page it is; absent for its title. */
  sidebarLabel?: string;
}

/** Diátaxis-derived page kinds a page may declare in its frontmatter. */
export type PageType =
  | 'tutorial'
  | 'how-to'
  | 'concept'
  | 'reference'
  | 'troubleshooting'
  | 'release-note';

/** The documentation of one release: where it lives, which is also where it is served, and its settings. */
export interface DocsVersion {
  /** Its path under the content root, `ice/3.8`, and so its URL, `/ice/3.8`. */
  path: string;
  /** Its name as readers see it: `Ice 3.8`. */
  title: string;
  /** `latest` gets no banner; anything else gets an "older version" notice. */
  status?: 'latest' | 'maintenance' | 'archived';
  /** The language mappings it is written for. */
  languages: string[];
}

export interface NavDoc {
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

/**
 * Resolve the authored tree into a renderable sidebar: every node is kept (so
 * the full shape shows), with a link for each page.
 */
export function buildSideNav(
  nodes: NavNode[],
  version: DocsVersion
): SideNavNode[] {
  return nodes.map((node) => {
    const { writtenFor } = node;
    const items = buildSideNav(node.items, version);

    // A group with no page of its own has nothing to navigate to: its row only
    // opens it.
    if (node.slug === undefined)
      return { title: node.title, writtenFor, items };

    const href = pageHref(version, node.slug);

    // A group's row would have to answer two gestures: navigate to its page,
    // and open. Splitting them means the whole row — title included — becomes
    // the toggle, and the page moves to an "Overview" child where it is still
    // one click away. Clicking a group title is how readers expect to open it,
    // and how Stripe's sidebar reads.
    if (items.length > 0) {
      return {
        title: node.sidebarLabel ?? node.title,
        writtenFor,
        items: [
          {
            title: GROUP_OVERVIEW_TITLE,
            href,
            writtenFor,
            items: []
          },
          ...items
        ]
      };
    }

    return { title: node.sidebarLabel ?? node.title, href, writtenFor, items };
  });
}

/** The URL of the page with `slug` in `version`; the front page, whose slug is empty, is at the version's root. */
export function pageHref(version: DocsVersion, slug?: string): string {
  return slug ? `/${version.path}/${slug}` : `/${version.path}`;
}

/**
 * The URL of the Markdown copy of the page with `slug`: its URL with `.md`
 * appended, or, with `language`, of its text for that mapping,
 * `<page>/<language>.md`.
 */
export function markdownHref(
  version: DocsVersion,
  slug?: string,
  language?: string
): string {
  const page = pageHref(version, slug);
  return language ? `${page}/${language}.md` : `${page}.md`;
}

/**
 * The rewrite that serves a Markdown copy at its URL, for next.config.ts: the
 * route under `/md` (app/md/<version>) answers for the page's URL with `.md`
 * appended.
 */
export function markdownRewrite(version: DocsVersion) {
  return {
    source: `/${version.path}/:slug*.md`,
    destination: `/md/${version.path}/:slug*`
  };
}

/** The redirect that keeps a copy at one URL, for next.config.ts: a request at the route's own path goes to the `.md` URL. */
export function markdownRedirect(version: DocsVersion) {
  return {
    source: `/md/${version.path}/:slug*`,
    destination: `/${version.path}/:slug*.md`,
    permanent: true
  };
}

/** The Markdown copy a link is in, for markdownLink. */
export interface MarkdownLinkPage {
  /** The page the link is on. */
  slug: string;
  /** The mapping the copy's text is for; absent in a document for several mappings. */
  language?: string;
  /** The mappings the page at `slug` has a copy for; undefined when its text is one document. */
  copies: (slug: string) => string[] | undefined;
}

/**
 * Where a link goes in a Markdown copy. A link to a page goes to that page's
 * copy for the mapping its `?lang=` names, or else for the mapping the link's
 * copy is for, where the page has one, and otherwise to the page's `.md`; the
 * anchor stays. A link to the page itself, as a `?lang=` link names it, goes
 * the same way. Anything else, such as an image or an external page, is left
 * as it is.
 */
export function markdownLink(
  version: DocsVersion,
  href: string,
  on: MarkdownLinkPage
): string {
  if (href.startsWith('#')) return href;
  const hashAt = href.indexOf('#');
  const beforeHash = hashAt === -1 ? href : href.slice(0, hashAt);
  const hash = hashAt === -1 ? '' : href.slice(hashAt);
  const [path, query] = beforeHash.split('?');
  const root = pageHref(version);
  let target: string;
  if (path === '') target = on.slug;
  else if (path === root) target = '';
  else if (path.startsWith(`${root}/`)) target = path.slice(root.length + 1);
  else return href;
  const mapping = new URLSearchParams(query).get('lang') ?? on.language;
  const language =
    mapping && on.copies(target)?.includes(mapping) ? mapping : undefined;
  return markdownHref(version, target, language) + hash;
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

/**
 * The part of the sidebar a reader of `language` filtering by `query` sees: a
 * node whose title contains the query, ignoring case, with everything under it,
 * and the groups on the way down to each one. A node not written for the
 * language never matches, so no group shows up empty.
 */
export function filterSideNav(
  nodes: SideNavNode[],
  query: string,
  language: string
): SideNavNode[] {
  const needle = query.toLowerCase();
  const filter = (nodes: SideNavNode[]): SideNavNode[] =>
    nodes.flatMap((node) => {
      if (node.writtenFor && !node.writtenFor.includes(language)) return [];
      if (node.title.toLowerCase().includes(needle)) return [node];
      const items = filter(node.items);
      return items.length > 0 ? [{ ...node, items }] : [];
    });
  return filter(nodes);
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
      if (node.slug !== undefined) out.push(node.slug);
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

/**
 * The Open Graph fields every page shares. Next does not merge a page's
 * `openGraph` with the layout's, so a page that sets its own image spreads
 * these in.
 */
export const OPEN_GRAPH = {
  type: 'website',
  siteName: SITE_TITLE,
  locale: 'en_US'
} as const;

/** The site's name for one version; every page of that version's tab title ends with it. */
export function versionTitle(version: DocsVersion): string {
  return `${version.title} Documentation`;
}

/**
 * The trail from the front page down to the page at `slug`: the front
 * page, then every ancestor that is a page, then the page. The last crumb is
 * the current page and is never a link. Empty for the front page itself, and
 * when the page is not in the tree.
 */
export function breadcrumbs(
  nodes: NavNode[],
  version: DocsVersion,
  slug: string
): Crumb[] {
  const trail = slug ? trailTo(nodes, slug) : null;
  if (!trail) return [];

  const crumbs: Crumb[] = [
    { title: SITE_TITLE, href: pageHref(version) },
    // A folder with no page of its own is not a place to go, so it has no
    // crumb: https://www.nngroup.com/articles/breadcrumbs/ (guideline 6).
    ...trail.flatMap((node) =>
      node.slug === undefined
        ? []
        : [{ title: node.title, href: pageHref(version, node.slug) }]
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
  version: DocsVersion,
  slug: string,
  language: string
): { prev?: PageLink; next?: PageLink } {
  const flat: { title: string; slug: string }[] = [];
  const walk = (items: NavNode[]) => {
    for (const node of items) {
      const { title, slug: nodeSlug, writtenFor } = node;
      if (
        nodeSlug !== undefined &&
        (nodeSlug === slug || !writtenFor || writtenFor.includes(language))
      )
        flat.push({ title, slug: nodeSlug });
      walk(node.items);
    }
  };
  walk(nodes);

  const i = flat.findIndex((n) => n.slug === slug);
  if (i === -1) return {};
  const link = (node?: (typeof flat)[number]): PageLink | undefined =>
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
