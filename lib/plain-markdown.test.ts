// Copyright (c) ZeroC, Inc.
//
// Run with: node --import ./scripts/markdoc-esm-hooks.ts --test lib/plain-markdown.test.ts

import { test } from 'node:test';
import assert from 'node:assert/strict';
import Markdoc from '@markdoc/markdoc';

import config from '../markdoc/config.ts';
import { parse } from '../markdoc/parse.ts';
import type { DocsVersion } from './docs-model/nav.ts';
import { hasLanguageBlocks, renderMarkdown } from './plain-markdown.ts';

const version: DocsVersion = {
  path: 'ice/3.8',
  title: 'Ice 3.8',
  languages: ['cpp', 'java', 'python']
};

/** A page's source as the site transforms it. */
function tree(source: string) {
  return Markdoc.transform(parse(source), {
    ...config,
    variables: {
      frontmatter: { title: 'Page' },
      path: '/ice/3.8/page',
      slug: 'page',
      readingTime: {},
      version,
      languages: version.languages,
      pageIndex: { page: 'page', 'slice/enumerations': 'slice/enumerations' },
      apiLinks: {
        'Ice/Communicator': {
          cpp: 'https://api/cpp/Communicator',
          java: 'https://api/java/Communicator'
        }
      },
      chrome: {}
    }
  });
}

/** A page's source as Markdown, for one mapping or for every mapping of the version. */
const md = (source: string, ...languages: string[]) =>
  renderMarkdown(tree(source), {
    languages: languages.length ? languages : version.languages,
    href: (href) => href
  });

test('inline markup is written back as Markdown', () => {
  assert.equal(
    md(
      'Plain *em* **strong** ~~gone~~ `code` 2{% sup %}31{% /sup %} and a literal \\* star.'
    ),
    'Plain *em* **strong** ~~gone~~ `code` 2<sup>31</sup> and a literal \\* star.\n'
  );
});

test('headings keep their level, and an anchor set by hand', () => {
  assert.equal(
    md('## Title {% id="custom" %}\n\nText.\n\n### Sub'),
    '## Title {#custom}\n\nText.\n\n### Sub\n'
  );
});

test('lists keep nesting, numbering, and loose paragraphs', () => {
  assert.equal(
    md('- one\n- two\n  - nested\n\n3. a\n\n   para\n4. b'),
    '- one\n- two\n  - nested\n\n3. a\n\n   para\n\n4. b\n'
  );
});

test('a code block keeps its language and title, and a longer fence when it holds one', () => {
  assert.equal(
    md('```cpp {% title="Server.cpp" %}\nint main() {}\n```'),
    '```cpp title="Server.cpp"\nint main() {}\n```\n'
  );
  assert.equal(md('````md\n```\n````'), '````md\n```\n````\n');
});

test('a callout is a quote that opens with its label', () => {
  assert.equal(
    md(
      '{% callout type="warning" title="Careful" %}\n\nBody.\n\n```slice\nmodule M {}\n```\n\n{% /callout %}'
    ),
    '> **Careful**\n>\n> Body.\n>\n> ```slice\n> module M {}\n> ```\n'
  );
  assert.equal(
    md('{% callout %}\n\nBody.\n\n{% /callout %}'),
    '> **Note**\n>\n> Body.\n'
  );
});

test('a table is a pipe table with its pipes escaped', () => {
  assert.equal(
    md('| Value | Description |\n| --- | --- |\n| `a` | first \\| pipe |'),
    '| Value | Description |\n| --- | --- |\n| `a` | first \\| pipe |\n'
  );
});

test('links and images go through the href mapping; a link to no page is its text', () => {
  const out = renderMarkdown(
    tree(
      '[Enumerations](slice/enumerations), [ext](https://example.com/x), [missing](nope), [here](#anchor) ![alt](/images/x.svg)'
    ),
    {
      languages: version.languages,
      href: (href) => (href.startsWith('/') ? `https://site${href}` : href)
    }
  );
  assert.equal(
    out,
    '[Enumerations](https://site/ice/3.8/slice/enumerations), [ext](https://example.com/x), missing, [here](#anchor) ![alt](https://site/images/x.svg)\n'
  );
});

test('rendered for a mapping, the text is what its reader sees', () => {
  const source =
    'Shared{% iflang langs="java" %}, Java only{% /iflang %}.\n\n' +
    '{% iflang langs="cpp,python" %}\n\nNative.\n\n{% /iflang %}\n\n' +
    'See [Communicator](api:Ice/Communicator).';
  assert.equal(
    md(source, 'java'),
    'Shared, Java only.\n\nSee [Communicator](https://api/java/Communicator).\n'
  );
  assert.equal(
    md(source, 'python'),
    'Shared.\n\nNative.\n\nSee Communicator.\n'
  );
  assert.equal(hasLanguageBlocks(tree(source)), true);
  assert.equal(hasLanguageBlocks(tree('Plain.')), false);
});

test('rendered for several mappings, each part names the ones it is for among them', () => {
  const source =
    'Shared{% iflang langs="java" %}, Java only{% /iflang %}.\n\n' +
    '{% iflang langs="cpp,python" %}\n\nNative.\n\n{% /iflang %}\n\n' +
    'See [Communicator](api:Ice/Communicator).';
  assert.equal(
    md(source),
    'Shared (Java: , Java only).\n\n' +
      '> **C++ and Python**\n>\n> Native.\n\n' +
      'See Communicator ([C++](https://api/cpp/Communicator) and [Java](https://api/java/Communicator)).\n'
  );
  assert.equal(
    md(source, 'java', 'python'),
    'Shared (Java: , Java only).\n\n' +
      '> **Python**\n>\n> Native.\n\n' +
      'See Communicator ([Java](https://api/java/Communicator)).\n'
  );
});

test('the showcase is its code blocks, under each mapping or for one', () => {
  const source =
    '{% showcase %}\n\n' +
    '{% iflang langs="cpp,java,python" %}\n\n```slice {% title="Greeter.ice" %}\ninterface Greeter {}\n```\n\n{% /iflang %}\n\n' +
    '{% iflang langs="cpp" %}\n\n```cpp {% title="Client.cpp" %}\nclient();\n```\n\n```cpp {% title="Server.cpp" %}\nserver();\n```\n\n{% /iflang %}\n\n' +
    '{% iflang langs="java" %}\n\n```java {% title="Client.java" %}\nclient();\n```\n\n{% /iflang %}\n\n' +
    '{% iflang langs="python" %}\n\n```python {% title="client.py" %}\nclient()\n```\n\n{% /iflang %}\n\n' +
    '{% /showcase %}';
  assert.equal(
    md(source),
    '**C++**\n\n```slice title="Greeter.ice"\ninterface Greeter {}\n```\n\n```cpp title="Client.cpp"\nclient();\n```\n\n```cpp title="Server.cpp"\nserver();\n```\n\n' +
      '**Java**\n\n```slice title="Greeter.ice"\ninterface Greeter {}\n```\n\n```java title="Client.java"\nclient();\n```\n\n' +
      '**Python**\n\n```slice title="Greeter.ice"\ninterface Greeter {}\n```\n\n```python title="client.py"\nclient()\n```\n'
  );
  assert.equal(
    md(source, 'java'),
    '```slice title="Greeter.ice"\ninterface Greeter {}\n```\n\n```java title="Client.java"\nclient();\n```\n'
  );
});

test('the front page tags render as lists, and the language switch as nothing', () => {
  assert.equal(
    md(
      '{% selection /%}\n\n' +
        '{% grid %}\n\n{% card title="Basics" description="Clients and servers." href="slice/enumerations" icon="book" /%}\n\n{% /grid %}\n\n' +
        '{% releases %}\n\n{% release name="Ice 3.8.1" notes="slice/enumerations" platforms="page" date="March 3, 2026" /%}\n\n{% /releases %}'
    ),
    '- [Basics](/ice/3.8/slice/enumerations): Clients and servers.\n\n' +
      '- **Ice 3.8.1** (March 3, 2026): [Release notes](/ice/3.8/slice/enumerations), [Supported platforms](/ice/3.8/page)\n'
  );
});

test('a tag with no rendering of its own renders its text', () => {
  assert.equal(
    md('{% property-synopsis %}\n\n`Ice.X=num`\n\n{% /property-synopsis %}'),
    '`Ice.X=num`\n'
  );
});
