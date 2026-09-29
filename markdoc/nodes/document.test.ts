// Copyright (c) ZeroC, Inc.
//
// Run with: node --import ./scripts/markdoc-esm-hooks.js --test markdoc/nodes/document.test.ts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Tag } from '@markdoc/markdoc';

import { qualifyRepeatedIds } from './document.markdoc.ts';

const heading = (level: number, id: string, langs?: string[]) => ({
  tag: new Tag('Heading', { level, id }),
  langs
});

const ids = (headings: { tag: Tag }[]) =>
  headings.map(({ tag }) => tag.attributes.id as string);

test('a repeated heading takes its parent heading anchor as a prefix', () => {
  const headings = [
    heading(2, 'ice.default.host'),
    heading(3, 'synopsis'),
    heading(3, 'platform-notes'),
    heading(4, 'openssl'),
    heading(2, 'ice.default.router'),
    heading(3, 'synopsis'),
    heading(3, 'platform-notes'),
    heading(4, 'openssl')
  ];

  qualifyRepeatedIds(headings, ['cpp', 'java']);

  assert.deepEqual(ids(headings), [
    'ice.default.host',
    'ice.default.host-synopsis',
    'ice.default.host-platform-notes',
    'ice.default.host-platform-notes-openssl',
    'ice.default.router',
    'ice.default.router-synopsis',
    'ice.default.router-platform-notes',
    'ice.default.router-platform-notes-openssl'
  ]);
});

test('headings no reader sees together keep their anchors', () => {
  const headings = [
    heading(2, 'language-mapping'),
    heading(3, 'generated-constructors', ['cpp']),
    heading(3, 'generated-constructors', ['java'])
  ];

  qualifyRepeatedIds(headings, ['cpp', 'java']);

  assert.deepEqual(ids(headings), [
    'language-mapping',
    'generated-constructors',
    'generated-constructors'
  ]);
});

test('a heading nests under the nearest heading all of its readers see', () => {
  const headings = [
    heading(2, 'optional-fields'),
    heading(2, 'language-mapping'),
    heading(2, 'java-notes', ['java']),
    heading(3, 'optional-fields', ['cpp'])
  ];

  qualifyRepeatedIds(headings, ['cpp', 'java']);

  assert.deepEqual(ids(headings), [
    'optional-fields',
    'language-mapping',
    'java-notes',
    'language-mapping-optional-fields'
  ]);
});
