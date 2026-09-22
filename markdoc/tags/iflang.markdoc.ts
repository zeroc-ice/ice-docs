// Copyright (c) ZeroC, Inc.

import { Tag, type Node, type Config } from '@markdoc/markdoc';

// A block or inline span that belongs to some of the language mappings. Every
// mapping is in the page; the reader's language, set on <html data-lang>, is
// what shows. The children render inside a wrapper carrying `langs`, and CSS
// hides the wrappers of the other mappings.
const iflang = {
  attributes: {
    langs: { type: String, required: true }
  },
  transform(node: Node, config: Config) {
    const langs = String(node.attributes.langs ?? '')
      .split(',')
      .map((s) => s.trim());
    return new Tag(
      'LangBlock',
      { langs, inline: node.inline },
      node.transformChildren(config)
    );
  }
};

export default iflang;
