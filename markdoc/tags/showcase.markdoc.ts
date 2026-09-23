// Copyright (c) ZeroC, Inc.

import { Tag, type Config, type Node, type Schema } from '@markdoc/markdoc';

// The front page's hero: the Slice contract, and the client and server that use
// it, in every language mapping. The page groups its blocks with `{% iflang %}`,
// as any other page does. For each mapping, of the blocks it can see, the
// `slice` block is the contract, a block titled `Server.*` is the server, and
// the other is the client.
const showcase: Schema = {
  render: 'Showcase',
  children: ['fence', 'tag'],
  transform(node: Node, config: Config) {
    const languages: string[] = config.variables!.languages;
    const blocks = (node.transformChildren(config) as unknown[])
      .flat(Infinity)
      .filter(Tag.isTag)
      .filter((tag) => tag.name === 'LangBlock');
    const fencesFor = (language: string) =>
      blocks
        .filter((block) =>
          (block.attributes.langs as string[]).includes(language)
        )
        .flatMap((block) => block.children)
        .filter(Tag.isTag)
        .map((tag) => ({
          language: String(tag.attributes['data-language'] ?? ''),
          title: tag.attributes.title as string | undefined,
          code: tag.children.join('')
        }));
    const isServer = (block: { title?: string }) =>
      /^server/i.test(block.title ?? '');

    const panels = languages.map((language) => {
      const fences = fencesFor(language);
      return {
        lang: language,
        contract: fences.find((block) => block.language === 'slice'),
        client: fences.find(
          (block) => block.language !== 'slice' && !isServer(block)
        ),
        server: fences.find(isServer)
      };
    });

    return new Tag('Showcase', { panels });
  }
};

export default showcase;
