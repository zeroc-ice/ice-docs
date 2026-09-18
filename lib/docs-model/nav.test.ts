// Copyright (c) ZeroC, Inc.
//
// Run with: node lib/docs-model/nav.test.ts

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  MANUAL_TITLE,
  breadcrumbs,
  buildSideNav,
  activeTrailKeys,
  containsActive,
  counterpartSlug,
  languageLabel,
  navigationSlugs,
  prevNext,
  sideNavKey,
  trailTo,
  versionSwitchTarget,
  type NavDoc,
  type NavNode
} from './nav.ts';

const SIDEBAR: NavNode[] = [
  { title: 'Get Started', page: 'get-started' },
  {
    title: 'The Slice Language',
    page: 'the-slice-language',
    items: [
      { title: 'Basic Types', page: 'basic-types' },
      {
        title: 'User-Defined Types',
        page: 'user-defined-types',
        items: [
          { title: 'Enumerations', page: 'enumerations' },
          { title: 'Sequences', page: 'sequences' }
        ]
      }
    ]
  },
  {
    title: 'Plugins',
    items: [
      { title: 'Plug-in API', page: 'cpp-plug-in-api', language: 'cpp' },
      { title: 'Plug-in API', page: 'python-plug-in-api', language: 'python' },
      { title: 'Installing a Plug-in', page: 'installing-a-plug-in' }
    ]
  }
];

const NAV: NavDoc = {
  version: '3.8',
  languages: ['cpp', 'python'],
  landing: 'get-started',
  sidebar: SIDEBAR
};

const opts = {
  version: '3.8',
  language: 'cpp',
  currentSlug: 'enumerations',
  isAvailable: () => true
};

test('buildSideNav resolves the tree with hrefs and active flags', () => {
  const tree = buildSideNav(SIDEBAR, opts);
  assert.equal(tree[0].href, '/ice/3.8/cpp/get-started');
  const slice = tree[1];
  assert.equal(slice.title, 'The Slice Language');
  // Overview, then the chapter's own children.
  assert.equal(slice.items.length, 3);
  const udt = slice.items[2];
  assert.equal(udt.title, 'User-Defined Types');
  assert.equal(udt.items[1].active, true); // current page
  assert.equal(udt.items[1].href, '/ice/3.8/cpp/enumerations');
});

test('a group that has a page of its own becomes a toggle, with the page as Overview', () => {
  // Otherwise one row has to answer two gestures — navigate, and open — and the
  // title cannot be the thing you click to expand.
  const [, slice] = buildSideNav(SIDEBAR, opts);
  assert.equal(slice.href, undefined, 'the group row itself does not navigate');
  assert.equal(slice.items[0].title, 'Overview');
  assert.equal(slice.items[0].href, '/ice/3.8/cpp/the-slice-language');
});

test("standing on a group's own page marks Overview, not the group row", () => {
  const [, slice] = buildSideNav(SIDEBAR, {
    ...opts,
    currentSlug: 'the-slice-language'
  });
  assert.equal(slice.active, false);
  assert.equal(slice.items[0].active, true);
  // The group still opens on its own, because it holds the active page.
  assert.equal(containsActive(slice), true);
});

test('a group with no page of its own is unchanged', () => {
  const [, , plugins] = buildSideNav(SIDEBAR, { ...opts, currentSlug: '' });
  assert.equal(plugins.href, undefined);
  assert.equal(plugins.items[0].title, 'Plug-in API');
});

test('buildSideNav keeps unavailable pages but without an href', () => {
  const tree = buildSideNav(SIDEBAR, {
    ...opts,
    currentSlug: '',
    isAvailable: (slug) => slug === 'enumerations'
  });
  const slice = tree[1];
  assert.equal(slice.href, undefined); // group page missing -> not linkable
  const udt = slice.items[1]; // no Overview child when the group page is unavailable
  assert.equal(udt.items[0].href, '/ice/3.8/cpp/enumerations');
  assert.equal(udt.items[1].href, undefined); // unavailable, still present
});

test('buildSideNav shows a language-specific node only for its language', () => {
  const [, , cpp] = buildSideNav(SIDEBAR, { ...opts, currentSlug: '' });
  assert.deepEqual(
    cpp.items.map((n) => n.href),
    ['/ice/3.8/cpp/cpp-plug-in-api', '/ice/3.8/cpp/installing-a-plug-in']
  );

  const [, , py] = buildSideNav(SIDEBAR, {
    ...opts,
    language: 'python',
    currentSlug: ''
  });
  assert.deepEqual(
    py.items.map((n) => n.href),
    [
      '/ice/3.8/python/python-plug-in-api',
      '/ice/3.8/python/installing-a-plug-in'
    ]
  );
});

test('containsActive reports the branch holding the current page', () => {
  const tree = buildSideNav(SIDEBAR, opts);
  assert.equal(containsActive(tree[1]), true); // The Slice Language contains it
  assert.equal(containsActive(tree[0]), false); // Get Started does not
});

test('trailTo returns every ancestor down to the page, or null', () => {
  assert.deepEqual(
    trailTo(SIDEBAR, 'enumerations')?.map((n) => n.title),
    ['The Slice Language', 'User-Defined Types', 'Enumerations']
  );
  assert.deepEqual(
    trailTo(SIDEBAR, 'get-started')?.map((n) => n.title),
    ['Get Started']
  );
  assert.equal(trailTo(SIDEBAR, 'not-a-page'), null);
});

test('counterpartSlug finds the same page written for another language', () => {
  // The C++ plug-in API page's counterpart for a Python reader is the Python
  // page beside it; a language switch should land there, not on the front page.
  assert.equal(
    counterpartSlug(SIDEBAR, 'cpp-plug-in-api', 'python'),
    'python-plug-in-api'
  );
  // No Java page sits beside it, and a shared page has no counterpart to find.
  assert.equal(counterpartSlug(SIDEBAR, 'cpp-plug-in-api', 'java'), undefined);
  assert.equal(counterpartSlug(SIDEBAR, 'cpp-plug-in-api', 'cpp'), undefined);
  assert.equal(counterpartSlug(SIDEBAR, 'enumerations', 'python'), undefined);
  assert.equal(counterpartSlug(SIDEBAR, 'not-a-page', 'python'), undefined);
});

test('breadcrumbs trace manual -> chapter -> group -> page, and the page is not a link', () => {
  const crumbs = breadcrumbs(NAV, 'enumerations', {
    version: '3.8',
    language: 'cpp'
  });
  assert.deepEqual(
    crumbs.map((c) => c.title),
    [MANUAL_TITLE, 'The Slice Language', 'User-Defined Types', 'Enumerations']
  );
  assert.equal(crumbs[0].href, '/ice/3.8/cpp');
  assert.equal(crumbs[1].href, '/ice/3.8/cpp/the-slice-language');
  assert.equal(crumbs[2].href, '/ice/3.8/cpp/user-defined-types');
  assert.equal(crumbs[3].href, undefined); // current page
});

test('a group without a page of its own is a plain-text crumb', () => {
  const crumbs = breadcrumbs(NAV, 'installing-a-plug-in', {
    version: '3.8',
    language: 'cpp'
  });
  assert.deepEqual(crumbs[1], { title: 'Plugins' });
});

test('a page outside the tree gets no trail', () => {
  assert.deepEqual(
    breadcrumbs(NAV, 'orphan', { version: '3.8', language: 'cpp' }),
    []
  );
});

test('prevNext walks the whole manual in reading order, across chapters', () => {
  const { prev, next } = prevNext(SIDEBAR, 'enumerations', opts);
  assert.equal(prev?.title, 'User-Defined Types');
  assert.equal(next?.title, 'Sequences');
  assert.equal(next?.href, '/ice/3.8/cpp/sequences');

  // The last page of one chapter leads into the next chapter.
  const end = prevNext(SIDEBAR, 'sequences', opts);
  assert.equal(end.next?.title, 'Plug-in API');
  assert.equal(end.next?.href, '/ice/3.8/cpp/cpp-plug-in-api');
});

test('prevNext skips pages that do not exist in the current language', () => {
  const { next } = prevNext(SIDEBAR, 'enumerations', {
    ...opts,
    isAvailable: (slug) => slug !== 'sequences'
  });
  assert.equal(next?.title, 'Plug-in API'); // sequences is unavailable
});

test('prevNext never crosses into another language', () => {
  const { next } = prevNext(SIDEBAR, 'sequences', {
    ...opts,
    language: 'python'
  });
  assert.equal(next?.href, '/ice/3.8/python/python-plug-in-api');
});

test('navigationSlugs counts a landing page outside the tree as reachable', () => {
  assert.deepEqual(
    navigationSlugs({ landing: 'front-page', sidebar: SIDEBAR }).slice(0, 2),
    ['front-page', 'get-started']
  );
});

test('navigationSlugs lists every declared page in reading order', () => {
  assert.deepEqual(navigationSlugs(NAV), [
    'get-started',
    'the-slice-language',
    'basic-types',
    'user-defined-types',
    'enumerations',
    'sequences',
    'cpp-plug-in-api',
    'python-plug-in-api',
    'installing-a-plug-in'
  ]);
});

test('languageLabel maps slugs to display names, falling back to the slug', () => {
  assert.equal(languageLabel('cpp'), 'C++');
  assert.equal(languageLabel('csharp'), 'C#');
  assert.equal(languageLabel('js'), 'JavaScript');
  assert.equal(languageLabel('unknown'), 'unknown');
});

test('versionSwitchTarget keeps language + page when available', () => {
  const href = versionSwitchTarget({
    targetVersion: '3.7',
    targetLanguages: ['cpp', 'python'],
    currentLanguage: 'python',
    slug: 'enumerations',
    pageExists: () => true
  });
  assert.equal(href, '/ice/3.7/python/enumerations');
});

test('versionSwitchTarget falls back on language then on landing', () => {
  // java is not in the target version -> first target language (cpp)
  const lang = versionSwitchTarget({
    targetVersion: '3.7',
    targetLanguages: ['cpp', 'python'],
    currentLanguage: 'java',
    slug: 'enumerations',
    pageExists: (l, s) => l === 'cpp' && s === 'enumerations'
  });
  assert.equal(lang, '/ice/3.7/cpp/enumerations');

  // page missing in the target version -> landing
  const missing = versionSwitchTarget({
    targetVersion: '3.7',
    targetLanguages: ['cpp', 'python'],
    currentLanguage: 'cpp',
    slug: 'communicator',
    pageExists: () => false
  });
  assert.equal(missing, '/ice/3.7/cpp');
});

test('activeTrailKeys names every group down to the current page, and nothing else', () => {
  const tree = buildSideNav(SIDEBAR, opts); // current page: enumerations
  assert.deepEqual(activeTrailKeys(tree), [
    sideNavKey(['The Slice Language']),
    sideNavKey(['The Slice Language', 'User-Defined Types'])
  ]);
});

test('activeTrailKeys is empty when the current page is a top-level leaf', () => {
  const tree = buildSideNav(SIDEBAR, { ...opts, currentSlug: 'get-started' });
  assert.deepEqual(activeTrailKeys(tree), []);
});

test('activeTrailKeys keys a group by its href when it has one, like the sidebar does', () => {
  // The Slice Language has a page of its own, so the sidebar turns it into a
  // toggle whose row is keyed by title; a group keyed by href would never match.
  const tree = buildSideNav(SIDEBAR, opts);
  assert.equal(tree[1].href, undefined);
  assert.equal(activeTrailKeys(tree)[0], sideNavKey([tree[1].title]));
});

test('group keys are path-based, so equal titles under different parents differ', () => {
  assert.notEqual(sideNavKey(['Slice']), sideNavKey(['Greeter Example']));
  assert.notEqual(
    sideNavKey(['Slice', 'Interfaces']),
    sideNavKey(['The Ice Runtime', 'Interfaces'])
  );
});
