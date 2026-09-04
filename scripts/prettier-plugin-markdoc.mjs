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
// `{% /iflang %}` reflowed against the next `{% iflang %}` stops parsing.
//
// This parser is Prettier's own Markdown parser with one step in front: a blank
// line on each side of every standalone tag line, outside code fences. Markdoc
// parses a block tag identically either way; Prettier then sees each tag line
// as a paragraph of its own and leaves it alone, wrapping only the prose
// between. The printer is Prettier's, unchanged. Idempotent: a tree already in
// this layout comes out untouched.
//
// Selected by `parser: "markdoc"` in .prettierrc's Markdown override.

import * as markdown from 'prettier/plugins/markdown';

const base = markdown.parsers.markdown;

// One tag, alone on its line. Markdoc's own rule: a tag that shares its line
// with other text is an inline tag.
const TAG_LINE = /^\s*\{%(?:(?!%\}).)*%\}\s*$/;
const FENCE = /^\s*(`{3,}|~{3,})/;

/** Put a blank line on each side of every standalone tag line, outside fences. */
export function separateBlockTags(text) {
  const lines = text.split('\n');
  const out = [];
  let fence = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const opened = FENCE.exec(line);
    if (opened) {
      if (fence === null) fence = opened[1][0];
      else if (line.trim().startsWith(fence)) fence = null;
      out.push(line);
      continue;
    }
    if (fence !== null || !TAG_LINE.test(line)) {
      out.push(line);
      continue;
    }
    if (out.length > 0 && out[out.length - 1].trim() !== '') out.push('');
    out.push(line);
    if (i + 1 < lines.length && lines[i + 1].trim() !== '') out.push('');
  }
  return out.join('\n');
}

export const parsers = {
  markdoc: {
    ...base,
    preprocess: (text, options) =>
      separateBlockTags(base.preprocess ? base.preprocess(text, options) : text)
  }
};
