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
  type NavNode
} from './nav.ts';

const SIDEBAR: NavNode[] = [
  { title: 'Get Started', slug: 'get-started', items: [] },
  {
    title: 'The Slice Language',
    slug: 'slice',
    items: [
      { title: 'Basic Types', slug: 'slice/basic-types', items: [] },
      {
        title: 'User-Defined Types',
        slug: 'slice/user-defined-types',
        items: [
          {
            title: 'Enumerations',
            slug: 'slice/user-defined-types/enumerations',
            items: []
          },
          {
            title: 'Sequences',
            slug: 'slice/user-defined-types/sequences',
            writtenFor: ['cpp'],
            items: []
          }
        ]
      }
    ]
  },
  {
    title: 'Plugins',
    slug: 'plugins',
    items: [
      { title: 'C++ Plug-in API', slug: 'plugins/cpp-plug-in-api', items: [] },
      {
        title: 'Installing a Plug-in',
        slug: 'plugins/installing-a-plug-in',
        items: []
      }
    ]
  }
];

const ENUMERATIONS = 'slice/user-defined-types/enumerations';
const SEQUENCES = 'slice/user-defined-types/sequences';

test('buildSideNav resolves the tree with hrefs and active flags', () => {
  const tree = buildSideNav(SIDEBAR, '3.8', ENUMERATIONS);
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

test('a group becomes a toggle, with its page as Overview', () => {
  // Otherwise one row has to answer two gestures — navigate, and open — and the
  // title cannot be the thing you click to expand.
  const [, slice] = buildSideNav(SIDEBAR, '3.8', ENUMERATIONS);
  assert.equal(slice.href, undefined, 'the group row itself does not navigate');
  assert.equal(slice.items[0].title, 'Overview');
  assert.equal(slice.items[0].href, '/ice/3.8/slice');
});

test("standing on a group's own page marks Overview, not the group row", () => {
  const [, slice] = buildSideNav(SIDEBAR, '3.8', 'slice');
  assert.equal(slice.active, false);
  assert.equal(slice.items[0].active, true);
  // The group still opens on its own, because it holds the active page.
  assert.equal(containsActive(slice), true);
});

test('containsActive reports the branch holding the current page', () => {
  const tree = buildSideNav(SIDEBAR, '3.8', ENUMERATIONS);
  assert.equal(containsActive(tree[1]), true); // The Slice Language contains it
  assert.equal(containsActive(tree[0]), false); // Get Started does not
});

test('trailTo returns every ancestor down to the page, or null', () => {
  assert.deepEqual(
    trailTo(SIDEBAR, ENUMERATIONS)?.map((n) => n.title),
    ['The Slice Language', 'User-Defined Types', 'Enumerations']
  );
  assert.deepEqual(
    trailTo(SIDEBAR, 'get-started')?.map((n) => n.title),
    ['Get Started']
  );
  assert.equal(trailTo(SIDEBAR, 'not-a-page'), null);
});

test('breadcrumbs trace manual -> chapter -> group -> page, and the page is not a link', () => {
  const crumbs = breadcrumbs(SIDEBAR, '3.8', ENUMERATIONS);
  assert.deepEqual(
    crumbs.map((c) => c.title),
    [MANUAL_TITLE, 'The Slice Language', 'User-Defined Types', 'Enumerations']
  );
  assert.equal(crumbs[0].href, '/ice/3.8');
  assert.equal(crumbs[1].href, '/ice/3.8/slice');
  assert.equal(crumbs[2].href, '/ice/3.8/slice/user-defined-types');
  assert.equal(crumbs[3].href, undefined); // current page
});

test('a page outside the tree gets no trail', () => {
  assert.deepEqual(breadcrumbs(SIDEBAR, '3.8', 'orphan'), []);
});

test('prevNext walks the whole manual in reading order, across chapters', () => {
  const { prev, next } = prevNext(SIDEBAR, '3.8', ENUMERATIONS, 'cpp');
  assert.equal(prev?.title, 'User-Defined Types');
  assert.equal(next?.title, 'Sequences');
  assert.equal(next?.href, '/ice/3.8/slice/user-defined-types/sequences');

  // The last page of one chapter leads into the next chapter.
  const end = prevNext(SIDEBAR, '3.8', SEQUENCES, 'cpp');
  assert.equal(end.next?.title, 'Plugins');
  assert.equal(end.next?.href, '/ice/3.8/plugins');
});

test('prevNext skips pages not written for the language, but never the page itself', () => {
  // Sequences is written for C++ only.
  assert.equal(
    prevNext(SIDEBAR, '3.8', ENUMERATIONS, 'python').next?.title,
    'Plugins'
  );
  // A Python reader who lands on the C++-only page still gets its neighbors.
  assert.equal(
    prevNext(SIDEBAR, '3.8', SEQUENCES, 'python').prev?.title,
    'Enumerations'
  );
});

test('navigationPages lists every page in reading order', () => {
  assert.deepEqual(navigationPages(SIDEBAR), [
    'get-started',
    'slice',
    'slice/basic-types',
    'slice/user-defined-types',
    ENUMERATIONS,
    SEQUENCES,
    'plugins',
    'plugins/cpp-plug-in-api',
    'plugins/installing-a-plug-in'
  ]);
});

test('languageLabel maps slugs to display names, falling back to the slug', () => {
  assert.equal(languageLabel('cpp'), 'C++');
  assert.equal(languageLabel('csharp'), 'C#');
  assert.equal(languageLabel('js'), 'JavaScript');
  assert.equal(languageLabel('unknown'), 'unknown');
});

test('activeTrailKeys names every group down to the current page, and nothing else', () => {
  const tree = buildSideNav(SIDEBAR, '3.8', ENUMERATIONS);
  assert.deepEqual(activeTrailKeys(tree), [
    sideNavKey(['The Slice Language']),
    sideNavKey(['The Slice Language', 'User-Defined Types'])
  ]);
});

test('activeTrailKeys is empty when the current page is a top-level leaf', () => {
  const tree = buildSideNav(SIDEBAR, '3.8', 'get-started');
  assert.deepEqual(activeTrailKeys(tree), []);
});

test('group keys are path-based, so equal titles under different parents differ', () => {
  assert.notEqual(sideNavKey(['Slice']), sideNavKey(['Greeter Example']));
  assert.notEqual(
    sideNavKey(['Slice', 'Interfaces']),
    sideNavKey(['The Ice Runtime', 'Interfaces'])
  );
});
