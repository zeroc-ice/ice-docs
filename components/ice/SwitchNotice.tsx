// Copyright (c) ZeroC, Inc.
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Notice {
  /** Where the reader came from. */
  href: string;
  label: string;
}

/**
 * Shown when a language or version switch could not land on the page the reader
 * was actually reading.
 *
 * Silently redirecting someone to a different page is the worst option: they
 * believe they are looking at the equivalent page and read the wrong thing. So
 * the switcher appends `?from=<url>&fromLabel=<label>` when it has to fall back,
 * and this says so — with a link back to where they were.
 *
 * The page keys this component by route, so every page gets a fresh instance
 * that reads the query once, when it mounts. Without that, the instance would
 * survive client-side navigation and carry the notice to every page after it,
 * announcing a fallback that never happened.
 */
export function SwitchNotice() {
  const params = useSearchParams();
  const [notice, setNotice] = useState<Notice | null>(() => {
    const from = params.get('from');
    // Only ever link back to a page on this site.
    if (!from || !from.startsWith('/ice/')) return null;
    return { href: from, label: params.get('fromLabel') ?? 'the page you were reading' };
  });

  // Drop the parameters so a refresh, or a link the reader copies, is clean.
  useEffect(() => {
    if (!notice) return;
    const url = new URL(window.location.href);
    if (!url.search) return;
    url.search = '';
    window.history.replaceState({}, '', url);
  }, [notice]);

  if (!notice) return null;

  return (
    <div className="border-b border-amber-300/60 bg-amber-50 px-6 py-2.5 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-100">
      <div className="mx-auto flex max-w-400 items-center justify-between gap-4">
        <span>
          That page is not available here, so this is the closest one.{' '}
          <Link href={notice.href} className="font-semibold underline underline-offset-4">
            Back to {notice.label}
          </Link>
        </span>
        <button
          type="button"
          onClick={() => setNotice(null)}
          aria-label="Dismiss"
          className="shrink-0 opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
