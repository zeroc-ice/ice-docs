// Copyright (c) ZeroC, Inc.
'use client';

import { type ReactNode } from 'react';
import Link from 'next/link';
import { Check, ChevronDown, Languages, Tag } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { VersionOption } from '@/components/ice/VersionSelect';
import { setLanguage, useLanguage } from '@/context/state';
import { languageLabel } from '@/lib/docs-model/nav';

type Props = {
  version: string;
  languages: string[];
  versionOptions: VersionOption[];
  previousVersions?: { label: string; url: string };
};

// The version and language switches, as two boxes that say what is selected
// and open the same choices as the top bar.
export const Selection = ({
  version,
  languages,
  versionOptions,
  previousVersions
}: Props) => {
  const language = useLanguage();
  return (
    <div className="not-prose my-6 grid gap-3 sm:grid-cols-2">
      <Switch
        icon={<Tag aria-hidden="true" className="size-4" />}
        label="Version"
        value={`Ice ${version}`}
        note="Make sure it is the release you use."
      >
        {versionOptions.map((option) => (
          <Item
            key={option.value}
            href={option.href}
            selected={option.value === version}
          >
            Ice {option.value}
          </Item>
        ))}
        {previousVersions && (
          <>
            <DropdownMenuSeparator className="bg-hairline" />
            <Item href={previousVersions.url}>{previousVersions.label}…</Item>
          </>
        )}
      </Switch>
      <Switch
        icon={<Languages aria-hidden="true" className="size-4" />}
        label="Language"
        value={languageLabel(language)}
        note="Code samples and mapping sections change with it."
      >
        {languages.map((option) => (
          <Item
            key={option}
            onSelect={() => setLanguage(option)}
            selected={option === language}
          >
            {languageLabel(option)}
          </Item>
        ))}
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
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <button
        type="button"
        className="group flex w-full items-center gap-3 rounded-lg border border-hairline bg-surface-subtle px-4 py-3 text-left transition duration-150 hover:border-link/40 hover:shadow-[0_8px_24px_rgb(22_41_73/0.08)]"
      >
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
          className="size-4 shrink-0 text-ink-muted transition-transform group-data-[state=open]:rotate-180"
        />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      className="w-(--radix-dropdown-menu-trigger-width) border-hairline bg-surface p-1 text-ink shadow-lg"
    >
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
);

const itemClass =
  'focus:bg-surface-sunken flex cursor-pointer items-center justify-between rounded-sm px-2.5 py-1.5 text-sm';

// A choice that navigates (a version) or one that switches in place (a language).
const Item = ({
  href,
  onSelect,
  selected,
  children
}: {
  href?: string;
  onSelect?: () => void;
  selected?: boolean;
  children: ReactNode;
}) =>
  href ? (
    <DropdownMenuItem asChild>
      <Link
        href={href}
        aria-current={selected ? 'page' : undefined}
        className={itemClass}
      >
        {children}
        {selected && <Check aria-hidden="true" className="size-4 text-link" />}
      </Link>
    </DropdownMenuItem>
  ) : (
    <DropdownMenuItem
      onSelect={onSelect}
      aria-checked={selected}
      role="menuitemradio"
      className={itemClass}
    >
      {children}
      {selected && <Check aria-hidden="true" className="size-4 text-link" />}
    </DropdownMenuItem>
  );
