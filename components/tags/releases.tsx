// Copyright (c) ZeroC, Inc.

import { type ReactNode } from 'react';

// The front page's release list, newest first.
export const Releases = ({ children }: { children: ReactNode }) => (
  <ul className="not-prose my-5 divide-y divide-hairline border-y border-hairline">
    {children}
  </ul>
);

type ReleaseProps = {
  name: string;
  date: string;
  /** The links to the release notes and the supported platforms. */
  children: ReactNode;
};

// One row per release: its notes and the platforms it supports. The newest, the
// first row, is marked, since that is the one most readers are looking for.
export const Release = ({ name, date, children }: ReleaseProps) => (
  <li className="group flex flex-wrap items-baseline gap-x-6 gap-y-1 py-2.5 text-[15px] [&_a]:hover:underline">
    <span className="min-w-40 font-semibold whitespace-nowrap text-ink">
      {name}
      <span className="ml-2 hidden rounded-full bg-accent-soft px-2 py-0.5 text-[11px] font-semibold tracking-[0.04em] text-link uppercase group-first:inline">
        Latest
      </span>
    </span>
    {children}
    <span className="ml-auto text-sm text-ink-muted">{date}</span>
  </li>
);
