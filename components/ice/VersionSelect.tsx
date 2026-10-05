// Copyright (c) ZeroC, Inc.
'use client';

import { ChevronDown } from 'lucide-react';

import { Menu, MenuItem, MenuSeparator } from '@/components/menu';

export interface VersionOption {
  /** Version directory, e.g. "3.8". */
  value: string;
  /** This page's path in that version. */
  href: string;
}

interface VersionSelectProps {
  current: string;
  options: VersionOption[];
}

// Which version you are reading has to be unmistakable — it is the single most
// expensive thing for a reader to get wrong, and search engines land people on
// old releases constantly. So the version is always spelled out in the top bar,
// even when there is only one to choose from.
export function VersionSelect({ current, options }: VersionSelectProps) {
  return (
    <Menu
      align="left"
      triggerClassName="flex w-[8.5rem] items-center justify-between gap-1 rounded-md border border-black/15 py-1 pr-2 pl-3 text-sm hover:border-black/30 xl:w-[10rem] dark:border-white/20 dark:hover:border-white/40"
      trigger={
        <>
          <span className="sr-only">Ice version: </span>
          <span className="truncate">Ice {current}</span>
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 text-ink-muted"
          />
        </>
      }
    >
      {/* The older releases live on the archive site. */}
      {options.map((option) => (
        <MenuItem
          key={option.value}
          href={option.href}
          checked={option.value === current}
        >
          Ice {option.value}
        </MenuItem>
      ))}
      <MenuSeparator />
      <MenuItem href="https://archive.zeroc.com/">Previous Versions…</MenuItem>
    </Menu>
  );
}
