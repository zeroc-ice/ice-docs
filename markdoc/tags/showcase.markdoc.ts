// Copyright (c) ZeroC, Inc.

import { Tag, type Config, type Node, type Schema } from '@markdoc/markdoc';

// The front page's hero: the Slice contract, and the client and server that use
// it, in the page's language mapping. The page picks each mapping's blocks with
// `{% iflang %}`, as any other page does. Of what is left, the `slice` block is
// the contract, a block titled `Server.*` is the server, and the other is the
// client. The language tabs are the top bar's language targets, from the chrome
// the route provides.
const showcase: Schema = {
  render: 'Showcase',
  children: ['fence', 'tag'],
  transform(node: Node, config: Config) {
    const variables = config.variables ?? {};
    const blocks = (node.transformChildren(config) as unknown[])
      .flat(Infinity)
      .filter(Tag.isTag)
      .map((tag) => ({
        language: String(tag.attributes['data-language'] ?? ''),
        title: tag.attributes.title as string | undefined,
        code: tag.children.join('')
      }));
    const isServer = (block: { title?: string }) =>
      /^server/i.test(block.title ?? '');

    return new Tag('Showcase', {
      current: String(variables.language ?? ''),
      languageOptions: variables.chrome?.languageOptions ?? [],
      contract: blocks.find((block) => block.language === 'slice'),
      client: blocks.find(
        (block) => block.language !== 'slice' && !isServer(block)
      ),
      server: blocks.find(isServer)
    });
  }
};

export default showcase;
