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
    const { frontmatter, chrome, path, readingTime, languages } =
      config.variables!;
    const children = node.transformChildren(config);
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
        pagination: chrome.pagination,
        readingTime:
          frontmatter.showReadingTime !== false ? readingTime : undefined,
        languages,
        writtenFor: chrome.writtenFor,
        showAside: frontmatter.showAside,
        showReadingTime: frontmatter.showReadingTime,
        showDividers: frontmatter.showDividers,
        showNavigation: frontmatter.showNavigation
      },
      children
    );
  }
};

// A heading inside an {% iflang %} block belongs to those mappings only, and
// the outline shows it only when one of them is the reader's.
function extractHeadings(node: any, sections: any[] = [], langs?: string[]) {
  // Add headings from step tags
  if ((node as Tag).name === 'Step') {
    sections.push({
      ...node.attributes,
      showDividers: false,
      langs
    });
  }

  if (node.name === 'Heading') {
    // The heading node already resolved its own visible text, inline markup
    // included; the outline and the anchor must agree on what it says.
    sections.push({
      ...node.attributes,
      title: node.attributes.text ?? '',
      langs
    });
  }

  const inner = node.name === 'LangBlock' ? node.attributes.langs : langs;
  if (node.children) {
    for (const child of node.children) {
      extractHeadings(child, sections, inner);
    }
  }

  return sections;
}

export default document;
