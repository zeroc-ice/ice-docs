// Copyright (c) ZeroC, Inc.
'use client';

import { setLanguage, useLanguage } from '@/context/state';
import { languageLabel } from '@/lib/docs-model/nav';

// A dropdown (combo-box) language switcher, sized for the manual's nine mappings.
// Selecting a language switches the page in place: every mapping is already in it.
export function LanguageSelect({ languages }: { languages: string[] }) {
  const current = useLanguage();
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Programming language</span>
      <select
        aria-label="Programming language"
        value={current}
        onChange={(event) => setLanguage(event.target.value)}
        className="w-[6rem] cursor-pointer truncate rounded-md border border-black/15 bg-transparent py-1 pr-8 pl-3 text-sm hover:border-black/30 focus:outline-none xl:w-[7.5rem] dark:border-white/20 dark:hover:border-white/40"
      >
        {languages.map((language) => (
          <option key={language} value={language}>
            {languageLabel(language)}
          </option>
        ))}
      </select>
    </label>
  );
}
