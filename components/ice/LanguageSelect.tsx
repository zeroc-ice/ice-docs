// Copyright (c) ZeroC, Inc.
'use client';

import { ChevronDown } from 'lucide-react';

import { Menu, MenuItem } from '@/components/menu';
import { setLanguage, useLanguage } from '@/context/state';
import { languageLabel } from '@/lib/docs-model/nav';

// A dropdown language switcher, sized for the nine mappings.
// Selecting a language switches the page in place: every mapping is already in it.
export function LanguageSelect({ languages }: { languages: string[] }) {
  const current = useLanguage();
  return (
    <Menu
      align="right"
      triggerClassName="flex min-w-0 items-center justify-between gap-1 rounded-md border border-black/15 py-1 pr-2 pl-3 text-sm hover:border-black/30 sm:w-[6rem] xl:w-[7.5rem] dark:border-white/20 dark:hover:border-white/40"
      trigger={
        <>
          <span className="sr-only">Programming language: </span>
          <span className="truncate">{languageLabel(current)}</span>
          <ChevronDown
            aria-hidden="true"
            className="size-4 shrink-0 text-ink-muted"
          />
        </>
      }
    >
      <LanguageItems languages={languages} />
    </Menu>
  );
}

// The language choices, shared with the front page's switch so that both offer
// the same ones.
export function LanguageItems({ languages }: { languages: string[] }) {
  const current = useLanguage();
  return languages.map((language) => (
    <MenuItem
      key={language}
      checked={language === current}
      onSelect={() => setLanguage(language)}
    >
      {languageLabel(language)}
    </MenuItem>
  ));
}
