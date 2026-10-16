// Copyright (c) ZeroC, Inc.

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { prepareSvg } from './svg-image.ts';

const source = `<?xml version="1.0"?>
<svg width="700" height="300" viewBox="0 0 700 300" aria-labelledby="title description">
<title id="title">A figure</title><desc id="description">Its description</desc>
<defs><marker id="arrow"><path fill="var(--text-secondary, #566174)"/></marker>
<pattern id="hatch"><path stroke="#ffffff"/></pattern><g id="shape"/></defs>
<style>text { fill: var(--text-primary, #182235); }
.label, text.code { font-size: 16px; }
#node { marker-end: url(#arrow); fill: url('#hatch'); }</style>
<g id="node" aria-labelledby="title" aria-describedby="description"><text class="label">Node</text></g>
<use href="#shape"/><use xlink:href="#shape"/>
</svg>`;

test('fragment references and accessible descriptions stay within their figure', () => {
  const svg = prepareSvg(source, 'first');
  assert.equal(svg.attributes.width, '700');
  assert.equal(svg.attributes.viewBox, '0 0 700 300');
  assert.equal(
    svg.attributes['aria-labelledby'],
    'first-title first-description'
  );
  assert.equal(svg.descriptionId, 'first-description');
  assert.match(svg.content, /id="first-arrow"/);
  assert.match(svg.content, /url\(#first-arrow\)/);
  assert.match(svg.content, /url\('#first-hatch'\)/);
  assert.match(svg.content, /href="#first-shape"/);
  assert.match(svg.content, /xlink:href="#first-shape"/);
  assert.match(svg.content, /aria-describedby="first-description"/);
  assert.match(svg.content, /stroke="#ffffff"/);
});

test('every selector in a figure stylesheet is scoped to its root', () => {
  const svg = prepareSvg(source, 'first');
  assert.match(svg.content, /#first text\s*\{/);
  assert.match(svg.content, /#first \.label,\s*#first text\.code\s*\{/);
  assert.match(svg.content, /#first #first-node\s*\{/);
  assert.match(svg.content, /font-size: 16px/);
});

test('repeated figures use disjoint IDs', () => {
  const first = prepareSvg(source, 'first').content;
  const second = prepareSvg(source, 'second').content;
  const firstIds = new Set(
    [...first.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
  );
  const secondIds = [...second.matchAll(/\sid="([^"]+)"/g)].map(
    (match) => match[1]
  );
  assert.ok(secondIds.every((id) => !firstIds.has(id)));
});

test('published figures have local styles and references and light fallback colors', () => {
  const directory = path.join(process.cwd(), 'public/images/ice/3.8');
  const files = fs
    .readdirSync(directory, { recursive: true, encoding: 'utf8' })
    .filter((file) => String(file).endsWith('.svg'));
  for (const file of files) {
    const source = fs.readFileSync(path.join(directory, String(file)), 'utf8');
    assert.doesNotMatch(
      source,
      /prefers-color-scheme|:root\s*\{/,
      String(file)
    );
    const svg = prepareSvg(source, 'figure');
    const ids = new Set(
      [...svg.content.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1])
    );
    for (const match of svg.content.matchAll(
      /(?:url\(["']?#|(?:xlink:)?href="#)([\w-]+)/g
    )) {
      assert.ok(ids.has(match[1]), `${file}: missing ${match[1]}`);
    }
    for (const match of source.matchAll(/var\(([^)]+)\)/g)) {
      assert.match(
        match[1],
        /^--[\w-]+,\s*#[\da-f]{6}$/i,
        `${file}: missing light fallback`
      );
    }
  }
});
