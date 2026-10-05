// Copyright (c) ZeroC, Inc.
//
// Run with: node lib/docs-model/resolve.test.ts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  parseMarker,
  dedent,
  extractSnippet,
  getAttr,
  splitFrontmatter,
  parseLanguageSections,
  resolveLanguageSections,
  langForFile,
  inlineSnippets,
  resolveDocument,
  declaredSlots,
  splitLines
} from './resolve.ts';

// --- markers ---------------------------------------------------------------

test('parseMarker recognizes each comment leader, open and close', () => {
  assert.deepEqual(parseMarker('// <foo>'), { name: 'foo', close: false });
  assert.deepEqual(parseMarker('  # </foo-bar>'), {
    name: 'foo-bar',
    close: true
  });
  assert.deepEqual(parseMarker('% <a.b>'), { name: 'a.b', close: false });
  assert.equal(parseMarker('int x = 0; // not a marker'), null);
  assert.equal(parseMarker('// <foo> trailing'), null);
});

test('dedent removes common indentation, ignoring blank lines', () => {
  assert.deepEqual(dedent(['    a', '', '      b']), ['a', '', '  b']);
});

test('extractSnippet pulls a C++ fragment, stripped and dedented', () => {
  const src = [
    'int main() {',
    '    // <use>',
    '    int x = 1;',
    '    return x;',
    '    // </use>',
    '}'
  ].join('\n');
  assert.equal(extractSnippet(src, 'use'), 'int x = 1;\nreturn x;');
});

test('extractSnippet works with # (python) markers', () => {
  const src = '# <use>\nf = 1\n# </use>\n';
  assert.equal(extractSnippet(src, 'use'), 'f = 1');
});

test('extractSnippet strips nested markers of other snippets', () => {
  const src = [
    '// <outer>',
    'a',
    '// <inner>',
    'b',
    '// </inner>',
    'c',
    '// </outer>'
  ].join('\n');
  assert.equal(extractSnippet(src, 'outer'), 'a\nb\nc');
});

test('extractSnippet throws when missing or unterminated', () => {
  assert.throws(() => extractSnippet('nothing here', 'x'), /not found/);
  assert.throws(() => extractSnippet('// <x>\ncode', 'x'), /not closed/);
});

// --- attributes ------------------------------------------------------------

test('getAttr parses quoted and unquoted values, tolerates slashes in paths', () => {
  const a = ' file="examples/cpp/enumerations.cpp" name=fruit-usage ';
  assert.equal(getAttr(a, 'file'), 'examples/cpp/enumerations.cpp');
  assert.equal(getAttr(a, 'name'), 'fruit-usage');
  assert.equal(getAttr(a, 'lang'), null);
});

test('splitFrontmatter separates YAML block from body', () => {
  const { frontmatter, body } = splitFrontmatter('---\nid: x\n---\nhello\n');
  assert.equal(frontmatter, 'id: x');
  assert.equal(body, 'hello\n');
});

// --- language-section ------------------------------------------------------

test('parseLanguageSections extracts named blocks by slot name', () => {
  const overlay =
    'intro\n{% language-section name="mapping" %}\nCPP MAPPING\n{% /language-section %}\nend';
  assert.equal(parseLanguageSections(overlay).get('mapping'), 'CPP MAPPING');
});

test('an overlay says nothing by leaving a slot out, not with an empty section', () => {
  assert.throws(
    () =>
      parseLanguageSections(
        '{% language-section name="m" %}\n\n{% /language-section %}'
      ),
    /is empty/
  );
  assert.throws(
    () => parseLanguageSections('{% language-section name="m" /%}'),
    /must hold prose/
  );
});

test('parseLanguageSections rejects the same section twice', () => {
  const overlay =
    '{% language-section name="m" %}one{% /language-section %}' +
    '{% language-section name="m" %}two{% /language-section %}';
  assert.throws(
    () => parseLanguageSections(overlay),
    /duplicate language-section "m"/
  );
});

test('declaredSlots lists what a shared page asks each overlay to fill', () => {
  const shared =
    'A{% language-section name="one" /%}B{% language-section name="two" /%}';
  assert.deepEqual(declaredSlots(shared), ['one', 'two']);
});

// One language's sections, and the block a section renders as.
const sections = (entries: [string, string][]) =>
  new Map([['cpp', new Map(entries)]]);
const block = (langs: string, text: string) =>
  `{% iflang langs="${langs}" %}\n\n${text}\n\n{% /iflang %}`;

test('resolveLanguageSections fills self-closing slots', () => {
  const shared = 'A\n{% language-section name="mapping" /%}\nB';
  const out = resolveLanguageSections(shared, sections([['mapping', 'X']]));
  assert.equal(out, `A\n${block('cpp', 'X')}\nB`);
});

test('languages that answer a slot the same way share one block', () => {
  const shared = '{% language-section name="m" /%}';
  const out = resolveLanguageSections(
    shared,
    new Map([
      ['cpp', new Map([['m', 'Same']])],
      ['java', new Map([['m', 'Same']])],
      ['python', new Map([['m', 'Other']])]
    ])
  );
  assert.equal(
    out,
    `${block('cpp,java', 'Same')}\n\n${block('python', 'Other')}`
  );
});

test('a slot an overlay leaves out renders nothing for that language', () => {
  const shared = 'A{% language-section name="m" /%}B';
  assert.equal(resolveLanguageSections(shared, sections([])), 'AB');
});

// --- snippets --------------------------------------------------------------

test('langForFile infers language from extension', () => {
  assert.equal(langForFile('a/b/File.cs'), 'csharp');
  assert.equal(langForFile('enumerations.py'), 'python');
  assert.equal(langForFile('x.cpp'), 'cpp');
  assert.equal(langForFile('x.unknown'), '');
});

test('inlineSnippets replaces the tag with a fenced block', () => {
  const md = 'before\n{% snippet file="e.py" name="use" /%}\nafter';
  const files: Record<string, string> = { 'e.py': '# <use>\nf = 1\n# </use>' };
  const out = inlineSnippets(md, (f) => files[f]);
  assert.equal(out, 'before\n```python\nf = 1\n```\nafter');
});

test('inlineSnippets requires file and name', () => {
  assert.throws(
    () => inlineSnippets('{% snippet name="x" /%}', () => ''),
    /file= and name=/
  );
});

// --- end-to-end ------------------------------------------------------------

test('resolveDocument merges the overlays + inlines snippets', () => {
  const shared =
    '---\nid: p\n---\n# Title\n{% language-section name="mapping" /%}\n';
  const overlay =
    '---\nlanguage: python\n---\n{% language-section name="mapping" %}\n' +
    'Py mapping\n{% snippet file="e.py" name="use" /%}\n{% /language-section %}';
  const out = resolveDocument({
    shared,
    overlays: { python: overlay },
    readFile: () => '# <use>\nf = 1\n# </use>'
  });
  assert.equal(
    out,
    `# Title\n${block('python', 'Py mapping\n```python\nf = 1\n```')}\n`
  );
});

test('resolveDocument makes a page written per language one page', () => {
  const page = (text: string) => `---\ntitle: Greeter\n---\n${text}`;
  assert.equal(
    resolveDocument({
      shared: '',
      overlays: { cpp: page('C++ steps.'), python: page('Python steps.') },
      readFile: () => ''
    }),
    `${block('cpp', 'C++ steps.')}\n\n${block('python', 'Python steps.')}`
  );
});

// --- integration against a complete worked example ---------------------------
//
// One shared page, two overlays and two compilable example files under
// __fixtures__/content-model-example: the smallest content tree that exercises
// every part of the model at once.

test('resolves the content-model example (cpp enumerations)', () => {
  const here = dirname(fileURLToPath(import.meta.url));
  const ex = join(here, '__fixtures__', 'content-model-example');
  const shared = readFileSync(
    join(ex, 'content/3.8/slice/enumerations/index.md'),
    'utf8'
  );
  const overlay = readFileSync(
    join(ex, 'content/3.8/slice/enumerations/cpp.md'),
    'utf8'
  );
  const out = resolveDocument({
    shared,
    overlays: { cpp: overlay },
    readFile: (f) => readFileSync(join(ex, f), 'utf8')
  });
  // shared prose survives
  assert.match(out, /Syntax and semantics/);
  // overlay mapping is merged in
  assert.match(out, /## C\+\+ mapping/);
  // the snippet was extracted from the compilable source and fenced as cpp
  assert.match(out, /```cpp\nFruit f = Fruit::Apple;/);
  // no unresolved tags remain
  assert.doesNotMatch(out, /\{%\s*(language-section|snippet)/);
});

// `.gitattributes` normalizes the repo to LF and checks files out with the
// platform's convention, so page text arrives CRLF on Windows and LF elsewhere.
// An LF-only pattern here does not throw: it matches nothing and every field
// reads as absent. That is how the search index lost 346 of its 348 titles and
// how every `id:` link alias stopped resolving.
test('frontmatter parses the same whether the page is LF or CRLF', () => {
  const lf = '---\ntitle: Modules\nid: modules\n---\n# Body\n';
  const crlf = lf.replace(/\n/g, '\r\n');

  const a = splitFrontmatter(lf);
  const b = splitFrontmatter(crlf);

  assert.match(a.frontmatter, /^title: Modules$/m);
  assert.match(b.frontmatter, /^title: Modules\r?$/m);
  assert.equal(a.body, '# Body\n');
  assert.equal(b.body, '# Body\r\n');
});

test('a document with no frontmatter keeps its whole body, either ending', () => {
  for (const body of ['# Just a body\nmore\n', '# Just a body\r\nmore\r\n']) {
    const out = splitFrontmatter(body);
    assert.equal(out.frontmatter, '');
    assert.equal(out.body, body);
  }
});

test('splitLines is agnostic to the checkout convention', () => {
  assert.deepEqual(splitLines('a\nb\nc'), ['a', 'b', 'c']);
  assert.deepEqual(splitLines('a\r\nb\r\nc'), ['a', 'b', 'c']);
});
