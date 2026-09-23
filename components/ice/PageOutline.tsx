// Copyright (c) ZeroC, Inc.
'use client';

import { Fragment, useEffect, useState } from 'react';
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

// Distance from the top of the viewport at which a heading counts as "the one
// being read" — just under the two sticky bars.
const ACTIVATION_LINE = 132;

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
        const element = visibleTarget(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top > line) break;
        current = id;
      }
      // Once the page bottoms out, several sections share the screen; the one
      // the reader jumped to wins.
      const target = visibleTarget(fragmentId(location.hash));
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
  }, [ids, language]);

  if (items.length === 0) return null;

  return (
    <aside
      data-langs={writtenFor?.join(' ')}
      className="sticky top-20 ml-8 hidden h-[calc(100vh-6.5rem)] w-58 shrink-0 overflow-x-hidden overflow-y-auto overscroll-contain xl:block"
    >
      <div className="text-ink-muted mb-2 text-[11px] font-semibold tracking-[0.07em] uppercase">
        On this page
      </div>
      <ul className="border-hairline border-l">
        {items.map((heading, i) => (
          <li key={`${heading.id}-${i}`} data-langs={heading.langs?.join(' ')}>
            <a
              href={`#${heading.id}`}
              className={clsx(
                '-ml-px block border-l py-1 pr-1 text-[13px] leading-snug wrap-anywhere transition-colors',
                heading.level === 3 ? 'pl-6' : 'pl-3',
                active === heading.id
                  ? 'border-link text-link'
                  : 'text-ink-secondary hover:text-ink border-transparent'
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
