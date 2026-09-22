// Copyright (c) ZeroC, Inc.

import { Tag, nodes, type Config, type Node } from '@markdoc/markdoc';

// CommonMark writes two different things the same way. A paragraph that holds
// nothing but an image is a figure: centred, with room above and below. An
// image inside a sentence — the IceGrid GUI's state icons, "a node can be
// either up [icon] or down [icon]" — is a word, and has to stay on the line.
// The paragraph is the only node that can tell the two apart, so it marks the
// figures; the stylesheet treats every other image as inline.
const paragraph = {
  ...nodes.paragraph,
  transform(node: Node, config: Config) {
    const attributes = node.transformAttributes(config);
    const children = node.transformChildren(config);
    const images = children.filter(
      (child): child is Tag => Tag.isTag(child) && child.name === 'img'
    );
    if (images.length > 0 && images.length === children.length) {
      for (const image of images) image.attributes.class = 'figure';
    }
    return new Tag('p', attributes, children);
  }
};

export default paragraph;
