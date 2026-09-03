// Copyright (c) ZeroC, Inc.
'use client';

import { useRouter } from 'next/navigation';

export interface LanguageOption {
  /** Language slug, e.g. "cpp". */
  value: string;
  /** Display label, e.g. "C++". */
  label: string;
  /** Where selecting this language navigates (the same page, or the language's landing). */
  href: string;
}

interface LanguageSelectProps {
  current: string;
  options: LanguageOption[];
}

// A dropdown (combo-box) language switcher, sized for the manual's nine mappings.
// Selecting a language navigates to the equivalent URL computed on the server.
export function LanguageSelect({ current, options }: LanguageSelectProps) {
  const router = useRouter();
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Programming language</span>
      <select
        aria-label="Programming language"
        value={current}
        onChange={(event) => {
          const next = options.find((option) => option.value === event.target.value);
          if (next) router.push(next.href);
        }}
        className="w-[6rem] cursor-pointer truncate rounded-md border border-black/15 bg-transparent py-1 pl-3 pr-8 text-sm hover:border-black/30 focus:outline-none xl:w-[7.5rem] dark:border-white/20 dark:hover:border-white/40"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
