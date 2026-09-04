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

test('separated input is unchanged', async () => {
  const source = `Before.

{% callout %}

Inside.

{% /callout %}

After.
`;
  assert.equal(await format(source), source);
});
