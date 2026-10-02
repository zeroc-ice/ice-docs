// Copyright (c) ZeroC, Inc.

import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

// The one global bar, identical on every page including the homepage. Readers
// arrive at the homepage from search engines as often as anywhere else, so the
// version, the language and the search box have to be there too — a reader who
// has to click into an article before they can pick their language has already
// been shown the wrong one.
export function IceHeader() {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b border-hairline bg-surface/85 px-[clamp(1rem,2.5vw,2rem)] backdrop-blur">
      <div className="flex shrink-0 items-center gap-2">
        {/* The table of contents' menu button portals in here from the
            docs layout, the only place that has the tree. The slot has
            no box of its own, so a page without the button has no gap. */}
        <div id="ice-header-menu" className="contents" />
        <Link href="/" className="flex items-baseline gap-1.5 text-[15px]">
          <span className="font-semibold tracking-tight text-ink">Ice</span>
          {/* Names the site rather than decorating the brand, so it is the
              first thing to go when the bar runs out of room — never a
              control. */}
          <span className="hidden text-ink-secondary sm:inline">
            Documentation
          </span>
        </Link>
      </div>
      <div className="flex min-w-0 items-center gap-3 text-sm sm:gap-4">
        {/* Search + version + language portal in here from the page, which is
            the only place that knows each version's equivalent URL and the
            version's languages. */}
        <div
          id="ice-header-controls"
          className="flex min-w-0 items-center gap-2 sm:gap-3"
        />
        <a
          href="https://github.com/zeroc-ice/ice"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 text-ink-secondary transition-colors hover:text-ink lg:inline"
        >
          GitHub
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
