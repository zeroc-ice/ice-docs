// Copyright (c) ZeroC, Inc.
//
// A Prettier parser for Markdoc: Markdown whose `{% tag %}` lines stay out of
// the paragraphs around them.
//
// Prettier parses `{% ... %}` as an inline Liquid token and never edits its
// contents, which is why it cannot break inside a tag. But it has no block form
// of that token: a tag alone on a line is, to Prettier, the first word of the
// paragraph under it, and `proseWrap: always` reflows the two onto shared
// lines. Markdoc then reads the tag as an inline tag inside a paragraph, and a
// `{% /iflang %}` reflowed against the next `{% iflang %}` no longer parses.
//
// This parser is Prettier's own Markdown parser with one step after it: in the
// syntax tree, every paragraph is split at each tag that occupies a whole line,
// so the tag becomes a paragraph of its own. Prettier's printer, unchanged,
// then prints it verbatim on its own line and wraps only the prose around it,
// with a blank line on each side, or none inside a tight list item, which
// Markdoc reads the same way. Working on the tree rather than the text means
// code fences, indented code, frontmatter, block quotes and nested lists are
// already what they are, and a tag that spans several lines is one token.
//
// The two parsers disagree on what follows a tag line, and that is settled
// here where it can be. A tag under a list item, indented less than the item's
// content, is a lazy continuation of the item to Prettier's parser and a new
// block that ends the list to Markdoc; the same for a tag under a quoted line
// without the `>`. Such a tag, and what follows it, is moved out after the
// container, which is split in two if items follow. A numbered item written
// right under a tag is a list to Markdoc and prose to Prettier, which would
// fold it into one line; that is an error here, since a blank line is the only
// fix. And an inline closing tag written after a space at the end of a
// paragraph is glued to the word before it, so that line filling never leaves
// it alone on a line, where Markdoc would read it as a block tag.
//
// Selected by `parser: "markdoc"` in .prettierrc's Markdown override.

import * as markdown from 'prettier/plugins/markdown';

const base = markdown.parsers.markdown;

// A tag on its own line: nothing but a line break, or the paragraph's edge, on
// either side of it. Markdoc's own rule — a tag that shares its line with text
// is an inline tag.
function ownsItsLine(children, i, source) {
  const prev = children[i - 1];
  const next = children[i + 1];
  const before =
    !prev ||
    isSpaceBreak(prev, source) ||
    (prev.type === 'text' && prev.value.endsWith('\n'));
  const after = !next || (next.type === 'text' && next.value.startsWith('\n'));
  return before && after;
}

// A hard break written as two trailing spaces ends the line before a tag as
// surely as a newline, and means nothing at a paragraph's end. The backslash
// form is different: at a paragraph's end Markdoc keeps it as a literal
// backslash, so it is left alone and the tag after it is not split off.
const isSpaceBreak = (node, source) =>
  node.type === 'break' && /\s/.test(source[node.position.start.offset]);

// A numbered item cannot interrupt a paragraph in CommonMark unless it starts
// at 1, so Prettier's parser reads `2. second` under a tag line as prose and
// would fold it into one line, while Markdoc reads a list. Nothing but a
// blank line tells the two apart, so ask for one.
function rejectNumberedItem(node) {
  const item = /^(\d+)[.)][ \t]/.exec(node.value);
  if (item && item[1] !== '1') {
    const { line } = node.position.start;
    throw new SyntaxError(
      `Line ${line}: a numbered list under a tag needs a blank line between ` +
        `them; Markdoc reads a list here and Prettier reads prose.`
    );
  }
}

// Positions matter to the printer, so a trimmed text node keeps an exact one.
function withoutTrailingNewline(node, source) {
  const end = node.position.end.offset - 1;
  const lineStart = source.lastIndexOf('\n', end - 1) + 1;
  return {
    ...node,
    value: node.value.slice(0, -1),
    position: {
      ...node.position,
      end: {
        line: node.position.end.line - 1,
        column: end - lineStart + 1,
        offset: end
      }
    }
  };
}

// The text resumes on the next line, after that line's indentation or `>`
// prefix, which the parser strips from the value but which the source has.
function withoutLeadingNewline(node, source) {
  const { start } = node.position;
  const lineStart = start.offset + 1;
  let offset = lineStart;
  while (offset < source.length && /[ \t>]/.test(source[offset])) offset++;
  return {
    ...node,
    value: node.value.slice(1),
    position: {
      ...node.position,
      start: { line: start.line + 1, column: offset - lineStart + 1, offset }
    }
  };
}

function paragraph(children) {
  return {
    type: 'paragraph',
    children,
    position: {
      start: children[0].position.start,
      end: children[children.length - 1].position.end
    }
  };
}

/** The paragraphs one paragraph becomes, or null when no tag owns a line. */
function split(node, source) {
  const { children } = node;
  if (
    !children.some(
      (c, i) => c.type === 'liquidNode' && ownsItsLine(children, i, source)
    )
  )
    return null;
  const groups = [];
  let current = [];
  let trimLeading = false;
  const flush = () => {
    if (current.length === 0) return;
    if (isSpaceBreak(current[current.length - 1], source)) current.pop();
    const last = current[current.length - 1];
    if (last?.type === 'text' && last.value.endsWith('\n')) {
      const trimmed = withoutTrailingNewline(last, source);
      current[current.length - 1] = trimmed;
      if (trimmed.value === '') current.pop();
    }
    if (current.length > 0) groups.push(current);
    current = [];
  };
  children.forEach((child, i) => {
    if (child.type === 'liquidNode' && ownsItsLine(children, i, source)) {
      flush();
      groups.push([child]);
      trimLeading = true;
      return;
    }
    let node = child;
    if (trimLeading) {
      trimLeading = false;
      if (node.type === 'text' && node.value.startsWith('\n')) {
        node = withoutLeadingNewline(node, source);
        if (node.value === '') return;
        rejectNumberedItem(node);
      }
    }
    current.push(node);
  });
  flush();
  return groups.map(paragraph);
}

// A paragraph of a list item that starts left of the item's content column —
// the column of its first child, on the marker line — or one in a block quote
// whose first line carries no `>`, came from lazy continuation lines.
function isLazyIn(container, node, source) {
  if (node.type !== 'paragraph') return false;
  const { offset, column } = node.children[0].position.start;
  if (container.type === 'blockquote') {
    const lineStart = source.lastIndexOf('\n', offset - 1) + 1;
    return !source.slice(lineStart, offset).includes('>');
  }
  return column < container.children[0].position.start.column;
}

function spanning(container, children) {
  const start = children[0].position.start;
  const end = children[children.length - 1].position.end;
  return { ...container, children, position: { start, end } };
}

// A list item keeps its marker, which sits before its first child.
function shortened(item, children) {
  const end = children[children.length - 1].position.end;
  return { ...item, children, position: { ...item.position, end } };
}

// An ordered list that continues after the hoisted tag restarts at the number
// its first item carries in the source, as Markdoc reads it.
function withStart(list, source) {
  if (!list.ordered) return list;
  const digits = /^\s*(\d+)/.exec(
    source.slice(list.children[0].position.start.offset)
  );
  return digits ? { ...list, start: Number(digits[1]) } : list;
}

/** The nodes a list or block quote becomes once its lazy tags are hoisted. */
function hoistLazy(container, source) {
  const out = [];
  let members = [];
  const close = () => {
    if (members.length > 0)
      out.push(withStart(spanning(container, members), source));
    members = [];
  };
  for (const member of container.children) {
    if (container.type === 'list') {
      const at = member.children.findIndex(
        (c, i) => i > 0 && isLazyIn(member, c, source)
      );
      if (at === -1) {
        members.push(member);
        continue;
      }
      if (at > 0) members.push(shortened(member, member.children.slice(0, at)));
      close();
      out.push(...member.children.slice(at));
    } else if (isLazyIn(container, member, source)) {
      close();
      out.push(member);
    } else {
      members.push(member);
    }
  }
  close();
  return out;
}

// An inline tag that closes its paragraph, written after a space, must not be
// wrapped onto a line of its own: Markdoc would read it as a block tag. The
// space moves into the tag's own span, so the printer sees one word. After a
// link, emphasis or code span the space is a text node of its own, and is
// absorbed whole, so the tag follows that node directly.
function glueTrailingTag(node) {
  const { children } = node;
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

/** Split paragraphs throughout the tree, in place. */
export function separateBlockTags(ast, source) {
  const visit = (node) => {
    if (!Array.isArray(node.children)) return;
    node.children = node.children.flatMap((child) => {
      visit(child);
      if (child.type === 'paragraph') {
        const parts = split(child, source) ?? [child];
        parts.forEach(glueTrailingTag);
        return parts;
      }
      if (child.type === 'list' || child.type === 'blockquote')
        return hoistLazy(child, source);
      return [child];
    });
  };
  visit(ast);
  return ast;
}

export const parsers = {
  markdoc: {
    ...base,
    async parse(text, options) {
      return separateBlockTags(await base.parse(text, options), text);
    }
  }
};
