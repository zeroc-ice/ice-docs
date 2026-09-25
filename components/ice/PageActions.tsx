// Copyright (c) ZeroC, Inc.

import { ReactNode } from 'react';
import { MessageSquare, SquarePen, type LucideIcon } from 'lucide-react';

import { languageLabel } from '@/lib/docs-model/nav';

export interface EditLinks {
  /** GitHub's editor for the page's `index.md`; absent on a page written per language. */
  shared?: string;
  /** language -> GitHub's editor for the page's `<lang>.md`. */
  overlays: Record<string, string>;
}

// What a reader can do about the page: propose a fix on GitHub, or ask about
// it. The text written for one language lives in that language's overlay, so a
// page with overlays offers the reader's overlay beside its shared text.
export function PageActions({ edit }: { edit: EditLinks }) {
  return (
    <div className="shrink-0">
      <div className="mb-2 text-[11px] font-semibold tracking-[0.07em] text-ink-muted uppercase">
        Actions
      </div>
      <ul>
        {edit.shared && (
          <Action href={edit.shared} icon={SquarePen}>
            Edit this page
          </Action>
        )}
        {Object.entries(edit.overlays).map(([language, href]) => (
          <Action key={language} langs={language} href={href} icon={SquarePen}>
            {edit.shared
              ? `Edit the ${languageLabel(language)} text`
              : 'Edit this page'}
          </Action>
        ))}
        <Action
          href="https://github.com/zeroc-ice/ice/discussions"
          icon={MessageSquare}
        >
          GitHub Discussions
        </Action>
      </ul>
    </div>
  );
}

function Action({
  href,
  icon: Icon,
  langs,
  children
}: {
  href: string;
  icon: LucideIcon;
  langs?: string;
  children: ReactNode;
}) {
  return (
    <li data-langs={langs}>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 py-1 text-[13px] leading-snug text-ink-secondary transition-colors hover:text-ink"
      >
        <Icon className="size-3.5 shrink-0" />
        {children}
      </a>
    </li>
  );
}
