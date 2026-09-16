// Copyright (c) ZeroC, Inc.

import Link from 'next/link';

interface Page {
  title: string;
  href: string;
  date?: string;
}

interface Release {
  title: string;
  notes: string;
  date?: string;
  platforms?: string;
}

// The Release Notes chapter holds a page per release followed by its supported
// platforms page; pair them up, newest first.
function releasesOf(pages: Page[]): Release[] {
  const rows: Release[] = [];
  for (const page of pages) {
    if (/^supported platforms/i.test(page.title)) {
      if (rows.length) rows[rows.length - 1].platforms = page.href;
    } else {
      rows.push({ title: page.title, notes: page.href, date: page.date });
    }
  }
  return rows;
}

// One row per release: its notes and the platforms it supports. The newest is
// marked, since that is the one most readers are looking for.
export const Releases = ({ pages }: { pages: Page[] }) => (
  <ul className="not-prose divide-hairline border-hairline my-5 divide-y border-y">
    {releasesOf(pages).map((release, i) => (
      <li
        key={release.title}
        className="flex flex-wrap items-baseline gap-x-6 gap-y-1 py-2.5 text-[15px]"
      >
        <span className="text-ink min-w-40 font-semibold whitespace-nowrap">
          {release.title}
          {i === 0 && (
            <span className="bg-accent-soft text-link ml-2 rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-[0.04em] uppercase">
              Latest
            </span>
          )}
        </span>
        <Link href={release.notes} className={link}>
          Release notes
        </Link>
        {release.platforms && (
          <Link href={release.platforms} className={link}>
            Supported platforms
          </Link>
        )}
        {release.date && (
          <span className="text-ink-muted ml-auto text-sm">
            {formatDate(release.date)}
          </span>
        )}
      </li>
    ))}
  </ul>
);

const link =
  'text-link hover:text-link-hover font-medium underline-offset-4 hover:underline';

// An ISO date, as "June 4, 2026". Read as UTC so the day never shifts with the
// server's zone.
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
}
