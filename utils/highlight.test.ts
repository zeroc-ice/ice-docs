// Copyright (c) ZeroC, Inc.
//
// Run with: node utils/highlight.test.ts

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { highlight } from './highlight.ts';

test('only text in a colour of its own gets a span', () => {
  assert.equal(
    highlight('module M\n\n{}', 'slice'),
    '<div><span style="color:var(--code-keyword)">module</span> M</div>' +
      '<div>\n</div>' +
      '<div>{}</div>'
  );
});

test('adjacent tokens of one colour share a span', () => {
  // The sign and the rest of a diff line are separate tokens.
  assert.equal(
    highlight('+added', 'diff'),
    '<div><span style="color:var(--code-inserted)">+added</span></div>'
  );
});

test("Slice code highlights Ice's keywords", () => {
  assert.equal(
    highlight('void op(out int x);', 'slice'),
    '<div><span style="color:var(--code-keyword)">void</span> op(' +
      '<span style="color:var(--code-keyword)">out</span> ' +
      '<span style="color:var(--code-keyword)">int</span> x);</div>'
  );
});

test("a tag inside a doc comment keeps the comment's italics", () => {
  assert.equal(
    highlight('/// Returns @return nothing.', 'slice'),
    '<div><span style="color:var(--code-comment);font-style:italic">/// Returns </span>' +
      '<span style="color:var(--code-type);font-style:italic">@return</span>' +
      '<span style="color:var(--code-comment);font-style:italic"> nothing.</span></div>'
  );
});

test('code without a grammar is escaped plain text', () => {
  assert.equal(highlight('a < b && c', ''), '<div>a &lt; b &amp;&amp; c</div>');
});
