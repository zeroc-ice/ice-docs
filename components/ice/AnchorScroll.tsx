// Copyright (c) ZeroC, Inc.
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * The element with `id` that is on display. A section written per language
 * mapping repeats its headings, one per mapping, and only the reader's mapping
 * is visible; the browser's own lookup stops at the first, hidden or not.
 */
export function visibleTarget(id: string): HTMLElement | null {
  const candidates = [
    ...document.querySelectorAll<HTMLElement>(`[id="${CSS.escape(id)}"]`)
  ];
  return candidates.find((el) => el.offsetParent !== null) ?? null;
}

export function scrollToId(id: string) {
  visibleTarget(id)?.scrollIntoView();
}

// Sends every jump to a heading — the fragment the reader arrived with, and a
// click on an in-page link — to the copy of the heading they can see. Clicks
// are taken in the capture phase, ahead of the router's own link handler,
// which would scroll to the first copy.
export function AnchorScroll() {
  const pathname = usePathname();
  useEffect(() => {
    const jump = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (id) scrollToId(id);
    };
    const onClick = (event: MouseEvent) => {
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const link = (event.target as Element).closest('a[href^="#"]');
      const id =
        link && decodeURIComponent(link.getAttribute('href')!.slice(1));
      const target = id && visibleTarget(id);
      if (!target) return;
      event.preventDefault();
      window.history.pushState(null, '', `#${id}`);
      target.scrollIntoView();
    };
    jump();
    window.addEventListener('hashchange', jump);
    document.addEventListener('click', onClick, true);
    return () => {
      window.removeEventListener('hashchange', jump);
      document.removeEventListener('click', onClick, true);
    };
  }, [pathname]);
  return null;
}
