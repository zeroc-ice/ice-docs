// Copyright (c) ZeroC, Inc.
//
// Run with: node lib/docs-model/links.test.ts

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { buildPageIndex, resolveDocLink } from './links.ts';

const index = buildPageIndex([
  'learn/slice/enumerations',
  'learn/runtime/communicator',
  'reference/properties/ice-default-properties',
  'get-started'
]);

const ctx = { version: '3.8', slug: 'learn/slice/enumerations', index };

test('a slug resolves to the page, and the query and anchor survive', () => {
  assert.equal(
    resolveDocLink('learn/slice/enumerations', ctx).href,
    '/ice/3.8/learn/slice/enumerations'
  );
  assert.equal(resolveDocLink('get-started', ctx).href, '/ice/3.8/get-started');
  assert.equal(
    resolveDocLink('learn/runtime/communicator#creating', ctx).href,
    '/ice/3.8/learn/runtime/communicator#creating'
  );
  assert.equal(
    resolveDocLink('learn/runtime/communicator?lang=java#creating', ctx).href,
    '/ice/3.8/learn/runtime/communicator?lang=java#creating'
  );
});

test('a path starting with . or .. is relative to the page', () => {
  assert.equal(
    resolveDocLink('../enumerations', ctx).href,
    '/ice/3.8/learn/slice/enumerations'
  );
  assert.equal(
    resolveDocLink('..', { ...ctx, slug: 'learn/slice/enumerations/child' })
      .href,
    '/ice/3.8/learn/slice/enumerations'
  );
  assert.equal(
    resolveDocLink('../../runtime/communicator#creating', ctx).href,
    '/ice/3.8/learn/runtime/communicator#creating'
  );
  assert.equal(
    resolveDocLink('./get-started', { ...ctx, slug: '' }).href,
    '/ice/3.8/get-started'
  );
  // Stepping above the version names no page.
  assert.equal(resolveDocLink('../../../../get-started', ctx).resolved, false);
});

test('links the resolver must not touch are returned unchanged', () => {
  for (const href of [
    'https://zeroc.com',
    '//cdn.example.com/x.png',
    'mailto:info@zeroc.com',
    '#in-page-anchor',
    '?lang=java#in-page-anchor',
    '/ice/3.8/learn/overview'
  ]) {
    const resolved = resolveDocLink(href, ctx);
    assert.equal(resolved.href, href, href);
    assert.equal(resolved.resolved, true, href);
  }
});

test('a link to no page is reported, not silently rewritten', () => {
  for (const href of [
    'learn/slice/a-page-that-was-never-migrated',
    // A page name alone is not a slug.
    'enumerations',
    '../a-page-that-was-never-migrated'
  ]) {
    const link = resolveDocLink(href, ctx);
    assert.equal(link.resolved, false, href);
    assert.equal(link.href, href);
  }
});

test('resolution is case-insensitive and URL-decoded', () => {
  assert.equal(
    resolveDocLink('learn/slice/Enumerations', ctx).href,
    '/ice/3.8/learn/slice/enumerations'
  );
  assert.equal(
    // cspell:disable-next-line -- a URL-encoded slug, not words
    resolveDocLink('reference/properties/ice%2Ddefault%2Dproperties', ctx).href,
    '/ice/3.8/reference/properties/ice-default-properties'
  );
});
