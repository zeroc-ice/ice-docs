// Copyright (c) ZeroC, Inc.

import assert from 'node:assert/strict';
import { test } from 'node:test';
import * as prettier from 'prettier';

import * as plugin from './prettier-plugin-markdoc.mjs';

const format = (source) =>
  prettier.format(source, {
    parser: 'markdoc',
    plugins: [plugin],
    proseWrap: 'always',
    printWidth: 60,
    // As in .prettierrc: otherwise a ```markdown fence is formatted as
    // Markdown, and reflowed.
    embeddedLanguageFormatting: 'off'
  });

test('a tag written against its prose gets a line of its own', async () => {
  const source = `{% callout type="info" %}
The router's public address is 5.6.7.8 and its private address is 10.0.0.1.
{% /callout %}
`;
  assert.equal(
    await format(source),
    `{% callout type="info" %}

The router's public address is 5.6.7.8 and its private
address is 10.0.0.1.

{% /callout %}
`
  );
});

test('two adjacent tags are separated', async () => {
  const source = `Text.
{% /iflang %}
{% iflang langs="js" %}
`;
  assert.equal(
    await format(source),
    `Text.

{% /iflang %}

{% iflang langs="js" %}
`
  );
});

test('a tag that spans several lines is one tag', async () => {
  const source = `{% callout
 type="warning"
 title="A title"
%}
Text that must remain visible.
{% /callout %}
`;
  assert.equal(
    await format(source),
    `{% callout
 type="warning"
 title="A title"
%}

Text that must remain visible.

{% /callout %}
`
  );
});

test('a tag inside a sentence stays inline', async () => {
  const source = `The facility {% iflang langs="cpp" %}and how to write one{% /iflang %} is described here.
`;
  assert.equal(
    await format(source),
    `The facility {% iflang langs="cpp" %}and how to write
one{% /iflang %} is described here.
`
  );
});

test('a tag inside a tight list item keeps the tight layout', async () => {
  // A block tag may follow a paragraph directly; Markdoc reads it as a block
  // either way. Only the reflow onto one line is prevented.
  const source = `- outer
  - inner
    {% callout %}
    Text.
    {% /callout %}
`;
  assert.equal(await format(source), source);
});

test('a tag at the margin under a list item ends the list', async () => {
  const source = `- item one
- item two
{% callout %}
Text.
{% /callout %}
`;
  assert.equal(
    await format(source),
    `- item one
- item two

{% callout %}

Text.

{% /callout %}
`
  );
});

test('a tag between list items splits the list', async () => {
  const source = `1. first
2. second
{% callout %}
Text.
{% /callout %}
3. third
`;
  assert.equal(
    await format(source),
    `1. first
2. second

{% callout %}

Text.

{% /callout %}

3. third
`
  );
});

test('a tag at the margin under a quoted line ends the quote', async () => {
  const source = `> Quoted.
{% callout %}
Text.
{% /callout %}
`;
  assert.equal(
    await format(source),
    `> Quoted.

{% callout %}

Text.

{% /callout %}
`
  );
});

test('a tag inside a block quote gets quoted blank lines', async () => {
  const source = `> {% callout %}
> Quoted
> {% /callout %}
`;
  assert.equal(
    await format(source),
    `> {% callout %}
>
> Quoted
>
> {% /callout %}
`
  );
});

test('a tag inside a code fence is left alone', async () => {
  const source = '```markdown\n{% callout %}\nText\n{% /callout %}\n```\n';
  assert.equal(await format(source), source);
});

test('a shorter fence inside a longer one does not end it', async () => {
  const source =
    '````markdown\n```js\nconst x = 1;\n```\n{% callout %}\nText\n{% /callout %}\n````\n';
  assert.equal(await format(source), source);
});

test('a fence opened on a list marker line is tracked', async () => {
  const source = `- \`\`\`markdown
  {% callout %}
  Text
  {% /callout %}
  \`\`\`
`;
  assert.equal(await format(source), source);
});

test('a tag-looking line in an indented code block is left alone', async () => {
  const source = `Example:

    {% callout %}
    Text
    {% /callout %}
`;
  assert.equal(await format(source), source);
});

test('a fence-looking line in indented code does not open a fence', async () => {
  const source = `Example:

    \`\`\`markdown
{% callout %}
Text.
{% /callout %}
`;
  assert.equal(
    await format(source),
    `Example:

    \`\`\`markdown

{% callout %}

Text.

{% /callout %}
`
  );
});

test('a tag-looking line in frontmatter is left alone', async () => {
  const source = `---
title: Example
description: |-
  {% literal value %}
---

Body.
`;
  assert.equal(await format(source), source);
});

test('an inline closer after a space stays with the word before it', async () => {
  const source = `Intro sentence here. {% iflang langs="cpp" %}In C++, the proxy class provides one function. {% /iflang %}
`;
  assert.equal(
    await format(source),
    `Intro sentence here. {% iflang langs="cpp" %}In C++, the
proxy class provides one function. {% /iflang %}
`
  );
});

test('an inline closer after a link stays with the link', async () => {
  const source = `Intro sentence that runs on. {% iflang langs="cpp" %}See the [docs](../docs) {% /iflang %}
`;
  assert.equal(
    await format(source),
    `Intro sentence that runs on. {% iflang langs="cpp" %}See the
[docs](../docs) {% /iflang %}
`
  );
});

test('a tag indented less than the item content ends the list', async () => {
  const source = `1. first
 {% callout %}
 Text.
 {% /callout %}
2. second
`;
  assert.equal(
    await format(source),
    `1. first

{% callout %}

Text.

{% /callout %}

2. second
`
  );
});

test('a two-space hard break before a tag ends its line', async () => {
  const source = `Text before  
{% callout %}
Inside.
{% /callout %}
`;
  assert.equal(
    await format(source),
    `Text before

{% callout %}

Inside.

{% /callout %}
`
  );
});

test('a backslash at the end of a paragraph is kept', async () => {
  const source = `Text before\\
{% callout %}
Inside.
{% /callout %}
`;
  const output = await format(source);
  assert.ok(output.includes('\\'), 'backslash kept');
});

test('a numbered item right under a tag is an error', async () => {
  const source = `{% /callout %}
2. second
3. third
`;
  await assert.rejects(format(source), /blank line/);
});

test('separated input is unchanged', async () => {
  const source = `Before.

{% callout %}

Inside.

{% /callout %}

After.
`;
  assert.equal(await format(source), source);
});
