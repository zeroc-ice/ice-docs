// Copyright (c) ZeroC, Inc.
'use client';

import { Fragment, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';

import { fragmentId, visibleTarget } from '@/components/ice/AnchorScroll';
import { useLanguage } from '@/context/state';

export interface OutlineHeading {
  id: string;
  title: string;
  level: number;
  /** The language mappings the heading belongs to; every mapping when absent. */
  langs?: string[];
}

// Above this many headings in a mapping, the outline shows that mapping's
// top-level headings only. Reference pages in this manual can carry sixty
// headings; listing all of them turns the rail into a second, worse sidebar
// that hides where the reader actually is.
const DENSE_THRESHOLD = 24;

// Lets a dotted property name wrap after a dot rather than mid-segment.
function withDotBreaks(title: string) {
  return title.split('.').map((part, i, parts) =>
    i < parts.length - 1 ? (
      <Fragment key={i}>
        {part}.<wbr />
      </Fragment>
    ) : (
      part
    )
  );
}

// "On this page", with the current section marked. Titles wrap within the fixed
// width, so a long heading never widens the rail. Every mapping's headings are
// listed and the stylesheet shows the reader's, so the outline is right before
// any script runs.
export function PageOutline({
  headings,
  languages,
  writtenFor
}: {
  headings: OutlineHeading[];
  languages: string[];
  /** The languages the page is written for; every language when absent. */
  writtenFor?: string[];
}) {
  const dense = languages.filter(
    (language) =>
      headings.filter((h) => !h.langs || h.langs.includes(language)).length >
      DENSE_THRESHOLD
  );
  const items = headings.flatMap((h) => {
    if (h.level === 2 || dense.length === 0) return [h];
    const langs = (h.langs ?? languages).filter((l) => !dense.includes(l));
    return langs.length > 0 ? [{ ...h, langs }] : [];
  });

  const [active, setActive] = useState<string | null>(items[0]?.id ?? null);

  // The spy walks the reader's outline: each heading on show for their
  // mapping, once, in page order. A string rather than an array, so marking a
  // new section active does not hand the effect a fresh identity and make it
  // re-subscribe every tick. A mapping switch re-runs it even when the ids
  // match, since the headings move.
  const language = useLanguage();
  const ids = [
    ...new Set(
      items
        .filter((item) => !item.langs || item.langs.includes(language))
        .map((item) => item.id)
    )
  ].join('\n');

  // A jump to any heading too near the end of the page to pass under the bars
  // lands at the bottom, so there the heading last jumped to decides which one
  // is active, until the reader scrolls up from the bottom. It outlives the
  // effect, which a mapping switch re-runs, along with the fragment last seen.
  const jump = useRef({ id: '', hash: '' });

  useEffect(() => {
    if (!ids) return;
    const list = ids.split('\n');
    let queued = false;
    let lastScrollY = window.scrollY;

    const update = () => {
      queued = false;
      const headings = list.flatMap((id) => visibleTarget(id) ?? []);
      if (headings.length === 0) return;
      const { innerHeight, scrollY } = window;
      const maxScroll = document.documentElement.scrollHeight - innerHeight;
      const tops = headings.map(
        (heading) => heading.getBoundingClientRect().top
      );

      // A new fragment, such as the one the page was opened at, is a jump too.
      if (location.hash !== jump.current.hash) {
        jump.current = { id: fragmentId(location.hash), hash: location.hash };
      }
      const atBottom = scrollY >= maxScroll - 1;
      if (scrollY < lastScrollY && !atBottom) jump.current.id = '';
      lastScrollY = scrollY;

      // The scroll position at which each heading passes under the bars: a
      // pixel past where a jump to it leaves it, at its scroll-margin-top.
      const margin = parseFloat(getComputedStyle(headings[0]).scrollMarginTop);
      const targets = tops.map((top) => top + scrollY - margin + 1);

      // Headings too near the end of the page never pass under the bars, so
      // their targets are squeezed into the scroll left after the last one
      // that does. They then activate in order by the bottom of the page.
      const lastReachable =
        targets.findLast((target) => target <= maxScroll) ?? 0;
      const last = targets[targets.length - 1];
      const squeeze =
        last > maxScroll && maxScroll > lastReachable
          ? (maxScroll - lastReachable) / (last - lastReachable)
          : 1;
      const squeezed = targets.map((target) =>
        target > lastReachable
          ? lastReachable + (target - lastReachable) * squeeze
          : target
      );

      // The active heading is the last one passed, or the next one once it's
      // in the top half of the viewport.
      let current = squeezed.findLastIndex((target) => target <= scrollY);
      if (tops[current + 1] < innerHeight / 2) current++;

      // At the bottom of the page the last heading is active, unless the
      // reader jumped to another one whose jump lands there too, within the
      // same pixel that counts as the bottom.
      if (atBottom) {
        const jumped = headings.findIndex(
          (heading) => heading.id === jump.current.id
        );
        current =
          jumped !== -1 && targets[jumped] > maxScroll - 1
            ? jumped
            : headings.length - 1;
      }

      setActive(headings[Math.max(current, 0)].id);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(update);
    };

    // A jump that doesn't scroll, because the page is already at the bottom,
    // still has to update the active heading.
    const onHashChange = () => {
      jump.current = { id: fragmentId(location.hash), hash: location.hash };
      onScroll();
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('hashchange', onHashChange);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('hashchange', onHashChange);
    };
  }, [ids, language]);

  if (items.length === 0) return null;

  return (
    <aside
      data-langs={writtenFor?.join(' ')}
      className="sticky top-20 ml-8 hidden h-[calc(100vh-6.5rem)] w-58 shrink-0 overflow-x-hidden overflow-y-auto overscroll-contain xl:block"
    >
      <div className="mb-2 text-[11px] font-semibold tracking-[0.07em] text-ink-muted uppercase">
        On this page
      </div>
      <ul className="border-l border-hairline">
        {items.map((heading, i) => (
          <li key={`${heading.id}-${i}`} data-langs={heading.langs?.join(' ')}>
            <a
              href={`#${heading.id}`}
              className={clsx(
                '-ml-px block border-l py-1 pr-1 text-[13px] leading-snug wrap-anywhere transition-colors',
                heading.level === 3 ? 'pl-6' : 'pl-3',
                active === heading.id
                  ? 'border-link text-link'
                  : 'border-transparent text-ink-secondary hover:text-ink'
              )}
            >
              {withDotBreaks(heading.title)}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
