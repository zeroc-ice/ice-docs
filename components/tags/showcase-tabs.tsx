// Copyright (c) ZeroC, Inc.
'use client';

import { useState, type ReactNode } from 'react';
import { clsx } from 'clsx';

import { setLanguage, useLanguage } from '@/context/state';
import { languageLabel } from '@/lib/docs-model/nav';

const tab =
  '-mb-px border-b-2 px-3 py-2.5 font-mono text-[12px] whitespace-nowrap transition-colors';
const activeTab = 'border-sky-400 text-white';
const idleTab = 'border-transparent text-white/55 hover:text-white';

export const LanguageTabs = ({ languages }: { languages: string[] }) => {
  const current = useLanguage();

  return (
    <div className="flex items-center border-b border-white/10 px-2 sm:px-3">
      <label className="my-2 sm:hidden">
        <span className="sr-only">Language</span>
        <select
          value={current}
          onChange={(event) => setLanguage(event.target.value)}
          className="cursor-pointer rounded-md border border-white/20 bg-white/10 px-2.5 py-1 font-mono text-[12px] text-white"
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {languageLabel(language)}
            </option>
          ))}
        </select>
      </label>
      <div
        role="group"
        aria-label="Language"
        className="hidden flex-wrap sm:flex"
      >
        {languages.map((language) => (
          <button
            key={language}
            type="button"
            aria-pressed={language === current}
            onClick={() => setLanguage(language)}
            className={clsx(tab, language === current ? activeTab : idleTab)}
          >
            {languageLabel(language)}
          </button>
        ))}
      </div>
    </div>
  );
};

// The client and the server of one mapping, one at a time.
export const FileTabs = ({
  files
}: {
  files: { title?: string; block: ReactNode }[];
}) => {
  const [shown, setShown] = useState(0);

  return (
    <div className="flex flex-col [&_.code-block]:flex-1 [&_.code-block]:rounded-t-none">
      <div
        role="group"
        aria-label="File"
        className="flex rounded-t-lg border border-b-0 border-(--code-border) bg-(--code-header-bg) px-1"
      >
        {files.map((file, i) => (
          <button
            key={file.title}
            type="button"
            aria-pressed={i === shown}
            onClick={() => setShown(i)}
            className={clsx(tab, i === shown ? activeTab : idleTab)}
          >
            {file.title}
          </button>
        ))}
      </div>
      {files[shown].block}
    </div>
  );
};
