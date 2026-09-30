// Copyright (c) ZeroC, Inc.
//
// A Prettier parser for Markdoc: Prettier's own Markdown parser, with one step
// after it.
//
// Prettier's parser reads a `{% ... %}` tag that occupies a whole line as a
// block, as Markdoc does, and the printer keeps such a tag on its own line,
// with the blank lines around it as written. A tag that shares its line with
// text is an inline token that line filling moves like a word, so it can end
// up alone on a line; the step after the parser keeps that from happening to
// the tag that ends a paragraph.
//
// Selected by `parser: "markdoc"` in .prettierrc's Markdown override.

import type { Parser } from 'prettier';
import * as markdown from 'prettier/plugins/markdown';

interface Point {
  line: number;
  column: number;
  offset: number;
}

/** A node of the Markdown syntax tree Prettier's parser builds. */
interface MarkdownNode {
  type: string;
  value: string;
  position: { start: Point; end: Point };
  children?: MarkdownNode[];
}

const base = markdown.parsers.markdown as Parser<MarkdownNode>;

// An inline tag that closes its paragraph, written after a space, must not be
// wrapped onto a line of its own: Markdoc would read it as a block tag. The
// space moves into the tag's own span, so the printer sees one word. After a
// link, emphasis or code span the space is a text node of its own, and is
// absorbed whole, so the tag follows that node directly.
function glueTrailingTag(children: MarkdownNode[]) {
  const i = children.length - 1;
  const tag = children[i];
  const prev = children[i - 1];
  if (i < 1 || tag.type !== 'liquidNode' || prev.type !== 'text') return;
  const spaces = /[ \t]+$/.exec(prev.value);
  if (!spaces) return;
  const n = spaces[0].length;
  const glued = {
    ...tag,
    value: spaces[0] + tag.value,
    position: {
      ...tag.position,
      start: {
        ...tag.position.start,
        column: tag.position.start.column - n,
        offset: tag.position.start.offset - n
      }
    }
  };
  if (prev.value.trim() === '') {
    children.splice(i - 1, 2, glued);
    return;
  }
  children[i - 1] = {
    ...prev,
    value: prev.value.slice(0, -n),
    position: {
      ...prev.position,
      end: {
        ...prev.position.end,
        column: prev.position.end.column - n,
        offset: prev.position.end.offset - n
      }
    }
  };
  children[i] = glued;
}

export const parsers: Record<string, Parser<MarkdownNode>> = {
  markdoc: {
    ...base,
    async parse(text, options) {
      const ast = await base.parse(text, options);
      const visit = (node: MarkdownNode) => {
        if (node.type === 'paragraph' && node.children)
          glueTrailingTag(node.children);
        node.children?.forEach(visit);
      };
      visit(ast);
      return ast;
    }
  }
};
