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
  /** If set, this node is specific to one language and is shown only for it. */
  language?: string;
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
  /** Present when the page exists for this language; absent -> shown but not linkable. */
  href?: string;
  /** True when this node is the page currently being viewed. */
  active: boolean;
  items: SideNavNode[];
}

export interface BuildSideNavOptions {
  version: string;
  language: string;
  /** The name of the page currently being viewed. */
  currentPage: string;
  /** A page's slug when it exists for this language; `undefined` when it does not. */
  slugOf: (page: string) => string | undefined;
}

/**
 * The label a group's own page takes once it moves inside the group.
 */
export const GROUP_OVERVIEW_TITLE = 'Overview';

/**
 * Resolve the authored tree into a renderable sidebar for one language: every
 * node is kept (so the manual's full shape shows), with a link only when the
 * page exists for this language, and `active` set on the current page.
 */
export function buildSideNav(
  nodes: NavNode[],
  opts: BuildSideNavOptions
): SideNavNode[] {
  return (
    (nodes ?? [])
      // A language-specific node appears only in the ToC for its language.
      .filter((node) => !node.language || node.language === opts.language)
      .map((node) => {
        const slug = node.page ? opts.slugOf(node.page) : undefined;
        const href =
          slug === undefined
            ? undefined
            : pageHref(opts.version, opts.language, slug);
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
              { title: GROUP_OVERVIEW_TITLE, href, active, items: [] },
              ...items
            ]
          };
        }

        return { title: node.title, href, active, items };
      })
  );
}

/** The URL of the page with `slug`; the front page, whose slug is empty, is at the root. */
export function pageHref(
  version: string,
  language: string,
  slug?: string
): string {
  return slug
    ? `/ice/${version}/${language}/${slug}`
    : `/ice/${version}/${language}`;
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

/**
 * The page a language switch should land on when `page` is written for one
 * language: its sibling written for `language`, matched by title. The
 * per-language walkthroughs and plug-in API pages sit next to each other in
 * the tree under one title ("Writing a Greeter Server"), one per language, so
 * the counterpart of the C++ page for a Java reader is the Java page beside
 * it. `undefined` when the page is shared, or has no counterpart in that
 * language — a client-only mapping has no server walkthrough to switch to.
 */
export function counterpartPage(
  nodes: NavNode[],
  page: string,
  language: string
): string | undefined {
  const trail = trailTo(nodes, page);
  const node = trail ? trail[trail.length - 1] : undefined;
  if (!trail || !node?.language || node.language === language) return undefined;
  const siblings =
    trail.length > 1 ? (trail[trail.length - 2].items ?? []) : nodes;
  return siblings.find((s) => s.language === language && s.title === node.title)
    ?.page;
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
 * for this language are shown as plain text (no href). The last crumb is the
 * current page and is never a link. Empty when the page is not in the tree.
 */
export function breadcrumbs(
  nav: Pick<NavDoc, 'sidebar'>,
  page: string,
  opts: BuildSideNavOptions
): Crumb[] {
  const trail = trailTo(nav.sidebar, page);
  if (!trail) return [];

  const crumbs: Crumb[] = [
    {
      title: MANUAL_TITLE,
      href: pageHref(opts.version, opts.language)
    },
    ...trail.map((node) => {
      const slug = node.page ? opts.slugOf(node.page) : undefined;
      return slug === undefined
        ? { title: node.title }
        : {
            title: node.title,
            href: pageHref(opts.version, opts.language, slug)
          };
    })
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
 * The previous and next pages in reading order — the tree walked depth-first,
 * so the last page of one chapter leads into the first page of the next. Only
 * pages available in the current language take part, so "next" never points at
 * a page that does not exist for the reader's language.
 */
export function prevNext(
  nodes: NavNode[],
  page: string,
  opts: BuildSideNavOptions
): { prev?: PageLink; next?: PageLink } {
  const flat: NavNode[] = [];
  const walk = (items: NavNode[]) => {
    for (const node of items ?? []) {
      if (node.language && node.language !== opts.language) continue;
      if (node.page && opts.slugOf(node.page) !== undefined) flat.push(node);
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
          href: pageHref(opts.version, opts.language, opts.slugOf(node.page))
        }
      : undefined;
  return { prev: link(flat[i - 1]), next: link(flat[i + 1]) };
}

// ---------------------------------------------------------------------------
// Languages
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// Version switching
// ---------------------------------------------------------------------------

export interface VersionSwitchInput {
  targetVersion: string;
  /** Languages supported by the target version. */
  targetLanguages: string[];
  /** The language currently being viewed. */
  currentLanguage: string;
  /** The name of the page currently being viewed; none on the front page. */
  page?: string;
  /** A page's slug in the target version for a language; `undefined` when it does not exist there. */
  slugOf: (language: string, page: string) => string | undefined;
}

/**
 * The equivalent URL when switching to another version: keep the same language if
 * the target supports it (else its first language), and the same page if it exists
 * there (else fall back to the target's front page, at its root).
 */
export function versionSwitchTarget(i: VersionSwitchInput): string {
  const language = i.targetLanguages.includes(i.currentLanguage)
    ? i.currentLanguage
    : (i.targetLanguages[0] ?? i.currentLanguage);
  const slug = i.page ? i.slugOf(language, i.page) : undefined;
  return pageHref(i.targetVersion, language, slug);
}
