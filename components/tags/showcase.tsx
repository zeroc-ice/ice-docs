// Copyright (c) ZeroC, Inc.
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';

import { CodeBlock } from '@/components/code-block';
import { languageLabel } from '@/lib/docs-model/nav';

interface Fence {
  /** The fence's info string, which is also the highlighter's grammar. */
  language: string;
  title?: string;
  code: string;
}

interface Sample {
  /** The manual's slug for the mapping the sample is written in. */
  mapping: string;
  client?: Fence;
  server?: Fence;
}

interface Props {
  version: string;
  current: string;
  /** The route of the page the tag is on, e.g. `/ice/3.8/cpp/ice-manual`. */
  path: string;
  languages: string[];
  contract: Fence;
  samples: Sample[];
}

const tab =
  '-mb-px border-b-2 px-3 py-2.5 font-mono text-[12px] whitespace-nowrap transition-colors';
const activeTab = 'border-sky-400 text-white';
const idleTab = 'border-transparent text-white/55 hover:text-white';

// One contract, nine languages: the Slice interface beside the client that
// calls it and, where the mapping has one, the server that implements it.
// The language tabs are the manual's language switch: each links to this
// page in that mapping, so the top bar follows. Always dark, whatever the
// theme, so the panel reads as an editor rather than a pair of ordinary code
// blocks.
export const Showcase = ({
  version,
  current,
  path,
  languages,
  contract,
  samples
}: Props) => {
  const router = useRouter();
  const byMapping = new Map(samples.map((sample) => [sample.mapping, sample]));
  const tabs = languages.filter((lang) => byMapping.has(lang));
  const sample = byMapping.get(current);
  const files = [sample?.client, sample?.server].filter(
    (fence): fence is Fence => fence !== undefined
  );
  const [file, setFile] = useState(0);
  const shown = files[file] ?? files[0];
  const slug = path.split('/').pop() ?? '';
  const hrefOf = (lang: string) => `/ice/${version}/${lang}/${slug}`;

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
            onChange={(event) => router.push(hrefOf(event.target.value))}
            className="rounded-md border border-white/20 bg-white/10 px-2.5 py-1 font-mono text-[12px] text-white"
          >
            {tabs.map((lang) => (
              <option key={lang} value={lang}>
                {languageLabel(lang)}
              </option>
            ))}
          </select>
        </label>
        <nav aria-label="Language" className="hidden flex-wrap sm:flex">
          {tabs.map((lang) => (
            <Link
              key={lang}
              href={hrefOf(lang)}
              aria-current={lang === current ? 'page' : undefined}
              className={clsx(tab, lang === current ? activeTab : idleTab)}
            >
              {languageLabel(lang)}
            </Link>
          ))}
        </nav>
      </div>

      <div className="grid gap-3 p-3 sm:p-4 lg:grid-cols-2 [&>*]:min-w-0 [&>.code-block]:h-full">
        <CodeBlock data-language={contract.language} title={contract.title}>
          {contract.code}
        </CodeBlock>
        {shown && (
          <div className="flex flex-col [&_.code-block]:flex-1 [&_.code-block]:rounded-t-none">
            <div
              role="group"
              aria-label="File"
              className="flex rounded-t-lg border border-b-0 border-(--code-border) bg-(--code-header-bg) px-1"
            >
              {files.map((fence, i) => (
                <button
                  key={fence.title}
                  type="button"
                  aria-pressed={fence === shown}
                  onClick={() => setFile(i)}
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
        )}
      </div>
    </section>
  );
};
