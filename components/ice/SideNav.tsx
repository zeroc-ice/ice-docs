// Copyright (c) ZeroC, Inc.
'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { type SideNavNode, activeTrailKeys, containsActive, sideNavKey } from '@/lib/docs-model/nav';
import { useMounted } from '@/context/state';

// Whether the whole rail is folded away. A preference, so it lives in local
// storage and outlives the tab.
const COLLAPSED_KEY = 'ice-docs:sidebar-collapsed';

// Where the reader is in the tree — which groups are open, how far the rail is
// scrolled — lives in session storage, per tab, keyed by version and language
// (keys are titles and hrefs, which differ between languages). The rail is
// rebuilt on every navigation; without this, each click in it would hand back
// a tree scrolled to the top with only the new page's branch open, and the
// reader would lose their place in the very control they are using to move.
const stateKey = (kind: 'open' | 'scroll', scope: string) => `ice-docs:sidebar-${kind}:${scope}`;

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

// The manual's table of contents: one tree, the chapter structure of the manual,
// resolved for the reader's language.
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
export function SideNav({ nodes, title }: { nodes: SideNavNode[]; title?: string }) {
  // Read after mount, so the server and the first client render agree; the
  // width transition then carries the rail closed rather than snapping it.
  const mounted = useMounted();
  const remembered = useMemo(
    () => (mounted ? window.localStorage.getItem(COLLAPSED_KEY) === '1' : false),
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

  // /ice/3.8/cpp/<page> -> "3.8/cpp".
  const scope = usePathname().split('/').slice(2, 4).join('/');

  // Groups that are open: the branch holding the current page, plus — once the
  // client has mounted and can read storage — whatever the reader had open
  // before this navigation. A click replaces the set outright.
  const initialOpen = useMemo(() => {
    const open = new Set(activeTrailKeys(nodes));
    if (mounted) for (const key of readState<string[]>(stateKey('open', scope), [])) open.add(key);
    return open;
  }, [mounted, nodes, scope]);
  const [clicked, setClicked] = useState<Set<string> | null>(null);
  const open = clicked ?? initialOpen;

  const toggle = (key: string) => {
    const next = new Set(open);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setClicked(next);
  };

  // Persist the effective set, not just the clicks: the branch that opened on
  // its own for this page has to stay open on the next one too, or the tree
  // would shrink above the reader's place and the scroll position would land
  // on the wrong rows.
  useEffect(() => {
    if (mounted) writeState(stateKey('open', scope), [...open]);
  }, [mounted, open, scope]);

  // Restore the rail's scroll position once it has rendered with the remembered
  // groups open, then make sure the current page is in view: it is when the
  // reader clicked it in the rail, and may not be when they arrived by a
  // previous/next link or from search. Before paint, so nothing jumps.
  const navRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!mounted || !nav) return;
    nav.scrollTop = readState<number>(stateKey('scroll', scope), 0);
    const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
    if (!active) return;
    const top = active.offsetTop;
    const bottom = top + active.offsetHeight;
    if (top < nav.scrollTop || bottom > nav.scrollTop + nav.clientHeight) {
      nav.scrollTop = Math.max(0, top - nav.clientHeight / 2);
    }
  }, [mounted, scope]);

  // Remember the scroll position as it changes, one write per frame.
  const frame = useRef(0);
  const onScroll = () => {
    if (frame.current) return;
    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0;
      if (navRef.current) writeState(stateKey('scroll', scope), navRef.current.scrollTop);
    });
  };

  if (nodes.length === 0) return null;

  return (
    <nav
      ref={navRef}
      onScroll={onScroll}
      aria-label={title ? `${title} navigation` : 'Manual navigation'}
      className={clsx(
        'sticky top-20 hidden h-[calc(100vh-6.5rem)] shrink-0 self-start overscroll-contain pb-8 text-sm',
        'transition-[width] duration-200 ease-out motion-reduce:transition-none lg:block',
        collapsed ? 'w-9 overflow-hidden' : 'w-66 overflow-y-auto pr-3'
      )}
    >
      <div className="mb-2 flex items-center gap-1">
        {!collapsed && title && (
          <div className="text-ink-muted flex-1 truncate px-2 text-[11px] font-semibold uppercase tracking-[0.07em]">
            {title}
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          aria-expanded={!collapsed}
          aria-controls="manual-nav-tree"
          aria-label={collapsed ? 'Expand table of contents' : 'Collapse table of contents'}
          title={collapsed ? 'Expand table of contents' : 'Collapse table of contents'}
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
          open={open}
          toggle={toggle}
          // Groups open by a click slide open; groups restored from storage or
          // opened for the current page are simply there, so the rail lays out
          // at its final height before the scroll position is put back.
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
  open: ReadonlySet<string>;
  toggle: (key: string) => void;
  animate: boolean;
}

function Tree({ nodes, path, depth, open, toggle, animate }: TreeProps) {
  return (
    <ul className="flex flex-col">
      {nodes.map((node) => {
        const nodePath = [...path, node.href ?? node.title];
        const k = sideNavKey(nodePath);
        const hasItems = node.items.length > 0;
        const isOpen = hasItems && open.has(k);

        // The trail down to the current page stays emphasised even when folded.
        const onActiveTrail = containsActive(node) && !node.active;

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
          node.active
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
          <li key={k}>
            {/* The chevron keeps its own column at every depth, so labels line
                up on one edge instead of stepping in and out with the arrows. */}
            <div className="flex items-start" style={{ paddingLeft: depth * 12 }}>
              {hasItems && !node.href ? (
                // A group with no page of its own: the whole row toggles, so the
                // target is the row rather than a 14px arrow.
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
                  {hasItems ? (
                    // The row links somewhere *and* has children, so the arrow
                    // toggles and the label navigates: clicking the title of a
                    // page you can read should open that page.
                    <button
                      type="button"
                      onClick={() => toggle(k)}
                      aria-expanded={isOpen}
                      aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${node.title}`}
                      className="text-ink-muted hover:text-ink mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center transition-colors"
                    >
                      {chevron}
                    </button>
                  ) : (
                    <span className="w-5 shrink-0" />
                  )}

                  {node.href ? (
                    <Link
                      href={node.href}
                      aria-current={node.active ? 'page' : undefined}
                      className={label}
                    >
                      {node.title}
                    </Link>
                  ) : (
                    <span
                      className="text-ink-disabled block flex-1 px-2 py-1.5 leading-snug"
                      title="Not yet migrated"
                    >
                      {node.title}
                    </span>
                  )}
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
                  animate && 'transition-[grid-template-rows,visibility] duration-200',
                  isOpen ? 'grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
                )}
              >
                <div className="overflow-hidden">
                  <Tree
                    nodes={node.items}
                    path={nodePath}
                    depth={depth + 1}
                    open={open}
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
