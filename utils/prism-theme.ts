// Copyright (c) ZeroC, Inc.
//
// The code-block colour scheme.
//
// Every colour is a CSS custom property defined in app/globals.css, with the
// dark values under `.dark`. Prism only ever puts these strings into inline
// `style` attributes, so `var(--code-…)` works — and it means one render serves
// both themes: no waiting for hydration to learn which one to use, and no flash
// of the wrong palette.
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

import type { PrismTheme } from 'prism-react-renderer';

const v = (name: string) => `var(--code-${name})`;

export const iceCodeTheme: PrismTheme = {
  plain: {
    color: v('plain'),
    backgroundColor: v('bg')
  },
  styles: [
    {
      types: ['comment', 'prolog', 'doctype', 'cdata'],
      style: { color: v('comment'), fontStyle: 'italic' }
    },
    { types: ['punctuation', 'operator', 'entity'], style: { color: v('punctuation') } },
    {
      types: ['keyword', 'atrule', 'rule', 'important', 'selector'],
      style: { color: v('keyword') }
    },
    {
      types: ['string', 'char', 'attr-value', 'regex', 'url'],
      style: { color: v('string') }
    },
    {
      types: ['number', 'boolean', 'constant', 'symbol', 'variable'],
      style: { color: v('number') }
    },
    { types: ['function', 'method', 'function-name'], style: { color: v('function') } },
    {
      types: ['class-name', 'builtin', 'tag', 'namespace', 'annotation', 'type-args'],
      style: { color: v('type') }
    },
    { types: ['attr-name', 'property', 'key'], style: { color: v('property') } },
    { types: ['inserted'], style: { color: v('inserted') } },
    { types: ['deleted'], style: { color: v('deleted') } }
  ]
};

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
    lineNumber: '#666f7b',
    plain: '#1f2328',
    comment: '#5a6570',
    punctuation: '#1f2328',
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
    lineNumber: '#9aa9c0',
    plain: '#e9effb',
    comment: '#b3c0d4',
    punctuation: '#e9effb',
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
