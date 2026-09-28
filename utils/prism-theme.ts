// Copyright (c) ZeroC, Inc.
//
// The code-block colour scheme.
//
// Every colour is a CSS custom property defined in app/globals.css, with the
// dark values under `.dark`, and a token's inline style names the one for its
// type (see `tokenStyle`), so the HTML highlighted at build time serves both
// themes.
//
// Two rules the palettes are built to, taken from measuring Qt's and Stripe's
// documentation:
//
//  1. In light mode the block is a *light* surface with a border (Qt), not a
//     black rectangle punched into a white page.
//  2. Every token colour stays in a tight, high-contrast band — Stripe keeps
//     theirs between 7.6:1 and 12.4:1 and uses no dim greys, which is why their
//     comments stay readable. Ours are ≥ 4.5:1 in light and ≥ 7:1 in dark, and
//     utils/prism-theme.test.ts fails the build if that ever stops being true.

/** The Prism token types drawn in each palette colour. */
export const TOKEN_TYPES: Record<string, string[]> = {
  comment: ['comment', 'prolog', 'doctype', 'cdata'],
  // Punctuation is drawn in the block's text colour.
  plain: ['punctuation', 'operator', 'entity'],
  keyword: ['keyword', 'atrule', 'rule', 'important', 'selector'],
  string: ['string', 'char', 'attr-value', 'regex', 'url'],
  number: ['number', 'boolean', 'constant', 'symbol', 'variable'],
  function: ['function', 'method', 'function-name'],
  type: [
    'class-name',
    'builtin',
    'tag',
    'namespace',
    'annotation',
    'type-args'
  ],
  property: ['attr-name', 'property', 'key'],
  inserted: ['inserted'],
  deleted: ['deleted']
};

const COLOUR_OF_TYPE = new Map(
  Object.entries(TOKEN_TYPES).flatMap(([colour, types]) =>
    types.map((type) => [type, colour])
  )
);

/**
 * The inline style of a token nested in Prism's `types`, outermost first, or ''
 * for one in the block's text colour. The innermost type with a colour decides
 * the colour, and a comment is italic, with everything inside it.
 */
export function tokenStyle(types: readonly string[]): string {
  const colours = types.flatMap((type) => COLOUR_OF_TYPE.get(type) ?? []);
  const colour = colours.at(-1) ?? 'plain';
  const italic = colours.includes('comment');
  if (colour === 'plain' && !italic) return '';
  return `color:var(--code-${colour})` + (italic ? ';font-style:italic' : '');
}

/**
 * The same palette as plain values, for the contrast test. Keep in step with the
 * `--code-*` properties in app/globals.css.
 */
export const CODE_PALETTE = {
  light: {
    page: '#ffffff',
    bg: '#f6f8fa',
    headerBg: '#eceff2',
    headerFg: '#47505a',
    plain: '#1f2328',
    comment: '#5a6570',
    keyword: '#a21a5c',
    string: '#0a5a2f',
    number: '#0550ae',
    function: '#6f42c1',
    type: '#8a4b00',
    property: '#0550ae',
    inserted: '#0a5a2f',
    deleted: '#b3261e'
  },
  dark: {
    page: '#1a1c21',
    bg: '#212a3d',
    headerBg: '#1a2233',
    headerFg: '#b3c0d4',
    plain: '#e9effb',
    comment: '#b3c0d4',
    keyword: '#b3d0ff',
    string: '#9ae6b0',
    number: '#8fdff5',
    function: '#dfc0ff',
    type: '#ffd79b',
    property: '#8fdff5',
    inserted: '#9ae6b0',
    deleted: '#ffabab'
  }
} as const;

/** Minimum contrast a token colour must have against the code surface. */
export const CONTRAST_FLOOR = { light: 4.5, dark: 7 } as const;
