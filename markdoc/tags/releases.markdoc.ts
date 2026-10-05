// Copyright (c) ZeroC, Inc.

import { Tag, type Node, type Config, type Schema } from '@markdoc/markdoc';

// The front page's release list: a Markdown table of the releases, newest
// first, that the `release-list` styles in app/globals.css set as a list.
const releases: Schema = {
  children: ['table'],
  transform(node: Node, config: Config) {
    return new Tag(
      'div',
      { className: 'release-list' },
      node.transformChildren(config)
    );
  }
};

export default releases;
