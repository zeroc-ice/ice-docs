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
    <header className="border-hairline bg-surface/85 sticky top-0 z-40 flex h-14 items-center justify-between gap-3 border-b px-[clamp(1rem,2.5vw,2rem)] backdrop-blur">
      <Link href="/" className="flex shrink-0 items-baseline gap-1.5 text-[15px]">
        <span className="text-ink font-semibold tracking-tight">Ice</span>
        {/* Names the site rather than decorating the brand, so it is the first
            thing to go when the bar runs out of room — never a control. */}
        <span className="text-ink-secondary hidden sm:inline">Documentation</span>
      </Link>
      <div className="flex min-w-0 items-center gap-3 text-sm sm:gap-4">
        {/* Search + version + language portal in here from the page, which is
            the only place that knows the equivalent URL for each of them. */}
        <div id="ice-header-controls" className="flex min-w-0 items-center gap-2 sm:gap-3" />
        <a
          href="https://github.com/zeroc-ice/ice"
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-secondary hover:text-ink hidden shrink-0 transition-colors lg:inline"
        >
          GitHub
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}
