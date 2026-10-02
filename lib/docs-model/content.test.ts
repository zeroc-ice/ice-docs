// Copyright (c) ZeroC, Inc.
//
// Run with: node lib/docs-model/content.test.ts
// Uses a dedicated fixture under __fixtures__ so it is independent of the
// (large, evolving) migrated content in content/ice/3.8.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  frontmatterOf,
  listVersions,
  listPages,
  readPageSources,
  readNavigation,
  snippetReader
} from './content.ts';

const ROOT = join(
  dirname(fileURLToPath(import.meta.url)),
  '__fixtures__',
  'content'
);

test('listVersions finds 3.8 and ignores non-version dirs', () => {
  const versions = listVersions(ROOT);
  assert.ok(versions.includes('3.8'));
  assert.ok(!versions.includes('slice'));
});

test('listPages reads a page and its overlays off its directory', () => {
  const pages = listPages(ROOT, '3.8');
  const bySlug = Object.fromEntries(pages.map((p) => [p.slug, p]));

  // A directory's path under the version is its page's slug, and its name the page's.
  const enums = bySlug['slice/enumerations'];
  assert.equal(enums.name, 'enumerations');
  assert.match(enums.shared!, /slice\/enumerations\/index\.md$/);
  assert.deepEqual(Object.keys(enums.overlays).sort(), ['cpp', 'python']);

  // A chapter is a page whose directory holds other pages.
  assert.equal(bySlug['slice'].name, 'slice');
  assert.equal(bySlug[''].name, ''); // the front page

  // A directory with overlays but no index.md is a page written per language.
  const datastorm = bySlug['services/datastorm'];
  assert.equal(datastorm.shared, undefined);
  assert.deepEqual(Object.keys(datastorm.overlays).sort(), ['cpp', 'java']);
});

test('readPageSources returns the shared text and every overlay', () => {
  const read = (slug: string) =>
    readPageSources(listPages(ROOT, '3.8').find((p) => p.slug === slug)!);
  const enums = read('slice/enumerations');
  assert.ok(enums.shared);
  assert.deepEqual(Object.keys(enums.overlays), ['cpp', 'python']);
  const gs = read('get-started');
  assert.ok(gs.shared);
  assert.deepEqual(gs.overlays, {}); // shared-only page, no overlay
  // A chapter's own page, and the front page at the root.
  assert.match(read('slice').shared!, /Slice/);
  assert.match(read('').shared!, /front page/);
});

test('a page written per language takes its frontmatter from its first overlay', () => {
  const datastorm = readPageSources(
    listPages(ROOT, '3.8').find((p) => p.slug === 'services/datastorm')!
  );
  assert.equal(datastorm.shared, null);
  assert.equal(datastorm.frontmatter.description, 'DataStorm for C++');
});

test('a file without frontmatter has none', () => {
  // An overlay of a shared page carries only its sections.
  assert.deepEqual(
    frontmatterOf(
      '{% language-section name="mapping" %}\n\nText.\n\n{% /language-section %}\n'
    ),
    {}
  );
});

test('readNavigation builds the tree from the pages each page lists, front page first', () => {
  const nav = readNavigation(ROOT, '3.8');
  assert.deepEqual(nav.languages, ['cpp', 'java', 'python']);
  assert.deepEqual(nav.sidebar, [
    { title: 'Documentation', slug: '', writtenFor: undefined, items: [] },
    {
      title: 'Get Started',
      slug: 'get-started',
      writtenFor: undefined,
      items: []
    },
    {
      title: 'The Slice Language',
      slug: 'slice',
      writtenFor: undefined,
      items: [
        {
          title: 'Enumerations',
          slug: 'slice/enumerations',
          writtenFor: undefined,
          items: []
        }
      ]
    },
    {
      title: 'Ice Services',
      slug: 'services',
      writtenFor: undefined,
      items: [
        {
          title: 'DataStorm',
          slug: 'services/datastorm',
          writtenFor: ['cpp', 'java'],
          items: []
        }
      ]
    }
  ]);
});

test('snippetReader resolves example files relative to the version dir', () => {
  const read = snippetReader(ROOT, '3.8');
  assert.match(read('examples/cpp/sample.cpp'), /<use>/);
});
