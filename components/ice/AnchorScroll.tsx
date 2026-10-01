// Copyright (c) ZeroC, Inc.
'use client';

import { useEffect, useLayoutEffect } from 'react';
import { usePathname } from 'next/navigation';

import { setLanguage } from '@/context/state';
import { LANGUAGE_LABELS } from '@/lib/docs-model/nav';

/** The mapping a URL's `?lang=` names, if it is one of the version's. */
function queryLanguage(url: URL): string | undefined {
  const language = url.searchParams.get('lang') ?? '';
  return Object.hasOwn(LANGUAGE_LABELS, language) ? language : undefined;
}

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
 * sent for the outline, which follows jumps. It is sent even when the URL
 * already names the heading, since going there again is still a jump.
 */
export function goToHeading(id: string) {
  const oldURL = location.href;
  if (fragmentId(location.hash) !== id) history.pushState(null, '', `#${id}`);
  window.dispatchEvent(
    new HashChangeEvent('hashchange', { oldURL, newURL: location.href })
  );
  scrollToId(id);
}

// The browser, and the router after a client-side navigation, scroll to the
// first element with the fragment's id. When that copy is another mapping's it
// is hidden and nothing moves, so this finds the copy on show. A click on a link
// to a heading on this page, however the link is written, is taken in the
// capture phase, ahead of the router's own handler, which would scroll to the
// first copy too. A link can also name the mapping to show with `?lang=`, which
// the root layout's script applies on a full load. Here it applies when a link
// on this page is clicked, or after a client-side navigation, before the page
// paints and with the address dropping it.
export function AnchorScroll() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const url = new URL(location.href);
    const language = queryLanguage(url);
    if (!language) return;
    setLanguage(language);
    url.searchParams.delete('lang');
    history.replaceState(null, '', url);
  }, [pathname]);

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
      const language = queryLanguage(new URL(link.href));
      if (!id && !language) return;
      event.preventDefault();
      if (language) setLanguage(language);
      if (id) goToHeading(id);
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  return null;
}
