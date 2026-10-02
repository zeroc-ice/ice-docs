// Copyright (c) ZeroC, Inc.
'use client';

import { type ReactNode } from 'react';
import { ChevronDown, Languages, Tag } from 'lucide-react';

import { Menu } from '@/components/menu';
import { LanguageItems } from '@/components/ice/LanguageSelect';
import {
  VersionItems,
  type VersionOption
} from '@/components/ice/VersionSelect';
import { useLanguage } from '@/context/state';
import { languageLabel } from '@/lib/docs-model/nav';

type Props = {
  version: string;
  languages: string[];
  versionOptions: VersionOption[];
};

// The version and language switches, as two boxes that say what is selected
// and open the same choices as the top bar.
export const Selection = ({ version, languages, versionOptions }: Props) => {
  const language = useLanguage();
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
      <Switch
        icon={<Tag aria-hidden="true" className="size-4" />}
        label="Version"
        value={`Ice ${version}`}
        note="Make sure it is the release you use."
      >
        <VersionItems current={version} options={versionOptions} />
      </Switch>
      <Switch
        icon={<Languages aria-hidden="true" className="size-4" />}
        label="Language"
        value={languageLabel(language)}
        note="Code samples and mapping sections change with it."
      >
        <LanguageItems languages={languages} />
      </Switch>
    </div>
  );
};

const Switch = ({
  icon,
  label,
  value,
  note,
  children
}: {
  icon: ReactNode;
  label: string;
  value: string;
  note: string;
  children: ReactNode;
}) => (
  <Menu
    align="left"
    triggerClassName="group border-hairline bg-surface-subtle hover:border-link/40 flex w-full items-center gap-3 rounded-lg border px-4 py-3 text-left transition duration-150 hover:shadow-[0_8px_24px_rgb(22_41_73/0.08)]"
    trigger={
      <>
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-accent-soft text-link">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-semibold tracking-[0.07em] text-ink-muted uppercase">
            {label}
          </span>
          <span className="block text-lg leading-tight font-semibold text-ink">
            {value}
          </span>
          <span className="mt-1 block text-[13px] leading-snug text-ink-secondary">
            {note}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 shrink-0 text-ink-muted transition-transform group-aria-expanded:rotate-180"
        />
      </>
    }
  >
    {children}
  </Menu>
);
