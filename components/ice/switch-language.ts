// Copyright (c) ZeroC, Inc.

import { setLanguage } from '@/context/state';

/** Whether `el` shows to readers of `language`, judged from its markup. */
function shownIn(el: Element, language: string, root: Element) {
  for (
    let block = el.closest('[data-langs]');
    block && root.contains(block);
    block = block.parentElement?.closest('[data-langs]') ?? null
  ) {
    if (!block.getAttribute('data-langs')!.split(' ').includes(language))
      return false;
  }
  return true;
}

/**
 * The block of `parent` that the reader is at: the first one, in reading order,
 * that reaches below `line`. A language block shown in place adds no box, so its
 * own blocks count instead. So do the blocks of one holding language blocks,
 * which move its content without moving its top, unless the switch to
 * `language` hides the one the reader is at; the outer block then stays put.
 */
function blockAtLine(
  parent: Element,
  line: number,
  language: string
): Element | undefined {
  for (const child of parent.children) {
    if (getComputedStyle(child).display === 'contents') {
      const inner = blockAtLine(child, line, language);
      if (inner) return inner;
    } else if (
      child.getClientRects().length > 0 &&
      child.getBoundingClientRect().bottom > line
    ) {
      if (!child.querySelector('div[data-langs]')) return child;
      const inner = blockAtLine(child, line, language);
      return inner && shownIn(inner, language, child) ? inner : child;
    }
  }
  return undefined;
}

const precedes = (a: Node, b: Node) =>
  (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) !== 0;

/**
 * Where to take a reader whose block the switch to `language` hides: the same
 * heading in the new language's copy of the section, else the last heading
 * shown before the language blocks that hold the old one. A section written
 * per language puts every language's answer in consecutive blocks, so that
 * heading is the one introducing the new language's answer.
 */
function headingFor(
  body: Element,
  block: Element,
  oldLanguage: string,
  language: string
): HTMLElement | undefined {
  const headings = [
    ...body.querySelectorAll<HTMLElement>(':is(h2, h3, h4, h5, h6)[id]')
  ];

  let hidden = block;
  for (let el = block.parentElement; el && el !== body; el = el.parentElement) {
    if (!shownIn(el, language, body)) hidden = el;
  }

  // Headings repeat their id in each language's copy of a section.
  const section = headings.findLast(
    (h) => (h === block || precedes(h, block)) && shownIn(h, oldLanguage, body)
  );
  if (section && hidden.contains(section)) {
    const copies = headings.filter(
      (h) => h.id === section.id && shownIn(h, language, body)
    );
    const before = copies.findLast((h) => precedes(h, section));
    const after = copies.find((h) => precedes(section, h));
    if (before || after) {
      const distance = (h: HTMLElement | undefined) =>
        h
          ? Math.abs(headings.indexOf(h) - headings.indexOf(section))
          : Infinity;
      return distance(before) <= distance(after) ? before : after;
    }
  }

  let first = hidden;
  while (first.previousElementSibling?.hasAttribute('data-langs'))
    first = first.previousElementSibling;
  return headings.findLast(
    (h) => precedes(h, first) && shownIn(h, language, body)
  );
}

/**
 * Show the page in `language`, keeping the reader on the same topic. Every
 * mapping is in the page, and the blocks of other mappings above the viewport
 * change height with the switch, so the scroll offset alone would land the
 * reader in another section. A block shown in both mappings stays where it
 * was; a reader inside the old mapping's own text goes to the start of the new
 * mapping's text for the same section, or to the top of a page with no such
 * heading.
 */
export function switchLanguage(language: string) {
  const oldLanguage = document.documentElement.dataset.lang ?? '';
  const body = document.querySelector('.doc-body');
  if (!body || language === oldLanguage) {
    setLanguage(language);
    return;
  }

  // The line a jump to a heading leaves it at, below the sticky header.
  const firstHeading = body.querySelector(':is(h2, h3, h4, h5, h6)[id]');
  const line = firstHeading
    ? parseFloat(getComputedStyle(firstHeading).scrollMarginTop) || 0
    : 0;
  // Above the body, the title and the notices stay where they are as long as
  // the scroll offset does. A body with nothing on show for the old mapping
  // leaves only them, so the new mapping's body is read from the top.
  const wasEmpty = !blockAtLine(body, -Infinity, language);
  const block =
    body.getBoundingClientRect().top < line
      ? blockAtLine(body, line, language)
      : undefined;
  const top = block?.getBoundingClientRect().top;
  setLanguage(language);
  if (wasEmpty && blockAtLine(body, -Infinity, language)) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }
  if (!block || top === undefined) return;

  if (shownIn(block, language, body)) {
    window.scrollBy({
      top: block.getBoundingClientRect().top - top,
      behavior: 'instant'
    });
    return;
  }
  const heading = headingFor(body, block, oldLanguage, language);
  if (heading) heading.scrollIntoView({ block: 'start', behavior: 'instant' });
  else window.scrollTo({ top: 0, behavior: 'instant' });
}
