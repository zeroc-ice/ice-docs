// Copyright (c) ZeroC, Inc.
'use client';

import { useRouter } from 'next/navigation';

export interface VersionOption {
  /** Version directory, e.g. "3.8". */
  value: string;
  /** Where selecting this version navigates (the equivalent page, or its landing). */
  href: string;
}

interface VersionSelectProps {
  current: string;
  options: VersionOption[];
  /** Older releases that live outside this site. */
  previousVersions?: { label: string; url: string };
}

// Which version you are reading has to be unmistakable — it is the single most
// expensive thing for a reader to get wrong, and search engines land people on
// old releases constantly. So the version is always spelled out in the top bar,
// even when there is only one to choose from.
export function VersionSelect({ current, options, previousVersions }: VersionSelectProps) {
  const router = useRouter();
  const single = options.length <= 1 && !previousVersions;

  if (single) {
    return (
      <span className="rounded-md border border-black/15 px-3 py-1 text-sm dark:border-white/20">
        Ice {current}
      </span>
    );
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Ice version</span>
      <select
        aria-label="Ice version"
        value={current}
        onChange={(event) => {
          const value = event.target.value;
          if (value === '__previous' && previousVersions) {
            window.location.href = previousVersions.url;
            return;
          }
          const next = options.find((option) => option.value === value);
          if (next) router.push(next.href);
        }}
        className="w-[8.5rem] cursor-pointer truncate rounded-md border border-black/15 bg-transparent py-1 pl-3 pr-8 text-sm hover:border-black/30 focus:outline-none xl:w-[10rem] dark:border-white/20 dark:hover:border-white/40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            Ice {option.value}
          </option>
        ))}
        {previousVersions && <option value="__previous">{previousVersions.label}…</option>}
      </select>
    </label>
  );
}
