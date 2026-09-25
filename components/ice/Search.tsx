// Copyright (c) ZeroC, Inc.
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { useLanguage } from '@/context/state';

interface Record {
  /** Title */
  t: string;
  /** Description */
  d: string;
  /** Crumb, e.g. "Learn Ice › Slice" */
  c: string;
  /** Diátaxis kind */
  k: string;
  /** Href */
  h: string;
  /** Heading keywords of the shared text */
  x: string;
  /** Heading keywords of each mapping's own text */
  l: { [language: string]: string };
  /** The languages the page is written for; every language when absent. */
  w?: string[];
}

// A manual this size is unusable without search. The index is per version and
// fetched the first time the palette opens.
export function Search({ version }: { version: string }) {
  const router = useRouter();
  const language = useLanguage();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Cached under its version, rather than cleared when the version changes.
  const [index, setIndex] = useState<{ key: string; pages: Record[] } | null>(
    null
  );
  const records = index?.key === version ? index.pages : null;

  // ⌘K / Ctrl-K from anywhere. The modal dialog closes itself on Escape.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        opener.current = document.activeElement as HTMLElement;
        setOpen((was) => !was);
        setSelected(0);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Modal, so the dialog sits in the top layer, clear of the header's backdrop
  // filter.
  useEffect(() => {
    const dialog = dialogRef.current!;
    if (!open) {
      dialog.close();
      opener.current?.focus();
      return;
    }
    if (!dialog.open) dialog.showModal();
    inputRef.current?.focus();
    if (records) return;
    fetch(`/search/${version}.json`)
      .then((response) => response.json() as Promise<{ pages: Record[] }>)
      .then((data) => setIndex({ key: version, pages: data.pages }))
      .catch(() => setIndex({ key: version, pages: [] }));
  }, [open, records, version]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle || !records) return [];
    const scored = [];
    for (const record of records) {
      // The sidebar hides these pages from the reader; so does search.
      if (record.w && !record.w.includes(language)) continue;
      const title = record.t.toLowerCase();
      // Rank by where the match is: a title beats a heading beats prose.
      let score = 0;
      if (title === needle) score = 100;
      else if (title.startsWith(needle)) score = 80;
      else if (title.includes(needle)) score = 60;
      else if (
        `${record.x} ${record.l[language] ?? ''}`.toLowerCase().includes(needle)
      )
        score = 40;
      else if (record.c.toLowerCase().includes(needle)) score = 25;
      else if (record.d.toLowerCase().includes(needle)) score = 20;
      if (score) scored.push({ record, score });
    }
    return scored
      .sort((a, b) => b.score - a.score || a.record.t.localeCompare(b.record.t))
      .slice(0, 25)
      .map((entry) => entry.record);
  }, [query, records, language]);

  const go = useCallback(
    (record?: Record) => {
      if (!record) return;
      setOpen(false);
      setQuery('');
      router.push(record.h);
    },
    [router]
  );

  return (
    <>
      <button
        type="button"
        onClick={(event) => {
          opener.current = event.currentTarget;
          setOpen(true);
          // The results may have changed with the mapping since it closed.
          setSelected(0);
        }}
        className="flex shrink-0 items-center gap-2 rounded-md border border-black/15 px-2 py-1 text-sm opacity-70 hover:opacity-100 lg:px-3 dark:border-white/20"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
          <path
            d="M13.5 13.5 L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden rounded border border-black/15 px-1 text-[10px] xl:inline dark:border-white/20">
          ⌘K
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Search the documentation"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          // The content fills the dialog, so a click on the dialog itself is a
          // click on its backdrop.
          if (event.target === event.currentTarget) setOpen(false);
        }}
        className="mx-auto mt-[12vh] max-h-[70vh] w-[calc(100%-2rem)] max-w-2xl flex-col overflow-hidden rounded-xl border border-black/10 bg-white text-inherit shadow-2xl backdrop:bg-black/40 open:flex dark:border-white/10 dark:bg-neutral-900"
      >
        <input
          ref={inputRef}
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setSelected(0); // a new query starts at the top of its results
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              setSelected((i) => Math.min(i + 1, results.length - 1));
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              setSelected((i) => Math.max(i - 1, 0));
            } else if (event.key === 'Enter') {
              event.preventDefault();
              go(results[selected]);
            }
          }}
          placeholder={`Search the Ice ${version} manual…`}
          aria-label="Search query"
          className="w-full border-b border-black/10 bg-transparent px-4 py-3.5 text-base outline-none dark:border-white/10"
        />

        <div className="overflow-y-auto">
          {query && results.length === 0 && (
            <p className="px-4 py-6 text-sm opacity-60">
              {records === null
                ? 'Loading the index…'
                : `No page matches “${query}”.`}
            </p>
          )}

          {results.map((record, i) => (
            <button
              key={record.h}
              type="button"
              onMouseEnter={() => setSelected(i)}
              onClick={() => go(record)}
              className={`flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left ${
                i === selected ? 'bg-blue-600/10' : ''
              }`}
            >
              <span className="flex items-center gap-2">
                <span className="font-medium">{record.t}</span>
                {record.k && (
                  <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[10px] tracking-wide uppercase opacity-60 dark:bg-white/10">
                    {record.k}
                  </span>
                )}
              </span>
              {record.c && (
                <span className="text-xs opacity-50">{record.c}</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex gap-4 border-t border-black/10 px-4 py-2 text-[11px] opacity-50 dark:border-white/10">
          <span>↑↓ to navigate</span>
          <span>↵ to open</span>
          <span>esc to close</span>
        </div>
      </dialog>
    </>
  );
}
