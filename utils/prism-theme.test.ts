// Copyright (c) ZeroC, Inc.
//
// Run with: node utils/prism-theme.test.ts
//
// The code-block palettes are the one place in the site where a colour choice
// can quietly make text unreadable — the previous dark theme put grey comments
// on a near-black block, and the block itself was 1.11:1 against the page, so it
// had no visible edge. These are the guarantees that replaced eyeballing it.

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { CODE_PALETTE, CONTRAST_FLOOR, iceCodeTheme } from './prism-theme.ts';

function channels(hex: string): [number, number, number] {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)) as [number, number, number];
}

/** WCAG relative luminance. */
function luminance(hex: string): number {
  const [r, g, b] = channels(hex).map((value) => {
    const c = value / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** WCAG contrast ratio between two colours, 1:1 (identical) to 21:1. */
export function contrast(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

test('contrast is computed correctly', () => {
  assert.equal(Math.round(contrast('#ffffff', '#000000')), 21);
  assert.equal(Math.round(contrast('#ffffff', '#ffffff')), 1);
});

for (const mode of ['light', 'dark'] as const) {
  test(`${mode}: every token colour clears ${CONTRAST_FLOOR[mode]}:1 against the code surface`, () => {
    const palette = CODE_PALETTE[mode];
    const floor = CONTRAST_FLOOR[mode];
    const chrome = new Set(['bg', 'page', 'headerBg', 'headerFg', 'lineNumber']);
    for (const [role, colour] of Object.entries(palette)) {
      if (chrome.has(role)) continue;
      const ratio = contrast(colour, palette.bg);
      assert.ok(
        ratio >= floor,
        `${mode} "${role}" (${colour}) is ${ratio.toFixed(2)}:1 on ${palette.bg}, below ${floor}:1`
      );
    }
  });

  test(`${mode}: the block's own chrome is readable`, () => {
    const { headerBg, headerFg, lineNumber, bg } = CODE_PALETTE[mode];
    // The filename/language strip and the line numbers are text too — the old
    // theme drew both in white, which vanished on a light header.
    assert.ok(contrast(headerFg, headerBg) >= 4.5, `header text is ${contrast(headerFg, headerBg).toFixed(2)}:1`);
    assert.ok(contrast(lineNumber, bg) >= 4.5, `line numbers are ${contrast(lineNumber, bg).toFixed(2)}:1`);
  });

  test(`${mode}: the code surface is distinguishable from the page`, () => {
    const { bg, page } = CODE_PALETTE[mode];
    assert.notEqual(bg.toLowerCase(), page.toLowerCase());
    // The surface is deliberately close to the page — Qt's is 1.1:1 — so the
    // 1px border does the separating. What must not happen is the two being
    // literally the same colour, which leaves the block with no edge at all.
    const ratio = contrast(bg, page);
    assert.ok(ratio >= 1.05, `${mode} surface ${bg} is only ${ratio.toFixed(2)}:1 against ${page}`);
  });
}

test('the light surface is light and the dark surface is dark', () => {
  // The complaint that started this: a black code block on a white page.
  assert.ok(luminance(CODE_PALETTE.light.bg) > 0.7, 'light-mode code blocks must be a light surface');
  assert.ok(luminance(CODE_PALETTE.dark.bg) < 0.1, 'dark-mode code blocks must be a dark surface');
});

test('every palette role is wired to a CSS custom property in the theme', () => {
  const used = new Set<string>();
  const collect = (value?: string) => {
    const match = value && /^var\(--code-([a-z-]+)\)$/.exec(value);
    if (match) used.add(match[1]);
  };
  collect(iceCodeTheme.plain.color as string);
  collect(iceCodeTheme.plain.backgroundColor as string);
  for (const entry of iceCodeTheme.styles) collect(entry.style.color as string);

  // The chrome roles are applied by the component's own classes, not by Prism.
  const chrome = new Set(['page', 'headerBg', 'headerFg', 'lineNumber']);
  for (const role of Object.keys(CODE_PALETTE.light)) {
    if (chrome.has(role)) continue;
    assert.ok(used.has(role), `--code-${role} is defined but no token type uses it`);
  }
});
