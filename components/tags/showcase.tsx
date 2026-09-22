// Copyright (c) ZeroC, Inc.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';

import { CodeBlock } from '@/components/code-block';
import type { LanguageOption } from '@/components/ice/LanguageSelect';

interface Fence {
  /** The fence's info string, which is also the highlighter's grammar. */
  language: string;
  title?: string;
  code: string;
}

interface Props {
  current: string;
  /** The top bar's language targets: this page in each mapping. */
  languageOptions: LanguageOption[];
  contract: Fence;
  client: Fence;
  server?: Fence;
}

const tab =
  '-mb-px border-b-2 px-3 py-2.5 font-mono text-[12px] whitespace-nowrap transition-colors';
const activeTab = 'border-sky-400 text-white';
const idleTab = 'border-transparent text-white/55 hover:text-white';

// The Slice contract beside the client that calls it and, where the mapping
// has one, the server that implements it. The language tabs are the manual's
// language switch: each links to this page in that mapping, so the top bar
// follows. Always dark, whatever the theme, so the panel reads as an editor
// rather than a pair of ordinary code blocks.
export const Showcase = ({
  current,
  languageOptions,
  contract,
  client,
  server
}: Props) => {
  const router = useRouter();
  const [showServer, setShowServer] = useState(false);
  const shown = showServer && server ? server : client;

  return (
    <section
      aria-label="Ice in every language"
      className="doc-wide dark not-prose text-ink my-8 overflow-hidden rounded-lg border border-white/10 bg-[#0b0f19] [&_.code-block]:my-0 [&_code>div]:text-[11px] sm:[&_code>div]:text-xs [&_pre]:overflow-x-auto"
    >
      <div className="flex items-center border-b border-white/10 px-2 sm:px-3">
        <label className="my-2 sm:hidden">
          <span className="sr-only">Language</span>
          <select
            value={current}
            onChange={(event) =>
              router.push(
                languageOptions.find((o) => o.value === event.target.value)
                  ?.href ?? ''
              )
            }
            className="cursor-pointer rounded-md border border-white/20 bg-white/10 px-2.5 py-1 font-mono text-[12px] text-white"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <nav aria-label="Language" className="hidden flex-wrap sm:flex">
          {languageOptions.map((option) => (
            <Link
              key={option.value}
              href={option.href}
              aria-current={option.value === current ? 'page' : undefined}
              className={clsx(
                tab,
                option.value === current ? activeTab : idleTab
              )}
            >
              {option.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid gap-3 p-3 sm:p-4 xl:grid-cols-2 [&>*]:min-w-0 [&>.code-block]:h-full">
        <CodeBlock data-language={contract.language} title={contract.title}>
          {contract.code}
        </CodeBlock>
        {server ? (
          <div className="flex flex-col [&_.code-block]:flex-1 [&_.code-block]:rounded-t-none">
            <div
              role="group"
              aria-label="File"
              className="flex rounded-t-lg border border-b-0 border-(--code-border) bg-(--code-header-bg) px-1"
            >
              {[client, server].map((fence) => (
                <button
                  key={fence.title}
                  type="button"
                  aria-pressed={fence === shown}
                  onClick={() => setShowServer(fence === server)}
                  className={clsx(tab, fence === shown ? activeTab : idleTab)}
                >
                  {fence.title}
                </button>
              ))}
            </div>
            <CodeBlock data-language={shown.language} showTitle={false}>
              {shown.code}
            </CodeBlock>
          </div>
        ) : (
          <CodeBlock data-language={client.language} title={client.title}>
            {client.code}
          </CodeBlock>
        )}
      </div>
    </section>
  );
};
