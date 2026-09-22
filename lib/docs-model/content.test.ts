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
  listVersions,
  listPages,
  readPageSources,
  listPageParams,
  readNavigationYaml,
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

  // A directory with overlays but no index.md is a page in those languages only.
  const datastorm = bySlug['services/datastorm'];
  assert.equal(datastorm.shared, undefined);
  assert.deepEqual(Object.keys(datastorm.overlays).sort(), ['cpp', 'java']);
});

test('readPageSources returns shared and overlay presence correctly', () => {
  const enums = readPageSources(ROOT, '3.8', 'cpp', 'slice/enumerations');
  assert.ok(enums.shared && enums.overlay);
  const gs = readPageSources(ROOT, '3.8', 'python', 'get-started');
  assert.ok(gs.shared);
  assert.equal(gs.overlay, null); // shared-only page, no overlay
  // A chapter's own page, and the front page at the root.
  assert.match(readPageSources(ROOT, '3.8', 'cpp', 'slice').shared!, /Slice/);
  assert.match(readPageSources(ROOT, '3.8', 'cpp', '').shared!, /front page/);
});

test('listPageParams enumerates version x language x slug, respecting availability', () => {
  const params = listPageParams(ROOT, { '3.8': ['cpp', 'python'] });
  const has = (language: string, slug: string) =>
    params.some(
      (p) => p.version === '3.8' && p.language === language && p.slug === slug
    );

  assert.ok(has('cpp', 'slice/enumerations'));
  assert.ok(has('python', 'get-started'));
  assert.ok(has('python', '')); // the front page, in every language
  // datastorm exists only for cpp + java; with [cpp, python] requested it appears
  // for cpp but not python (availability filtering).
  assert.ok(has('cpp', 'services/datastorm'));
  assert.ok(!has('python', 'services/datastorm'));
  // never emit a param outside the requested language set
  assert.ok(
    params.every((p) => p.language === 'cpp' || p.language === 'python')
  );
});

test('snippetReader resolves example files relative to the version dir', () => {
  const read = snippetReader(ROOT, '3.8');
  assert.match(read('examples/cpp/sample.cpp'), /<use>/);
});

test('readNavigationYaml returns the navigation text', () => {
  const yaml = readNavigationYaml(ROOT, '3.8');
  assert.ok(yaml && yaml.includes('languages'));
});

test('listPages scopes language-only pages to the language being rendered', () => {
  // The fixture's `datastorm` page exists only as cpp and java overlays.
  const has = (language: string, slug: string) =>
    listPages(ROOT, '3.8', language).some((p) => p.slug === slug);

  assert.ok(has('cpp', 'services/datastorm'));
  assert.ok(!has('python', 'services/datastorm')); // would otherwise link to a URL that is never built
  // A shared page belongs to every language.
  assert.ok(has('python', 'slice/enumerations'));
});
