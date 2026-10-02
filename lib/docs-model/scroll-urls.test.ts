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
import { splitLines } from './resolve.ts';

test('every URL of the 3.8 manual on the Scroll Viewport site redirects to a page', () => {
  const scroll = splitLines(
    fs.readFileSync(path.join(CONTENT_ROOT, '3.8', 'scroll-urls.txt'), 'utf8')
  ).filter((line) => line.startsWith('/'));
  const redirects = readRedirects(CONTENT_ROOT);
  // Each rule written for a list of languages, spelled out for each language.
  const destinations = new Map(
    redirects.flatMap(({ source, destination }) => {
      const [, languages, rest] =
        source.match(/^\/ice\/3\.8\/:lang\(([^)]*)\)(.*)$/) ?? [];
      return languages
        ? languages
            .split('|')
            .map((lang): [string, string] => [
              `/ice/3.8/${lang}${rest}`,
              destination
            ])
        : [];
    })
  );
  const pages = new Set(
    listPages(CONTENT_ROOT, '3.8').map((page) => pageHref('3.8', page.slug))
  );

  // The Scroll Viewport site spelled `js` as `javascript`.
  assert.ok(
    redirects.some(
      ({ source, destination }) =>
        source === '/ice/3.8/javascript/:rest*' &&
        destination === '/ice/3.8/js/:rest*'
    )
  );
  const missing = scroll.filter((url) => {
    const destination = destinations.get(
      url.replace(/^\/ice\/3\.8\/javascript(?=\/|$)/, '/ice/3.8/js')
    );
    return !destination || !pages.has(destination.split(/[?#]/)[0]);
  });

  assert.deepEqual(missing, []);
});
