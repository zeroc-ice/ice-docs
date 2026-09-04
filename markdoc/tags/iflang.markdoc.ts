// Copyright (c) ZeroC, Inc.

import type { Node, Config } from '@markdoc/markdoc';

// Inline (or block) conditional: renders its children only when the current
// programming language ($language variable) is in the `langs` list. Migrated
// from Confluence scroll-conditional-content-inline macros.
const iflang = {
  attributes: {
    langs: { type: String, required: true }
  },
  transform(node: Node, config: Config) {
    const current = config.variables?.language;
    const langs = String(node.attributes.langs ?? '')
      .split(',')
      .map((s) => s.trim());
    return langs.includes(current) ? node.transformChildren(config) : null;
  }
};

export default iflang;
