// Copyright (c) ZeroC, Inc.

import {
  nodes,
  Tag,
  type Node,
  type Config,
  type RenderableTreeNode
} from '@markdoc/markdoc';

import type { PageVariables } from '../../lib/markdown.ts';

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
      config.variables as PageVariables;
    const children = node.transformChildren(config);
    const placed = children.flatMap((child) => placedHeadings(child));
    qualifyRepeatedIds(
      placed.filter(({ tag }) => tag.name === 'Heading'),
      languages
    );
    const headings = placed.map(({ tag, langs }): Record<string, unknown> =>
      tag.name === 'Step'
        ? { ...tag.attributes, showDividers: false, langs }
        : // The heading node already resolved its own visible text, inline
          // markup included; the outline and the anchor must agree on what it
          // says.
          { ...tag.attributes, title: tag.attributes.text ?? '', langs }
    );

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
        edit: chrome.edit,
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

/** A heading or a step, with the mappings of the {% iflang %} block around it. */
interface Placed {
  tag: Tag;
  /** Every mapping when absent. */
  langs?: string[];
}

// A heading inside an {% iflang %} block belongs to those mappings only, and
// the outline shows it only when one of them is the reader's.
function placedHeadings(
  node: RenderableTreeNode,
  langs?: string[],
  out: Placed[] = []
): Placed[] {
  if (!Tag.isTag(node)) return out;
  // The outline lists step tags alongside headings.
  if (node.name === 'Heading' || node.name === 'Step')
    out.push({ tag: node, langs });
  const inner =
    node.name === 'LangBlock' ? (node.attributes.langs as string[]) : langs;
  for (const child of node.children) placedHeadings(child, inner, out);
  return out;
}

/**
 * Give headings that share an anchor on the page a reader of some language
 * sees their parent's anchor as a prefix, as in `ice.default.host-synopsis`,
 * rewriting each tag's `id` in place. The parent is the nearest heading above,
 * at a higher level, that all of the heading's readers see; a heading without
 * one keeps its anchor.
 */
export function qualifyRepeatedIds(headings: Placed[], languages: string[]) {
  const repeated = new Set<string>();
  for (const language of languages) {
    const ids = headings
      .filter(({ langs }) => !langs || langs.includes(language))
      .map(({ tag }) => tag.attributes.id as string);
    ids.forEach((id, i) => {
      if (ids.indexOf(id) !== i) repeated.add(id);
    });
  }

  headings.forEach((heading, i) => {
    const id = heading.tag.attributes.id as string;
    const level = heading.tag.attributes.level as number;
    if (!repeated.has(id)) return;
    const readers = heading.langs ?? languages;
    const parent = headings
      .slice(0, i)
      .findLast(
        ({ tag, langs }) =>
          (tag.attributes.level as number) < level &&
          (!langs || readers.every((language) => langs.includes(language)))
      );
    if (parent) heading.tag.attributes.id = `${parent.tag.attributes.id}-${id}`;
  });
}

export default document;
