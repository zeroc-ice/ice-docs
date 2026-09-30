// Copyright (c) ZeroC, Inc.
//
// Run with: node lib/docs-model/scroll-urls.test.ts, from the repository root.
// Checks the real content: a page renamed or removed here must keep the URLs
// the Scroll Viewport site gave it, by an entry in redirects.yaml.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

import { CONTENT_ROOT, listPages, readRedirects } from './content.ts';
import { pageHref } from './nav.ts';

test('every URL of the 3.8 manual on the Scroll Viewport site redirects to a page', () => {
  const scroll = fs
    .readFileSync(path.join(CONTENT_ROOT, '3.8', 'scroll-urls.txt'), 'utf8')
    .split('\n')
    .filter((line) => line.startsWith('/'));
  const destinations = new Map(
    readRedirects(CONTENT_ROOT).map((redirect) => [
      redirect.source.replace(/:lang\([^)]*\)/, ':lang'),
      redirect.destination
    ])
  );
  const pages = new Set(
    listPages(CONTENT_ROOT, '3.8').map((page) => pageHref('3.8', page.slug))
  );

  const missing = scroll.filter((url) => {
    const name = url.split('/')[4];
    const destination = destinations.get(
      name ? `/ice/3.8/:lang/${name}` : '/ice/3.8/:lang'
    );
    return !destination || !pages.has(destination.split(/[?#]/)[0]);
  });

  assert.deepEqual(missing, []);
});
