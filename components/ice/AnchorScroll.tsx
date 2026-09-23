// Copyright (c) ZeroC, Inc.
'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

import { setLanguage } from '@/context/state';

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

/** The heading id a `#fragment` names; a mangled fragment names none. */
export function fragmentId(hash: string): string {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return '';
  }
}

/**
 * Scroll to the heading on display, switching to a mapping that has the
 * heading when the reader's does not: a link to a mapping's own section is a
 * link to that mapping.
 */
function scrollToId(id: string) {
  if (!visibleTarget(id)) {
    const langs = document
      .getElementById(id)
      ?.closest('[data-langs]')
      ?.getAttribute('data-langs');
    if (langs) setLanguage(langs.split(' ')[0]);
  }
  visibleTarget(id)?.scrollIntoView();
}

/**
 * Go to a heading on this page, as following a link to it does. The history
 * entry goes through the router's `pushState`, so Back and Forward still
 * restore the page, and the `hashchange` that `pushState` does not fire is
 * sent for the outline, which follows the fragment.
 */
export function goToHeading(id: string) {
  if (fragmentId(location.hash) !== id) {
    const oldURL = location.href;
    history.pushState(null, '', `#${id}`);
    window.dispatchEvent(
      new HashChangeEvent('hashchange', { oldURL, newURL: location.href })
    );
  }
  scrollToId(id);
}

// The browser, and the router after a client-side navigation, scroll to the
// first element with the fragment's id. When that copy is another mapping's it
// is hidden and nothing moves, so this finds the copy on show. A click on a link
// to a heading on this page, however the link is written, is taken in the
// capture phase, ahead of the router's own handler, which would scroll to the
// first copy too.
export function AnchorScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const id = fragmentId(location.hash);
    if (id && document.getElementById(id)?.offsetParent === null)
      scrollToId(id);
  }, [pathname]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
        return;
      const link = (event.target as Element).closest('a');
      if (
        !link ||
        link.origin !== location.origin ||
        link.pathname !== location.pathname
      )
        return;
      const id = fragmentId(link.hash);
      if (!id) return;
      event.preventDefault();
      goToHeading(id);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
