// Copyright (c) ZeroC, Inc.
'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import {
  type SideNavNode,
  activeTrailKeys,
  sideNavKey
} from '@/lib/docs-model/nav';
import { useLanguage, useMounted } from '@/context/state';

// Whether the whole rail is folded away. A preference, so it lives in local
// storage and outlives the tab.
const COLLAPSED_KEY = 'ice-docs:sidebar-collapsed';

// The groups the reader has open live in session storage, per tab, keyed by
// version (keys are titles and hrefs, which differ between versions), so they
// outlast a navigation, a reload, or a trip to another version, each of which
// would otherwise leave only the current page's branch open.
const openKey = (scope: string) => `ice-docs:sidebar-open:${scope}`;

function readState<T>(key: string, fallback: T): T {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeState(key: string, value: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage blocked: the rail still works, it just forgets between pages.
  }
}

// The manual's table of contents: one tree, the chapter structure of the manual.
//
// Groups start collapsed and open only when they hold the current page. Showing
// every child of every group by default would put every chapter's pages on
// screen at once, none of which the reader had asked about. The shape of the
// manual is the top-level list; the detail arrives when you go there.
//
// A click always wins over that default, including on the branch holding the
// current page, so a reader can fold away the branch they are standing in. That
// branch stays emphasised while folded, so "where am I" survives the fold. What
// the reader opened stays open across navigations, so the tree does not
// rearrange itself under the click that moved them.
//
// The tree is the same on every page of a version, so the current page is the
// entry whose link is the address's path.
export function SideNav({
  nodes,
  title,
  homeHref
}: {
  nodes: SideNavNode[];
  title?: string;
  /** The manual's front page, which the heading links to. */
  homeHref: string;
}) {
  // Read after mount, so the server and the first client render agree; the
  // width transition then carries the rail closed rather than snapping it.
  const mounted = useMounted();
  const remembered = useMemo(
    () =>
      mounted ? window.localStorage.getItem(COLLAPSED_KEY) === '1' : false,
    [mounted]
  );
  const [override, setOverride] = useState<boolean | null>(null);
  const collapsed = override ?? remembered;

  const setCollapsed = (value: boolean) => {
    setOverride(value);
    try {
      window.localStorage.setItem(COLLAPSED_KEY, value ? '1' : '0');
    } catch {
      // Private browsing and storage-blocked contexts: the rail still folds,
      // it just will not be remembered.
    }
  };

  const pathname = usePathname();
  // /ice/3.8/<slug> -> "3.8".
  const scope = pathname.split('/')[2];

  const trail = useMemo(
    () => new Set(activeTrailKeys(nodes, pathname)),
    [nodes, pathname]
  );

  // Groups that are open: the branch holding the current page, plus — once the
  // client has mounted and can read storage — whatever the reader had open
  // before this navigation. A click replaces the set outright, until the
  // reader moves to another page: by then the set is in storage, and the new
  // page's branch opens on top of it.
  const initialOpen = useMemo(() => {
    const open = new Set(trail);
    if (mounted)
      for (const key of readState<string[]>(openKey(scope), [])) open.add(key);
    return open;
  }, [mounted, trail, scope]);
  const [clicked, setClicked] = useState<Set<string> | null>(null);
  const [clickedOn, setClickedOn] = useState(pathname);
  if (clickedOn !== pathname) {
    setClickedOn(pathname);
    setClicked(null);
  }
  const open = clicked ?? initialOpen;

  const toggle = (key: string) => {
    const next = new Set(open);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setClicked(next);
  };

  // Persist the effective set, not just the clicks: the branch that opened on
  // its own for this page has to stay open on the next one too, or the tree
  // would shrink above the reader's place.
  useEffect(() => {
    if (mounted) writeState(openKey(scope), [...open]);
  }, [mounted, open, scope]);

  // On load and on every navigation, make sure the current page is in view: it
  // is when the reader clicked it in the rail, and may not be when they
  // arrived by a previous/next link, from search, or by loading the page. A
  // language switch can move it too, by showing or hiding the entries written
  // for some languages. An entry hidden for the reader's language has no
  // position to show.
  const language = useLanguage();
  const navRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!mounted || !nav) return;
    const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
    if (!active || active.offsetParent === null) return;
    const top = active.offsetTop;
    const bottom = top + active.offsetHeight;
    if (top < nav.scrollTop || bottom > nav.scrollTop + nav.clientHeight) {
      nav.scrollTop = Math.max(0, top - nav.clientHeight / 2);
    }
  }, [mounted, pathname, collapsed, language]);

  if (nodes.length === 0) return null;

  return (
    <nav
      ref={navRef}
      aria-label={title ? `${title} navigation` : 'Manual navigation'}
      // `contain-size` keeps the tree's height out of the row's, so a short
      // page stays viewport-high with the footer at the bottom; the rail then
      // stretches to the row, capped at the viewport.
      className={clsx(
        'sticky top-20 hidden max-h-[calc(100vh-6.5rem)] shrink-0 overscroll-contain pb-8 text-sm contain-size',
        'transition-[width] duration-200 ease-out motion-reduce:transition-none lg:block',
        collapsed ? 'w-9 overflow-hidden' : 'w-66 overflow-y-auto pr-3'
      )}
    >
      <div className="mb-2 flex items-center gap-1">
        {/* The heading is the manual's front page, the one page above the
            tree rather than in it, so it is the row that is active there. */}
        {!collapsed && title && (
          <Link
            href={homeHref}
            aria-current={pathname === homeHref ? 'page' : undefined}
            className={clsx(
              'flex-1 truncate rounded-[5px] px-2 py-1 text-[11px] font-semibold tracking-[0.07em] uppercase transition-colors',
              pathname === homeHref
                ? 'bg-accent-soft text-link'
                : 'text-ink-muted hover:text-ink hover:bg-surface-subtle'
            )}
          >
            {title}
          </Link>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
          aria-controls="manual-nav-tree"
          aria-label={
            collapsed
              ? 'Expand table of contents'
              : 'Collapse table of contents'
          }
          title={
            collapsed
              ? 'Expand table of contents'
              : 'Collapse table of contents'
          }
          className="text-ink-muted hover:text-ink hover:bg-surface-subtle flex size-7 shrink-0 items-center justify-center rounded-md transition-colors"
        >
          {collapsed ? (
            <ChevronsRight className="size-4" aria-hidden="true" />
          ) : (
            <ChevronsLeft className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Hidden rather than unmounted: folding the rail must not drop the tree
          out of the page only to rebuild it, and `hidden` also takes it out of
          the tab order and the accessibility tree. */}
      <div id="manual-nav-tree" hidden={collapsed}>
        <Tree
          nodes={nodes}
          path={[]}
          depth={0}
          pathname={pathname}
          open={open}
          trail={trail}
          toggle={toggle}
          // Groups open by a click slide open; groups restored from storage or
          // opened for the current page are simply there, so the rail lays out
          // at its final height before the current page is brought into view.
          animate={clicked !== null}
        />
      </div>
    </nav>
  );
}

interface TreeProps {
  nodes: SideNavNode[];
  path: string[];
  depth: number;
  /** The current page's path, which its entry links to. */
  pathname: string;
  open: ReadonlySet<string>;
  /** The keys of the groups that lead to the current page. */
  trail: ReadonlySet<string>;
  toggle: (key: string) => void;
  animate: boolean;
}

function Tree({
  nodes,
  path,
  depth,
  pathname,
  open,
  trail,
  toggle,
  animate
}: TreeProps) {
  return (
    <ul className="flex flex-col">
      {nodes.map((node) => {
        const nodePath = [...path, node.href ?? node.title];
        const k = sideNavKey(nodePath);
        const hasItems = node.items.length > 0;
        const isOpen = hasItems && open.has(k);
        const active = node.href === pathname;

        // The trail down to the current page stays emphasised even when folded.
        const onActiveTrail = trail.has(k);

        const chevron = (
          <ChevronRight
            className={clsx(
              'size-3.5 ease-out motion-reduce:transition-none',
              animate && 'transition-transform duration-200',
              isOpen && 'rotate-90'
            )}
            aria-hidden="true"
          />
        );

        const label = clsx(
          'block flex-1 rounded-[5px] px-2 py-1.5 text-left leading-snug transition-colors',
          active
            ? 'bg-accent-soft text-link font-semibold'
            : onActiveTrail
              ? 'text-ink hover:bg-surface-subtle font-semibold'
              : // Top-level entries carry the shape of the manual, so they read at
                // full strength; their children step back a shade.
                clsx(
                  'hover:text-ink hover:bg-surface-subtle',
                  depth === 0 ? 'text-ink' : 'text-ink-secondary'
                )
        );

        return (
          <li key={k} data-langs={node.writtenFor?.join(' ')}>
            {/* The chevron keeps its own column at every depth, so labels line
                up on one edge instead of stepping in and out with the arrows. */}
            <div
              className="flex items-start"
              style={{ paddingLeft: depth * 12 }}
            >
              {hasItems ? (
                // A group's page is its Overview entry, so the whole row
                // toggles: the target is the row rather than a 14px arrow.
                <button
                  type="button"
                  onClick={() => toggle(k)}
                  aria-expanded={isOpen}
                  className="flex flex-1 items-start text-left"
                >
                  <span className="text-ink-muted mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center">
                    {chevron}
                  </span>
                  <span className={label}>{node.title}</span>
                </button>
              ) : (
                <>
                  <span className="w-5 shrink-0" />
                  <Link
                    href={node.href!}
                    aria-current={active ? 'page' : undefined}
                    className={label}
                  >
                    {node.title}
                  </Link>
                </>
              )}
            </div>

            {hasItems && (
              // Animating a list of unknown height: the 0fr/1fr grid track does it
              // in CSS, with no height measurement and no layout thrash.
              // `visibility` is in the transition so the folded subtree leaves the
              // tab order and the accessibility tree once it has finished closing.
              <div
                className={clsx(
                  'grid ease-out motion-reduce:transition-none',
                  animate &&
                    'transition-[grid-template-rows,visibility] duration-200',
                  isOpen ? 'grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
                )}
              >
                <div className="overflow-hidden">
                  <Tree
                    nodes={node.items}
                    path={nodePath}
                    depth={depth + 1}
                    pathname={pathname}
                    open={open}
                    trail={trail}
                    toggle={toggle}
                    animate={animate}
                  />
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
