// Copyright (c) ZeroC, Inc.

import { Tag, type Node, type Config } from '@markdoc/markdoc';

// A block or inline span that belongs to some of the language mappings. Every
// mapping is in the page; the reader's language, set on <html data-lang>, is
// what shows. The children render inside a wrapper carrying `langs`, and CSS
// hides the wrappers of the other mappings. Inside, the text is for these
// mappings alone, so what renders once per language, such as a link to the API
// reference, renders for them.
const iflang = {
  attributes: {
    langs: { type: String, required: true }
  },
  transform(node: Node, config: Config) {
    const langs = String(node.attributes.langs ?? '')
      .split(',')
      .map((s) => s.trim());
    const variables = { ...config.variables, languages: langs };
    return new Tag(
      'LangBlock',
      { langs, inline: node.inline },
      node.transformChildren({ ...config, variables })
    );
  }
};

export default iflang;
