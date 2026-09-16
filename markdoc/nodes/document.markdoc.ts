// Copyright (c) ZeroC, Inc.

import { nodes, Tag, type Node, type Config } from '@markdoc/markdoc';

// The document node renders the page shell. Everything the shell needs that the
// markdown itself does not know — the breadcrumb trail, the previous/next
// pages — is passed in through `config.variables.chrome` by the
// route, so the shell stays a single wrapper instead of a second layout layer.
const document = {
  ...nodes.document,
  render: 'Document',
  attributes: nodes.document.attributes,
  transform(node: Node, config: Config) {
    const frontmatter = config.variables?.frontmatter ?? {};
    const chrome = config.variables?.chrome ?? {};
    const path = config.variables?.path;
    const children = node.transformChildren(config) ?? [];
    const headings = children.map((child) => extractHeadings(child, [])).flat();

    return new Tag(
      `${this.render}`,
      {
        title: frontmatter.title,
        description: frontmatter.description,
        // Diátaxis form of this page, when its frontmatter declares one.
        type: frontmatter.type,
        // How the body is laid out, when it is not ordinary prose.
        shape: frontmatter.shape ?? chrome.shape,
        headings,
        path,
        breadcrumbs: chrome.breadcrumbs,
        prev: chrome.prev,
        next: chrome.next,
        readingTime:
          frontmatter.showReadingTime !== false
            ? config.variables?.readingTime
            : undefined,
        showAside: frontmatter.showAside,
        showReadingTime: frontmatter.showReadingTime,
        showDividers: frontmatter.showDividers,
        showNavigation: frontmatter.showNavigation
      },
      children
    );
  }
};

function extractHeadings(node: any, sections: any[] = []) {
  // Nodes can be null (e.g. an {% iflang %} that renders nothing for this language).
  if (!node) return sections;
  // Add headings from step tags
  if ((node as Tag).name === 'Step') {
    sections.push({
      ...node.attributes,
      showDividers: false
    });
  }

  if (node) {
    if (node.name === 'Heading') {
      // The heading node already resolved its own visible text, inline markup
      // included; the outline and the anchor must agree on what it says.
      sections.push({ ...node.attributes, title: node.attributes.text ?? '' });
    }

    if (node.children) {
      for (const child of node.children) {
        extractHeadings(child, sections);
      }
    }
  }

  return sections;
}

export default document;
