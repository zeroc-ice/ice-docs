// Copyright (c) ZeroC, Inc.

import { Tag, type Node, type Config } from '@markdoc/markdoc';

const step = {
  render: 'Step',
  attributes: {
    // The transform below derives the id from it.
    title: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      default: 2
    },
    id: {
      type: String,
      required: false
    }
  },
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const { title, level, id } = attributes;

    return new Tag(
      `${`${this.render}`}`,
      {
        title,
        level,
        id: id ?? title.replace(/[?]/g, '').replace(/\s+/g, '-').toLowerCase()
      },
      children
    );
  }
};

export default step;
