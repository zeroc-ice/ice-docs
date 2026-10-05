// Copyright (c) ZeroC, Inc.
'use client';

import { ChevronDown, Languages } from 'lucide-react';

import { Menu } from '@/components/menu';
import { LanguageItems } from '@/components/ice/LanguageSelect';
import { useLanguage } from '@/context/state';
import { languageLabel } from '@/lib/docs-model/nav';

type Props = {
  languages: string[];
};

// The language switch, as a box that says what is selected and opens the same
// choices as the top bar.
export const Selection = ({ languages }: Props) => {
  const language = useLanguage();
  return (
    <div className="not-prose my-6 sm:w-1/2">
      <Menu
        align="left"
        triggerClassName="group border-hairline bg-surface-subtle hover:border-link/40 flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition duration-150 hover:shadow-[0_8px_24px_rgb(22_41_73/0.08)]"
        trigger={
          <>
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent-soft text-link">
              <Languages aria-hidden="true" className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-semibold tracking-[0.07em] text-ink-muted uppercase">
                Language
              </span>
              <span className="block text-lg leading-tight font-semibold text-ink">
                {languageLabel(language)}
              </span>
              <span className="mt-1 block text-[13px] leading-snug text-ink-secondary">
                Code samples and mapping sections change with it.
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 text-ink-muted transition-transform group-aria-expanded:rotate-180"
            />
          </>
        }
      >
        <LanguageItems languages={languages} />
      </Menu>
    </div>
  );
};
