// Copyright (c) ZeroC, Inc.
//
// Run with: node lib/docs-model/content.test.ts
// Uses a dedicated fixture under __fixtures__ so it is independent of the
// (large, evolving) migrated content in content/3.8.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  listVersions,
  listSlugs,
  readPageSources,
  pageLanguages,
  listPageParams,
  readNavigationYaml,
  snippetReader,
  listPageEntries,
} from './content.ts';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '__fixtures__', 'content');

test('listVersions finds 3.8 and ignores non-version dirs', () => {
  const versions = listVersions(ROOT);
  assert.ok(versions.includes('3.8'));
  assert.ok(!versions.includes('slice'));
});

test('listSlugs unions shared pages and language overlays', () => {
  const slugs = listSlugs(ROOT, '3.8');
  assert.ok(slugs.includes('get-started'));
  assert.ok(slugs.includes('enumerations'));
});

test('readPageSources returns shared and overlay presence correctly', () => {
  const enums = readPageSources(ROOT, '3.8', 'cpp', 'enumerations');
  assert.ok(enums.shared && enums.overlay);
  const gs = readPageSources(ROOT, '3.8', 'python', 'get-started');
  assert.ok(gs.shared);
  assert.equal(gs.overlay, null); // shared-only page, no overlay
});

test('pageLanguages: a shared page is available in every configured language', () => {
  assert.deepEqual(pageLanguages(ROOT, '3.8', 'get-started', ['cpp', 'python']), ['cpp', 'python']);
});

test('listPageParams enumerates version x language x slug, respecting availability', () => {
  const params = listPageParams(ROOT, { '3.8': ['cpp', 'python'] });
  const has = (language: string, slug: string) =>
    params.some((p) => p.version === '3.8' && p.language === language && p.slug === slug);

  assert.ok(has('cpp', 'enumerations'));
  assert.ok(has('python', 'get-started'));
  // datastorm exists only for cpp + java; with [cpp, python] requested it appears
  // for cpp but not python (availability filtering).
  assert.ok(has('cpp', 'datastorm'));
  assert.ok(!has('python', 'datastorm'));
  // never emit a param outside the requested language set
  assert.ok(params.every((p) => p.language === 'cpp' || p.language === 'python'));
});

test('snippetReader resolves example files relative to the version dir', () => {
  const read = snippetReader(ROOT, '3.8');
  assert.match(read('examples/cpp/sample.cpp'), /<use>/);
});

test('readNavigationYaml returns the navigation text', () => {
  const yaml = readNavigationYaml(ROOT, '3.8');
  assert.ok(yaml && yaml.includes('languages'));
});

test('listPageEntries carries each page id, for links that name a page by id', () => {
  const entries = listPageEntries(ROOT, '3.8');
  const enums = entries.find((e) => e.path === 'enumerations');
  assert.equal(enums?.id, 'enumerations');
});

test('listPageEntries scopes language-only pages to the language being rendered', () => {
  // The fixture's `datastorm` page exists only as cpp and java overlays.
  const has = (language, slug) =>
    listPageEntries(ROOT, '3.8', language).some((e) => e.path === slug);

  assert.ok(has('cpp', 'datastorm'));
  assert.ok(!has('python', 'datastorm')); // would otherwise link to a URL that is never built
  // A shared page belongs to every language.
  assert.ok(has('python', 'enumerations'));
  // Without a language, every page in the version is listed.
  assert.ok(listPageEntries(ROOT, '3.8').some((e) => e.path === 'datastorm'));
});
