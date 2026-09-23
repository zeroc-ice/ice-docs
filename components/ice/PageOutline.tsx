// Copyright (c) ZeroC, Inc.
'use client';

import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

export interface OutlineHeading {
  id: string;
  title: string;
  level: number;
}

// Below this the outline stops showing sub-headings. Reference pages in this
// manual can carry sixty headings; listing all of them turns the rail into a
// second, worse sidebar that hides where the reader actually is.
const DENSE_THRESHOLD = 24;

// Distance from the top of the viewport at which a heading counts as "the one
// being read" — just under the two sticky bars.
const ACTIVATION_LINE = 132;

// "On this page", with the section the reader is in marked. Fixed width and
// hard truncation: a property name like `Ice.Default.EncodingVersion` must never
// widen the rail or spill out of it.
export function PageOutline({ headings }: { headings: OutlineHeading[] }) {
  const dense = headings.length > DENSE_THRESHOLD;
  const items = dense ? headings.filter((h) => h.level === 2) : headings;

  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  // A string rather than the array, so marking a new section active does not
  // hand the effect a fresh array identity and make it re-subscribe every tick.
  const ids = items.map((item) => item.id).join('\n');

  useEffect(() => {
    if (!ids) return;
    const list = ids.split('\n');
    let queued = false;

    const update = () => {
      queued = false;
      // Headings near the end of a page can never scroll up to the activation
      // line, so over the last viewport height of scroll (or the whole scroll,
      // on a shorter page) the line slides down to the bottom of the viewport,
      // passing each remaining heading in order.
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const remaining = maxScroll - window.scrollY;
      const slide = Math.min(maxScroll, window.innerHeight - ACTIVATION_LINE);
      const progress = slide > 0 ? Math.max(0, 1 - remaining / slide) : 0;
      const line =
        ACTIVATION_LINE + (window.innerHeight - ACTIVATION_LINE) * progress;
      let current = list[0];
      for (const id of list) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top > line) break;
        current = id;
      }
      // Once the page bottoms out, several sections share the screen; the one
      // the reader jumped to wins.
      const target = fragmentTarget();
      if (
        remaining < 1 &&
        target &&
        list.includes(target.id) &&
        target.getBoundingClientRect().top >= 0
      ) {
        current = target.id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hashchange', onScroll);
    };
  }, [ids]);

  if (items.length === 0) return null;

  return (
    <aside className="sticky top-20 ml-8 hidden h-[calc(100vh-6.5rem)] w-58 shrink-0 overflow-x-hidden overflow-y-auto overscroll-contain xl:block">
      <div className="text-ink-muted mb-2 text-[11px] font-semibold tracking-[0.07em] uppercase">
        On this page
      </div>
      <ul className="border-hairline border-l">
        {items.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              title={heading.title}
              className={clsx(
                '-ml-px block truncate border-l py-1 pr-1 text-[13px] leading-snug transition-colors',
                heading.level === 3 ? 'pl-6' : 'pl-3',
                active === heading.id
                  ? 'border-link text-link font-medium'
                  : 'text-ink-secondary hover:text-ink border-transparent'
              )}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}

// The element the URL fragment names, or null when there is none. A hand-typed
// fragment can be malformed percent-encoding, which names nothing.
function fragmentTarget(): HTMLElement | null {
  try {
    return document.getElementById(decodeURIComponent(location.hash.slice(1)));
  } catch {
    return null;
  }
}
