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

test('a tag inside a code fence is left alone', async () => {
  const source = '```markdown\n{% callout %}\nText\n{% /callout %}\n```\n';
  assert.equal(await format(source), source);
});

test('a shorter fence inside a longer one does not end it', async () => {
  const source =
    '````markdown\n```js\nconst x = 1;\n```\n{% callout %}\nText\n{% /callout %}\n````\n';
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

test('a tag-looking line indented with a tab is left alone', async () => {
  // Prettier itself writes the code block back with four spaces; the point is
  // that it is still a code block, with no blank lines put inside it.
  const source = 'Example:\n\n\t{% callout %}\n\tText\n\t{% /callout %}\n';
  assert.equal(
    await format(source),
    'Example:\n\n    {% callout %}\n    Text\n    {% /callout %}\n'
  );
});

test('a tag inside a list item gets its own lines', async () => {
  const source = `- Item text
  {% callout %}
  Inside
  {% /callout %}
`;
  assert.equal(
    await format(source),
    `- Item text

  {% callout %}

  Inside

  {% /callout %}
`
  );
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
