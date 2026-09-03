// Copyright (c) ZeroC, Inc.
//
// Run with: node lib/docs-model/links.test.ts

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { buildPageIndex, resolveDocLink } from './links.ts';

const { index } = buildPageIndex([
  'learn/slice/enumerations',
  'learn/runtime/communicator',
  'reference/properties/ice-default-properties',
  'get-started/get-started'
]);

const ctx = { version: '3.8', language: 'cpp', index };

test('a page name resolves to the page wherever it now lives', () => {
  assert.equal(
    resolveDocLink('../enumerations', ctx).href,
    '/ice/3.8/cpp/learn/slice/enumerations'
  );
  assert.equal(
    resolveDocLink('enumerations', ctx).href,
    '/ice/3.8/cpp/learn/slice/enumerations'
  );
  assert.equal(
    resolveDocLink('../../ice-default-properties', ctx).href,
    '/ice/3.8/cpp/reference/properties/ice-default-properties'
  );
});

test('a full path resolves too, and anchors survive', () => {
  assert.equal(
    resolveDocLink('learn/runtime/communicator#creating', ctx).href,
    '/ice/3.8/cpp/learn/runtime/communicator#creating'
  );
  assert.equal(
    resolveDocLink('../communicator#creating-a-communicator', ctx).href,
    '/ice/3.8/cpp/learn/runtime/communicator#creating-a-communicator'
  );
});

test('links the resolver must not touch are returned unchanged', () => {
  for (const href of [
    'https://zeroc.com',
    '//cdn.example.com/x.png',
    'mailto:info@zeroc.com',
    '#in-page-anchor',
    '/ice/3.8/cpp/learn/overview',
    './attachments/diagram.gif'
  ]) {
    const resolved = resolveDocLink(href, ctx);
    assert.equal(resolved.href, href, href);
    assert.equal(resolved.resolved, true, href);
  }
});

test('an unknown page name is reported, not silently rewritten', () => {
  const link = resolveDocLink('../a-page-that-was-never-migrated', ctx);
  assert.equal(link.resolved, false);
  assert.equal(link.href, '../a-page-that-was-never-migrated');
});

test('resolution is case-insensitive and URL-decoded', () => {
  assert.equal(resolveDocLink('../Enumerations', ctx).href, '/ice/3.8/cpp/learn/slice/enumerations');
  assert.equal(
    resolveDocLink('../ice-default-properties', ctx).href,
    '/ice/3.8/cpp/reference/properties/ice-default-properties'
  );
  assert.equal(
    // cspell:disable-next-line -- a URL-encoded slug, not words
    resolveDocLink('../ice%2Ddefault%2Dproperties', ctx).href,
    '/ice/3.8/cpp/reference/properties/ice-default-properties'
  );
});

test('buildPageIndex reports colliding final segments instead of hiding them', () => {
  const { index: idx, duplicates } = buildPageIndex([
    'learn/slice/overview',
    'guides/security/overview'
  ]);
  assert.deepEqual(duplicates, ['overview']);
  // Deterministic: the first path in sorted order wins.
  assert.equal(idx['overview'], 'guides/security/overview');
  // Both remain addressable by their full path.
  assert.equal(idx['learn/slice/overview'], 'learn/slice/overview');
});

test('an explicit path wins over another page with the same final segment', () => {
  const { index: idx } = buildPageIndex(['guides/security/overview', 'learn/slice/overview']);
  const ctx2 = { version: '3.8', language: 'cpp', index: idx };
  // Spelled out in full: unambiguous, and must not be hijacked by the bare name.
  assert.equal(
    resolveDocLink('learn/slice/overview', ctx2).href,
    '/ice/3.8/cpp/learn/slice/overview'
  );
});

test('a page whose whole path is one segment is not shadowed by an alias', () => {
  const { index: idx, duplicates } = buildPageIndex(['learn/foo', 'foo']);
  // `foo` is a real page; `learn/foo` only wants the name.
  assert.equal(idx['foo'], 'foo');
  assert.equal(idx['learn/foo'], 'learn/foo');
  assert.deepEqual(duplicates, []);
});

test('a page id keeps links working after the page is renamed by a move', () => {
  const { index: idx } = buildPageIndex([
    { path: 'learn/threading', id: 'the-ice-threading-model' }
  ]);
  const ctx2 = { version: '3.8', language: 'cpp', index: idx };
  assert.equal(
    resolveDocLink('../the-ice-threading-model', ctx2).href,
    '/ice/3.8/cpp/learn/threading'
  );
});
