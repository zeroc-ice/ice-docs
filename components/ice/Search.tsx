// Copyright (c) ZeroC, Inc.
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

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
  /** Heading keywords */
  x: string;
}

interface SearchProps {
  version: string;
  language: string;
}

// A manual this size is unusable without search. The index is per (version,
// language) and fetched the first time the palette opens, so a reader never
// downloads the eight language mappings they are not reading.
export function Search({ version, language }: SearchProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // The index is per version+language, so it is cached under that key rather
  // than cleared when either changes.
  const indexKey = `${version}/${language}`;
  const [index, setIndex] = useState<{ key: string; pages: Record[] } | null>(null);
  const records = index?.key === indexKey ? index.pages : null;

  // ⌘K / Ctrl-K from anywhere, Escape to leave.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        opener.current = document.activeElement as HTMLElement;
        setOpen((was) => !was);
      } else if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) {
      opener.current?.focus();
      return;
    }
    inputRef.current?.focus();
    if (records) return;
    fetch(`/search/${indexKey}.json`)
      .then((response) => (response.ok ? response.json() : { pages: [] }))
      .then((data) => setIndex({ key: indexKey, pages: data.pages ?? [] }))
      .catch(() => setIndex({ key: indexKey, pages: [] }));
  }, [open, records, indexKey]);

  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle || !records) return [];
    const scored = [];
    for (const record of records) {
      const title = record.t.toLowerCase();
      // Rank by where the match is: a title beats a heading beats prose.
      let score = 0;
      if (title === needle) score = 100;
      else if (title.startsWith(needle)) score = 80;
      else if (title.includes(needle)) score = 60;
      else if (record.x.toLowerCase().includes(needle)) score = 40;
      else if (record.c.toLowerCase().includes(needle)) score = 25;
      else if (record.d.toLowerCase().includes(needle)) score = 20;
      if (score) scored.push({ record, score });
    }
    return scored
      .sort((a, b) => b.score - a.score || a.record.t.localeCompare(b.record.t))
      .slice(0, 25)
      .map((entry) => entry.record);
  }, [query, records]);

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
        }}
        className="flex shrink-0 items-center gap-2 rounded-md border border-black/15 px-2 py-1 text-sm opacity-70 hover:opacity-100 lg:px-3 dark:border-white/20"
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <circle cx="9" cy="9" r="6" stroke="currentColor" strokeWidth="2" />
          <path d="M13.5 13.5 L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden rounded border border-black/15 px-1 text-[10px] xl:inline dark:border-white/20">
          ⌘K
        </kbd>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 p-4 pt-[12vh]"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Search the documentation"
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[70vh] w-full max-w-2xl flex-col overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-900"
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
                  {records === null ? 'Loading the index…' : `No page matches “${query}”.`}
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
                      <span className="rounded-full bg-black/5 px-1.5 py-0.5 text-[10px] uppercase tracking-wide opacity-60 dark:bg-white/10">
                        {record.k}
                      </span>
                    )}
                  </span>
                  {record.c && <span className="text-xs opacity-50">{record.c}</span>}
                </button>
              ))}
            </div>

            <div className="flex gap-4 border-t border-black/10 px-4 py-2 text-[11px] opacity-50 dark:border-white/10">
              <span>↑↓ to navigate</span>
              <span>↵ to open</span>
              <span>esc to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
