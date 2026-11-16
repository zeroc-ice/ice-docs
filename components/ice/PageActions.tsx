// Copyright (c) ZeroC, Inc.

import { Fragment, ReactNode } from 'react';
import {
  FileText,
  MessageSquare,
  SquarePen,
  type LucideIcon
} from 'lucide-react';

import { CopyMarkdown } from '@/components/ice/CopyMarkdown';
import { languageLabel } from '@/lib/docs-model/nav';

export interface EditLinks {
  /** GitHub's editor for the page's `index.md`; absent on a page written per language. */
  shared?: string;
  /** language -> GitHub's editor for the page's `<lang>.md`. */
  overlays: Record<string, string>;
}

export interface MarkdownLinks {
  /** The page as Markdown, for every mapping it is written for. */
  page: string;
  /** language -> the page as Markdown for that mapping; empty when its text is the same for every mapping. */
  languages: Record<string, string>;
}

// What a reader can do about the page: take it as Markdown to an AI assistant,
// propose a fix on GitHub, or ask about it. The text written for one language
// lives in that language's overlay, so a page with overlays offers the reader's
// overlay beside its shared text, and a page whose text differs by language
// offers the reader's Markdown.
export function PageActions({
  edit,
  markdown
}: {
  edit: EditLinks;
  markdown: MarkdownLinks;
}) {
  const perLanguage = Object.entries(markdown.languages);
  const copies: [string | undefined, string][] = perLanguage.length
    ? perLanguage
    : [[undefined, markdown.page]];
  return (
    <div className="shrink-0">
      <div className="mb-2 text-xs font-semibold tracking-wider text-ink-muted uppercase">
        Actions
      </div>
      <ul>
        {copies.map(([language, href]) => (
          <Fragment key={href}>
            <CopyMarkdown langs={language} href={href} />
            <Action langs={language} href={href} icon={FileText}>
              View as Markdown
            </Action>
          </Fragment>
        ))}
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
        className="flex items-center gap-2 focus-ring-text py-1 text-sm leading-snug text-ink-secondary transition-colors hover:text-ink"
      >
        <Icon className="size-3.5 shrink-0" />
        {children}
      </a>
    </li>
  );
}
