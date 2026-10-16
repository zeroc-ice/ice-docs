// Copyright (c) ZeroC, Inc.
'use client';

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { clsx } from 'clsx';
import { ChevronDown, ChevronRight, ListFilter, Menu, X } from 'lucide-react';

import {
  type DocsVersion,
  type SideNavNode,
  SITE_TITLE,
  activeTrailKeys,
  filterSideNav,
  sideNavKey
} from '@/lib/docs-model/nav';
import { useLanguage, useMounted } from '@/context/state';
import { ThemeToggle } from '@/components/theme-toggle';

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

// The table of contents: one tree, the chapter structure of the documentation.
//
// Groups start collapsed and open only when they hold the current page. Showing
// every child of every group by default would put every chapter's pages on
// screen at once, none of which the reader had asked about. The shape of the
// documentation is the top-level list; the detail arrives when you go there.
//
// A click always wins over that default, including on the branch holding the
// current page, so a reader can fold away the branch they are standing in. That
// branch stays emphasised while folded, so "where am I" survives the fold. What
// the reader opened stays open across navigations, so the tree does not
// rearrange itself under the click that moved them.
//
// A filter above the tree narrows it to the entries whose titles match, with
// every group on the way down to them open. It leaves the groups the reader
// opened alone, so clearing it brings back the tree they had.
//
// The tree is the same on every page of a version, so the current page is the
// entry whose link is the address's path.
export function SideNav({
  nodes,
  version
}: {
  nodes: SideNavNode[];
  /** What the reader had open is kept per version. */
  version: DocsVersion;
}) {
  // Storage is read after mount, so the server and the first client render
  // agree.
  const mounted = useMounted();

  const pathname = usePathname();

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
      for (const key of readState<string[]>(openKey(version.path), []))
        open.add(key);
    return open;
  }, [mounted, trail, version]);
  const [clicked, setClicked] = useState<Set<string> | null>(null);
  const [clickedOn, setClickedOn] = useState(pathname);
  if (clickedOn !== pathname) {
    setClickedOn(pathname);
    setClicked(null);
  }
  const open = clicked ?? initialOpen;

  // The filter outlasts a navigation, so a reader can work through what it
  // found. While it is on, every group it shows starts open, and a click folds
  // one away until the query changes.
  const [query, setQuery] = useState('');
  const filter = query.trim();
  const language = useLanguage();
  const matches = useMemo(
    () => (filter ? filterSideNav(nodes, filter, language) : null),
    [nodes, filter, language]
  );
  const [folded, setFolded] = useState<Set<string> | null>(null);
  const changeQuery = (value: string) => {
    setQuery(value);
    setFolded(null);
  };

  const isOpen = (key: string) => (matches ? !folded?.has(key) : open.has(key));
  const toggle = (key: string) => {
    if (matches) setFolded(flip(folded ?? new Set(), key));
    else setClicked(flip(open, key));
  };

  // Persist the effective set, not just the clicks: the branch that opened on
  // its own for this page has to stay open on the next one too, or the tree
  // would shrink above the reader's place.
  useEffect(() => {
    if (mounted) writeState(openKey(version.path), [...open]);
  }, [mounted, open, version]);

  if (nodes.length === 0) return null;

  const tree =
    matches?.length === 0 ? (
      <p className="px-2 py-1.5 text-ink-muted">No page matches “{filter}”.</p>
    ) : (
      <Tree
        nodes={matches ?? nodes}
        path={[]}
        depth={0}
        pathname={pathname}
        isOpen={isOpen}
        trail={trail}
        toggle={toggle}
        // Groups open by a click slide open; groups restored from storage,
        // opened for the current page, or opened by the filter are simply
        // there, so the rail lays out at its final height before the current
        // page is brought into view.
        animate={matches ? folded !== null : clicked !== null}
      />
    );
  const contents = (
    <Contents query={query} onQueryChange={changeQuery} filter={filter}>
      {tree}
    </Contents>
  );

  return (
    <>
      <nav
        aria-label={`${SITE_TITLE} navigation`}
        // The rail runs down the left edge of the window, from the header to
        // the footer. `contain-size` keeps the tree's height out of the row's,
        // so a short page stays viewport-high with the footer at the bottom;
        // the rail then stretches to the row, capped at the viewport.
        className="sticky top-14 hidden max-h-[calc(100vh-3.5rem)] w-72 shrink-0 flex-col border-r border-hairline text-sm contain-size lg:flex"
      >
        {contents}
      </nav>
      <Drawer>{contents}</Drawer>
    </>
  );
}

// A copy of `set` with `key` added, or removed if it was there.
function flip(set: ReadonlySet<string>, key: string): Set<string> {
  const next = new Set(set);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  return next;
}

// The filter box and the tree, in the rail and in the drawer alike. They scroll
// as one, with the box held at the top while the tree passes under it.
function Contents({
  query,
  onQueryChange,
  filter,
  children
}: {
  query: string;
  onQueryChange: (query: string) => void;
  /** The query as it applies, without surrounding spaces. */
  filter: string;
  children: React.ReactNode;
}) {
  const mounted = useMounted();
  const pathname = usePathname();
  const language = useLanguage();
  const scrollRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const reveal = () =>
    revealCurrentPage(scrollRef.current!, boxRef.current!.offsetHeight);
  // A line under the box shows that the tree has scrolled under it.
  const [scrolled, setScrolled] = useState(false);

  // On load and on every navigation, make sure the current page is in view: it
  // is when the reader clicked it in the rail, and may not be when they
  // arrived by a previous/next link, from search, or by loading the page. A
  // language switch can move it too, by showing or hiding the entries written
  // for some languages.
  useLayoutEffect(() => {
    if (mounted) reveal();
  }, [mounted, pathname, language]);

  // A new filter shows what it matched from the top; clearing it goes back to
  // the current page.
  useLayoutEffect(() => {
    if (filter) scrollRef.current!.scrollTop = 0;
    else reveal();
  }, [filter]);

  return (
    <div
      ref={scrollRef}
      onScroll={(event) => setScrolled(event.currentTarget.scrollTop > 0)}
      // Positioned, as revealCurrentPage requires. The scrollbar's space
      // stays reserved while the tree fits, so the labels don't rewrap when
      // opening a group makes the rail scroll.
      className="relative min-h-0 grow scrollbar-gutter-stable overflow-y-auto overscroll-contain px-3 pb-8"
    >
      <div
        ref={boxRef}
        className={clsx(
          'sticky top-0 z-10 -mx-3 border-b bg-surface/85 px-3 pt-4 pb-3 backdrop-blur transition-colors',
          scrolled ? 'border-hairline' : 'border-transparent'
        )}
      >
        <NavFilter value={query} onChange={onQueryChange} />
      </div>
      {children}
    </div>
  );
}

function NavFilter({
  value,
  onChange
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="relative">
      <ListFilter
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink-muted"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          // Escape empties the box before it closes the drawer.
          if (event.key === 'Escape' && value) {
            event.preventDefault();
            onChange('');
          }
        }}
        placeholder="Filter sidebar"
        aria-label="Filter sidebar"
        // 16px text on a phone, where Safari zooms into anything smaller as
        // it takes focus. The browser's own clear button gives way to ours,
        // which every browser shows.
        className="h-8 w-full rounded-md border border-hairline-strong bg-surface pr-8 pl-8 text-base text-ink focus-ring placeholder:text-ink-muted lg:text-sm [&::-webkit-search-cancel-button]:appearance-none"
      />
      {value && (
        <button
          type="button"
          onClick={() => {
            onChange('');
            inputRef.current!.focus();
          }}
          className="absolute inset-y-0 right-0 flex w-8 items-center justify-center rounded-md text-ink-muted focus-ring transition-colors hover:text-ink"
        >
          <X className="size-3.5" aria-hidden="true" />
          <span className="sr-only">Clear the filter</span>
        </button>
      )}
    </div>
  );
}

// Scrolls `nav` to the current page's entry unless it is in view already,
// below the `covered` pixels the filter box holds at its top. `nav` must be
// positioned, so that it is its entries' offset parent. An entry hidden for the
// reader's language has no position to show.
function revealCurrentPage(nav: HTMLElement, covered: number) {
  const active = nav.querySelector<HTMLElement>('[aria-current="page"]');
  if (!active || active.offsetParent === null) return;
  const top = active.offsetTop;
  const bottom = top + active.offsetHeight;
  if (
    top < nav.scrollTop + covered ||
    bottom > nav.scrollTop + nav.clientHeight
  ) {
    nav.scrollTop = Math.max(0, top - (covered + nav.clientHeight) / 2);
  }
}

// Below the large breakpoint the rail has no room, so a button in the header
// opens the same tree, with the same groups open and the same filter, in a
// drawer. Only the version layout has the tree, so the button renders into the
// header's #ice-header-menu. The drawer holds the tree only while it is open,
// so the page carries one copy of it rather than two.
function Drawer({ children }: { children: React.ReactNode }) {
  const mounted = useMounted();
  const target = mounted ? document.getElementById('ice-header-menu') : null;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [expanded, setExpanded] = useState(false);

  // A navigation from outside the drawer, such as going back, closes it too.
  const pathname = usePathname();
  useEffect(() => {
    dialogRef.current?.close();
  }, [pathname]);

  // So does growing past Tailwind's `lg` breakpoint, 64rem, as a tablet does
  // when it turns: the rail is back there, and the button that opened the
  // drawer is hidden.
  useEffect(() => {
    const wide = window.matchMedia('(min-width: 64rem)');
    const onChange = () => {
      if (wide.matches) dialogRef.current?.close();
    };
    wide.addEventListener('change', onChange);
    return () => wide.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      {target &&
        createPortal(
          <button
            type="button"
            aria-controls="ice-nav-drawer"
            aria-expanded={expanded}
            onClick={() => {
              dialogRef.current!.showModal();
              setExpanded(true);
            }}
            className="-ml-1.5 flex size-8 items-center justify-center rounded-md text-ink focus-ring transition-colors hover:bg-surface-subtle lg:hidden"
          >
            <Menu className="size-5" aria-hidden="true" />
            <span className="sr-only">Table of contents</span>
          </button>,
          target
        )}
      <dialog
        ref={dialogRef}
        id="ice-nav-drawer"
        aria-label={`${SITE_TITLE} navigation`}
        onClose={() => setExpanded(false)}
        onClick={(event) => {
          // The panel fills the dialog, so a click on the dialog itself is a
          // click on the backdrop.
          const onBackdrop = event.target === event.currentTarget;
          // Picking a page closes the drawer at once, the current page too.
          const onLink = (event.target as Element).closest('a') !== null;
          if (onBackdrop || onLink) event.currentTarget.close();
        }}
        // A modal dialog is inset to the viewport's edges, as its backdrop is;
        // an auto height with no cap spans them. A phone has no room beside the
        // panel for the page to show, so there it takes the whole width.
        className="h-auto max-h-none w-full max-w-none border-hairline bg-surface text-ink transition-transform duration-200 ease-out backdrop:bg-black/40 motion-reduce:transition-none sm:w-80 sm:border-r starting:-translate-x-full"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-14 shrink-0 items-center justify-end border-b border-hairline px-2">
            <div className="sm:hidden">
              <ThemeToggle />
            </div>
            <button
              type="button"
              onClick={() => dialogRef.current!.close()}
              className="flex size-8 items-center justify-center rounded-md text-ink focus-ring transition-colors hover:bg-surface-subtle"
            >
              <X className="size-5" aria-hidden="true" />
              <span className="sr-only">Close</span>
            </button>
          </div>
          {/* The contents render as the drawer opens, which brings the tree
              to the current page. */}
          <nav className="flex min-h-0 grow flex-col text-sm">
            {expanded && children}
          </nav>
        </div>
      </dialog>
    </>
  );
}

interface TreeProps {
  nodes: SideNavNode[];
  path: string[];
  depth: number;
  /** The current page's path, which its entry links to. */
  pathname: string;
  isOpen: (key: string) => boolean;
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
  isOpen,
  trail,
  toggle,
  animate
}: TreeProps) {
  return (
    // A nested list hangs on a guide line under its group's title.
    <ul
      className={clsx(
        'flex flex-col',
        depth > 0 && 'ml-2 border-l border-hairline pl-3'
      )}
    >
      {nodes.map((node) => {
        const nodePath = [...path, node.href ?? node.title];
        const k = sideNavKey(nodePath);
        const hasItems = node.items.length > 0;
        const expanded = hasItems && isOpen(k);
        const active = node.href === pathname;

        // The trail down to the current page stays emphasised even when folded.
        const onActiveTrail = trail.has(k);

        // Two icons rather than one rotated: Safari draws a transformed
        // element over the blurred filter box when the tree scrolls under it.
        // A rotation can return once Safari blurs it like the rest.
        const Chevron = expanded ? ChevronDown : ChevronRight;
        const chevron = <Chevron className="size-3.5" aria-hidden="true" />;

        const label = clsx(
          'block flex-1 rounded-md px-2 py-1.5 text-left leading-snug transition-colors focus-ring',
          active
            ? 'text-link'
            : onActiveTrail
              ? 'text-ink group-hover:text-link font-semibold'
              : // Top-level entries carry the shape of the docs, so they read at
                // full strength; their children step back a shade.
                clsx(
                  'group-hover:text-link',
                  depth === 0 ? 'text-ink' : 'text-ink-secondary'
                )
        );

        return (
          <li key={k} data-langs={node.writtenFor?.join(' ')}>
            {/* The chevron ends the row, so the labels at a depth start on one
                edge whether or not they have one. The row is the hover
                target, so pointing at a group's chevron lights its title. */}
            <div className="group flex items-start">
              {hasItems ? (
                // A group's own page, when it has one, is its first entry, so
                // the whole row toggles: the target is the row rather than a
                // 14px arrow.
                <button
                  type="button"
                  onClick={() => toggle(k)}
                  aria-expanded={expanded}
                  className="flex flex-1 items-start rounded-md text-left focus-ring"
                >
                  <span className={label}>{node.title}</span>
                  <span className="mt-1.5 flex h-5 w-5 shrink-0 items-center justify-center text-ink-muted transition-colors group-hover:text-link">
                    {chevron}
                  </span>
                </button>
              ) : (
                <RailLink
                  href={node.href!}
                  aria-current={active ? 'page' : undefined}
                  className={label}
                >
                  {node.title}
                </RailLink>
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
                  expanded ? 'grid-rows-[1fr]' : 'invisible grid-rows-[0fr]'
                )}
              >
                <div className="overflow-hidden">
                  <Tree
                    nodes={node.items}
                    path={nodePath}
                    depth={depth + 1}
                    pathname={pathname}
                    isOpen={isOpen}
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

// The rail lists every page of the version, so prefetching the entries on
// screen, as a link does by default, would fetch dozens of pages on every load,
// nearly all unread. A pointer over an entry is the intent worth acting on, so
// the page is fetched then, and is there by the click: Next's hover-triggered
// prefetch, where `null` turns the default back on once the pointer arrives.
// https://nextjs.org/docs/app/guides/prefetching#hover-triggered-prefetch
function RailLink({
  href,
  children,
  ...props
}: {
  href: string;
  'aria-current'?: 'page';
  className: string;
  children: React.ReactNode;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <Link
      href={href}
      prefetch={hovered ? null : false}
      onPointerEnter={() => setHovered(true)}
      {...props}
    >
      {children}
    </Link>
  );
}
