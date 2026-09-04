// Copyright (c) ZeroC, Inc.

import { Tag, nodes, type Config, type Node } from '@markdoc/markdoc';

const WIDE_DIAGRAM_MARKER = '#diagram-wide';

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
      let hasWideDiagram = false;

      for (const image of images) {
        const src = image.attributes.src;
        const isWideDiagram =
          typeof src === 'string' && src.endsWith(WIDE_DIAGRAM_MARKER);

        if (isWideDiagram) {
          image.attributes.src = src.slice(0, -WIDE_DIAGRAM_MARKER.length);
          hasWideDiagram = true;
        }

        image.attributes.class = isWideDiagram
          ? 'figure diagram-wide'
          : 'figure';
      }

      if (hasWideDiagram) {
        attributes.class = [attributes.class, 'doc-wide diagram-scroll']
          .filter(Boolean)
          .join(' ');
        attributes.role = 'region';
        attributes['aria-label'] = 'Scrollable diagram';
        attributes.tabIndex = 0;
      }
    }
    return new Tag('p', attributes, children);
  }
};

export default paragraph;
