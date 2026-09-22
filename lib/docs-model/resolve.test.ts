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
  stripRedundantTitle,
  demoteHeadings,
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

test('parseLanguageSections extracts named blocks as content slots', () => {
  const overlay =
    'intro\n{% language-section name="mapping" %}\nCPP MAPPING\n{% /language-section %}\nend';
  const slot = parseLanguageSections(overlay).get('mapping');
  assert.equal(slot?.state, 'content');
  assert.equal(slot?.content, 'CPP MAPPING');
});

test('a blank section is unclassified: it does not say which kind of blank it is', () => {
  const overlay =
    '{% language-section name="mapping" %}\n\n{% /language-section %}';
  const slot = parseLanguageSections(overlay).get('mapping');
  assert.equal(slot?.state, 'unclassified');
  assert.equal(slot?.content, '');
});

test('an overlay can declare that it adds nothing, or that the feature is absent', () => {
  const nothing = parseLanguageSections(
    '{% language-section name="m" state="no-addition" /%}'
  );
  assert.equal(nothing.get('m')?.state, 'no-addition');

  const absent = parseLanguageSections(
    '{% language-section name="m" state="not-applicable" note="MATLAB is client-only." /%}'
  );
  assert.equal(absent.get('m')?.state, 'not-applicable');
  assert.equal(absent.get('m')?.note, 'MATLAB is client-only.');
});

test('parseLanguageSections rejects malformed state declarations', () => {
  // Self-closing with no state is the old ambiguous blank, spelled differently.
  assert.throws(
    () => parseLanguageSections('{% language-section name="m" /%}'),
    /must declare state=/
  );
  assert.throws(
    () =>
      parseLanguageSections('{% language-section name="m" state="todo" /%}'),
    /expected "no-addition" or "not-applicable"/
  );
  // "Not applicable" without a reason is not something a reader can act on.
  assert.throws(
    () =>
      parseLanguageSections(
        '{% language-section name="m" state="not-applicable" /%}'
      ),
    /must explain why/
  );
  assert.throws(
    () =>
      parseLanguageSections(
        '{% language-section name="m" state="no-addition" %}prose{% /language-section %}'
      ),
    /also has content/
  );
});

test('parseLanguageSections rejects the same section twice', () => {
  // Previously the second silently won, so an overlay could contradict itself.
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

const slot = (
  name: string,
  state: string,
  extra: Record<string, string> = {}
) => new Map([[name, { name, state, content: '', ...extra }]]) as never;

test('resolveLanguageSections fills self-closing slots', () => {
  const shared = 'A\n{% language-section name="mapping" /%}\nB';
  const out = resolveLanguageSections(
    shared,
    slot('mapping', 'content', { content: 'X' })
  );
  assert.equal(out, 'A\nX\nB');
});

test('each slot state renders the thing that state means', () => {
  const shared = 'A{% language-section name="m" /%}B';

  // Nothing to add: the shared prose already covers it, so the page reads on.
  assert.equal(resolveLanguageSections(shared, slot('m', 'no-addition')), 'AB');

  // Absent feature: the reader is told, instead of finding a silent gap where
  // the other eight mappings have prose.
  const absent = resolveLanguageSections(
    shared,
    slot('m', 'not-applicable', { note: 'PHP has no server side.' })
  );
  assert.match(absent, /callout type="note"/);
  assert.match(absent, /PHP has no server side\./);
});

test('an unclassified slot renders nothing but can be made an error', () => {
  const shared = 'A{% language-section name="m" /%}B';
  // The site still builds while the inherited blanks are being classified...
  assert.equal(
    resolveLanguageSections(shared, slot('m', 'unclassified')),
    'AB'
  );
  // ...and the validator refuses to accept them.
  assert.throws(
    () =>
      resolveLanguageSections(shared, slot('m', 'unclassified'), {
        onUnclassified: 'error'
      }),
    /is blank and does not say why/
  );
});

test('resolveLanguageSections errors on a missing overlay section by default', () => {
  const shared = '{% language-section name="mapping" /%}';
  assert.throws(
    () => resolveLanguageSections(shared, new Map()),
    /no overlay content/
  );
  assert.equal(
    resolveLanguageSections(shared, new Map(), { onMissing: 'empty' }),
    ''
  );
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

test('resolveDocument merges overlay + inlines snippets', () => {
  const shared =
    '---\nid: p\n---\n# Title\n{% language-section name="mapping" /%}\n';
  const overlay =
    '---\nlanguage: python\n---\n{% language-section name="mapping" %}\n' +
    'Py mapping\n{% snippet file="e.py" name="use" /%}\n{% /language-section %}';
  const out = resolveDocument({
    shared,
    overlay,
    readFile: () => '# <use>\nf = 1\n# </use>'
  });
  assert.equal(out, '# Title\nPy mapping\n```python\nf = 1\n```\n');
});

test('resolveDocument serves an overlay-only (language-specific) page', () => {
  const overlay = '---\nlanguage: cpp\n---\nOnly C++ has this page.';
  assert.equal(
    resolveDocument({ shared: '', overlay, readFile: () => '' }),
    'Only C++ has this page.'
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
    overlay,
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

test('stripRedundantTitle drops a leading H1 only when it repeats the title', () => {
  // The page template renders the title, so an identical H1 would show twice.
  assert.equal(
    stripRedundantTitle('# Enumerations\n\nBody.\n', 'Enumerations'),
    'Body.\n'
  );
  // Case and surrounding whitespace do not matter.
  assert.equal(
    stripRedundantTitle('\n#  enumerations  \nBody.\n', 'Enumerations'),
    'Body.\n'
  );
  // A different opening heading is a real section heading: keep it.
  const different = '# Enumeration Syntax and Semantics\n\nBody.\n';
  assert.equal(stripRedundantTitle(different, 'Enumerations'), different);
  // No title, no H1, or a deeper heading: unchanged.
  assert.equal(
    stripRedundantTitle('# Enumerations\n', undefined),
    '# Enumerations\n'
  );
  assert.equal(
    stripRedundantTitle('## Enumerations\n', 'Enumerations'),
    '## Enumerations\n'
  );
});

test('demoteHeadings gives the page one h1 without touching anchors or code', () => {
  const body = [
    '# Section',
    '',
    'Text.',
    '',
    '```md',
    '# not a heading',
    '```',
    '',
    '## Sub',
    '###### Deepest'
  ].join('\n');
  const out = demoteHeadings(body).split('\n');
  assert.equal(out[0], '## Section');
  assert.equal(out[5], '# not a heading'); // inside a fence: untouched
  assert.equal(out[8], '### Sub');
  assert.equal(out[9], '###### Deepest'); // already at the deepest level
});

test('demoteHeadings leaves a body that has no h1 alone', () => {
  const body = '## Already nested\n\nText.\n';
  assert.equal(demoteHeadings(body), body);
});

test('demoteHeadings does not treat a nested fence as the end of an outer one', () => {
  const body = [
    '# Section',
    '',
    '````md',
    '```',
    '# still code',
    '```',
    '````',
    '',
    '# After'
  ].join('\n');
  const out = demoteHeadings(body).split('\n');
  assert.equal(out[0], '## Section');
  assert.equal(out[4], '# still code'); // inside the outer four-backtick fence
  assert.equal(out[8], '## After'); // the outer fence did close
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
