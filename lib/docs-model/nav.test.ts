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
  languageLabel,
  navigationPages,
  prevNext,
  sideNavKey,
  trailTo,
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
      { title: 'C++ Plug-in API', page: 'cpp-plug-in-api' },
      { title: 'Installing a Plug-in', page: 'installing-a-plug-in' }
    ]
  }
];

const NAV: NavDoc = {
  version: '3.8',
  languages: ['cpp', 'python'],
  sidebar: SIDEBAR
};

// Where each page sits: the tree names pages by name, and their slugs follow
// the directories.
const SLUGS: Record<string, string> = {
  'get-started': 'get-started',
  'the-slice-language': 'slice',
  'basic-types': 'slice/basic-types',
  'user-defined-types': 'slice/user-defined-types',
  enumerations: 'slice/user-defined-types/enumerations',
  sequences: 'slice/user-defined-types/sequences',
  'cpp-plug-in-api': 'plugins/cpp-plug-in-api',
  'installing-a-plug-in': 'plugins/installing-a-plug-in'
};

const opts = {
  version: '3.8',
  currentPage: 'enumerations',
  slugOf: (page: string) => SLUGS[page],
  writtenFor: () => undefined
};

test('buildSideNav resolves the tree with hrefs and active flags', () => {
  const tree = buildSideNav(SIDEBAR, opts);
  assert.equal(tree[0].href, '/ice/3.8/get-started');
  const slice = tree[1];
  assert.equal(slice.title, 'The Slice Language');
  // Overview, then the chapter's own children.
  assert.equal(slice.items.length, 3);
  const udt = slice.items[2];
  assert.equal(udt.title, 'User-Defined Types');
  assert.equal(udt.items[1].active, true); // current page
  assert.equal(
    udt.items[1].href,
    '/ice/3.8/slice/user-defined-types/enumerations'
  );
});

test('a group that has a page of its own becomes a toggle, with the page as Overview', () => {
  // Otherwise one row has to answer two gestures — navigate, and open — and the
  // title cannot be the thing you click to expand.
  const [, slice] = buildSideNav(SIDEBAR, opts);
  assert.equal(slice.href, undefined, 'the group row itself does not navigate');
  assert.equal(slice.items[0].title, 'Overview');
  assert.equal(slice.items[0].href, '/ice/3.8/slice');
});

test("standing on a group's own page marks Overview, not the group row", () => {
  const [, slice] = buildSideNav(SIDEBAR, {
    ...opts,
    currentPage: 'the-slice-language'
  });
  assert.equal(slice.active, false);
  assert.equal(slice.items[0].active, true);
  // The group still opens on its own, because it holds the active page.
  assert.equal(containsActive(slice), true);
});

test('a group with no page of its own is unchanged', () => {
  const [, , plugins] = buildSideNav(SIDEBAR, { ...opts, currentPage: '' });
  assert.equal(plugins.href, undefined);
  assert.equal(plugins.items[0].title, 'C++ Plug-in API');
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

test('breadcrumbs trace manual -> chapter -> group -> page, and the page is not a link', () => {
  const crumbs = breadcrumbs(NAV, 'enumerations', opts);
  assert.deepEqual(
    crumbs.map((c) => c.title),
    [MANUAL_TITLE, 'The Slice Language', 'User-Defined Types', 'Enumerations']
  );
  assert.equal(crumbs[0].href, '/ice/3.8');
  assert.equal(crumbs[1].href, '/ice/3.8/slice');
  assert.equal(crumbs[2].href, '/ice/3.8/slice/user-defined-types');
  assert.equal(crumbs[3].href, undefined); // current page
});

test('a group without a page of its own is a plain-text crumb', () => {
  const crumbs = breadcrumbs(NAV, 'installing-a-plug-in', opts);
  assert.deepEqual(crumbs[1], { title: 'Plugins' });
});

test('a page outside the tree gets no trail', () => {
  assert.deepEqual(breadcrumbs(NAV, 'orphan', opts), []);
});

test('prevNext walks the whole manual in reading order, across chapters', () => {
  const { prev, next } = prevNext(SIDEBAR, 'enumerations', opts, 'cpp');
  assert.equal(prev?.title, 'User-Defined Types');
  assert.equal(next?.title, 'Sequences');
  assert.equal(next?.href, '/ice/3.8/slice/user-defined-types/sequences');

  // The last page of one chapter leads into the next chapter.
  const end = prevNext(SIDEBAR, 'sequences', opts, 'cpp');
  assert.equal(end.next?.title, 'C++ Plug-in API');
  assert.equal(end.next?.href, '/ice/3.8/plugins/cpp-plug-in-api');
});

test('prevNext skips pages not written for the language, but never the page itself', () => {
  const written = {
    ...opts,
    writtenFor: (page: string) => (page === 'sequences' ? ['cpp'] : undefined)
  };
  assert.equal(
    prevNext(SIDEBAR, 'enumerations', written, 'cpp').next?.title,
    'Sequences'
  );
  assert.equal(
    prevNext(SIDEBAR, 'enumerations', written, 'python').next?.title,
    'C++ Plug-in API'
  );
  // A Python reader who lands on the C++-only page still gets its neighbors.
  assert.equal(
    prevNext(SIDEBAR, 'sequences', written, 'python').prev?.title,
    'Enumerations'
  );
});

test('navigationPages lists every declared page in reading order', () => {
  assert.deepEqual(navigationPages(SIDEBAR), [
    'get-started',
    'the-slice-language',
    'basic-types',
    'user-defined-types',
    'enumerations',
    'sequences',
    'cpp-plug-in-api',
    'installing-a-plug-in'
  ]);
});

test('languageLabel maps slugs to display names, falling back to the slug', () => {
  assert.equal(languageLabel('cpp'), 'C++');
  assert.equal(languageLabel('csharp'), 'C#');
  assert.equal(languageLabel('js'), 'JavaScript');
  assert.equal(languageLabel('unknown'), 'unknown');
});

test('activeTrailKeys names every group down to the current page, and nothing else', () => {
  const tree = buildSideNav(SIDEBAR, opts); // current page: enumerations
  assert.deepEqual(activeTrailKeys(tree), [
    sideNavKey(['The Slice Language']),
    sideNavKey(['The Slice Language', 'User-Defined Types'])
  ]);
});

test('activeTrailKeys is empty when the current page is a top-level leaf', () => {
  const tree = buildSideNav(SIDEBAR, { ...opts, currentPage: 'get-started' });
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
