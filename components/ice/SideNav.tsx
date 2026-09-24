// Copyright (c) ZeroC, Inc.
'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { ChevronRight } from 'lucide-react';

import {
  type SideNavNode,
  activeTrailKeys,
  containsActive,
  sideNavKey
} from '@/lib/docs-model/nav';
import { useMounted } from '@/context/state';

// Where the reader is in the tree — which groups are open, how far the rail is
// scrolled — lives in session storage, per tab, keyed by version (keys are
// titles and hrefs, which differ between versions). The rail stays mounted
// while the reader moves around one version, but a reload or a trip to another
// version builds a new one; without this, it would come back scrolled to the
// top with only the current page's branch open, and the reader would lose
// their place.
const stateKey = (kind: 'open' | 'scroll', scope: string) =>
  `ice-docs:sidebar-${kind}:${scope}`;

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
  title
}: {
  nodes: SideNavNode[];
  title?: string;
}) {
  // Storage is read after mount, so the server and the first client render
  // agree.
  const mounted = useMounted();

  const pathname = usePathname();
  // /ice/3.8/<slug> -> "3.8".
  const scope = pathname.split('/')[2];

  // Groups that are open: the branch holding the current page, plus — once the
  // client has mounted and can read storage — whatever the reader had open
  // before this navigation. A click replaces the set outright, until the
  // reader moves to another page: by then the set is in storage, and the new
  // page's branch opens on top of it.
  const initialOpen = useMemo(() => {
    const open = new Set(activeTrailKeys(nodes, pathname));
    if (mounted)
      for (const key of readState<string[]>(stateKey('open', scope), []))
        open.add(key);
    return open;
  }, [mounted, nodes, pathname, scope]);
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
  // would shrink above the reader's place and the scroll position would land
  // on the wrong rows.
  useEffect(() => {
    if (mounted) writeState(stateKey('open', scope), [...open]);
  }, [mounted, open, scope]);

  // Restore the rail's scroll position once it has rendered with the remembered
  // groups open. Before paint, so nothing jumps.
  const navRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (mounted && nav)
      nav.scrollTop = readState<number>(stateKey('scroll', scope), 0);
  }, [mounted, scope]);

  // Then, and on every navigation, make sure the current page is in view: it
  // is when the reader clicked it in the rail, and may not be when they
  // arrived by a previous/next link or from search. An entry hidden for the
  // reader's language has no position to show.
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
  }, [mounted, pathname]);

  // Remember the scroll position as it changes, one write per frame.
  const frame = useRef(0);
  const onScroll = () => {
    if (frame.current) return;
    frame.current = window.requestAnimationFrame(() => {
      frame.current = 0;
      if (navRef.current)
        writeState(stateKey('scroll', scope), navRef.current.scrollTop);
    });
  };

  if (nodes.length === 0) return null;

  return (
    <nav
      ref={navRef}
      onScroll={onScroll}
      aria-label={title ? `${title} navigation` : 'Manual navigation'}
      // `contain-size` keeps the tree's height out of the row's, so a short
      // page stays viewport-high with the footer at the bottom; the rail then
      // stretches to the row, capped at the viewport.
      className="sticky top-20 hidden max-h-[calc(100vh-6.5rem)] w-66 shrink-0 overflow-y-auto overscroll-contain pr-3 pb-8 text-sm contain-size lg:block"
    >
      <Tree
        nodes={nodes}
        path={[]}
        depth={0}
        pathname={pathname}
        open={open}
        toggle={toggle}
        // Groups open by a click slide open; groups restored from storage or
        // opened for the current page are simply there, so the rail lays out
        // at its final height before the scroll position is put back or the
        // current page brought into view.
        animate={clicked !== null}
      />
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
  toggle: (key: string) => void;
  animate: boolean;
}

function Tree({
  nodes,
  path,
  depth,
  pathname,
  open,
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
        const onActiveTrail = !active && containsActive(node, pathname);

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
