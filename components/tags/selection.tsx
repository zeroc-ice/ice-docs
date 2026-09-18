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
import type { LanguageOption } from '@/components/ice/LanguageSelect';
import type { VersionOption } from '@/components/ice/VersionSelect';
import { languageLabel } from '@/lib/docs-model/nav';

type Props = {
  version: string;
  language: string;
  languageOptions: LanguageOption[];
  versionOptions: VersionOption[];
  previousVersions?: { label: string; url: string };
};

// The version and language switches, as two boxes that say what is selected
// and open the same choices as the top bar.
export const Selection = ({
  version,
  language,
  languageOptions,
  versionOptions,
  previousVersions
}: Props) => (
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
      note="Code samples, and a few whole pages, change with it."
    >
      {languageOptions.map((option) => (
        <Item
          key={option.value}
          href={option.href}
          selected={option.value === language}
        >
          {option.label}
        </Item>
      ))}
    </Switch>
  </div>
);

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
        className="group border-hairline bg-surface-subtle hover:border-link/40 flex w-full cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 text-left transition duration-150 hover:shadow-[0_8px_24px_rgb(22_41_73/0.08)]"
      >
        <span className="bg-accent-soft text-link flex size-8 shrink-0 items-center justify-center rounded-md">
          {icon}
        </span>
        <span className="min-w-0 flex-1">
          <span className="text-ink-muted block text-[11px] font-semibold tracking-[0.07em] uppercase">
            {label}
          </span>
          <span className="text-ink block text-lg leading-tight font-semibold">
            {value}
          </span>
          <span className="text-ink-secondary mt-1 block text-[13px] leading-snug">
            {note}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="text-ink-muted size-4 shrink-0 transition-transform group-data-[state=open]:rotate-180"
        />
      </button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      align="start"
      className="border-hairline bg-surface text-ink w-(--radix-dropdown-menu-trigger-width) p-1 shadow-lg"
    >
      {children}
    </DropdownMenuContent>
  </DropdownMenu>
);

const Item = ({
  href,
  selected,
  children
}: {
  href: string;
  selected?: boolean;
  children: ReactNode;
}) => (
  <DropdownMenuItem asChild>
    <Link
      href={href}
      aria-current={selected ? 'page' : undefined}
      className="focus:bg-surface-sunken flex cursor-pointer items-center justify-between rounded-sm px-2.5 py-1.5 text-sm"
    >
      {children}
      {selected && <Check aria-hidden="true" className="text-link size-4" />}
    </Link>
  </DropdownMenuItem>
);
