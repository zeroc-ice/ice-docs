// Copyright (c) ZeroC, Inc.

import type { TokenStream } from 'prismjs';

import Prism from './prism-languages.ts';
import { tokenStyle } from './prism-theme.ts';

interface Run {
  /** The inline style, or '' for text in the block's own colour. */
  style: string;
  text: string;
}

/**
 * `code` highlighted as the HTML of its lines, one `<div>` each. Adjacent
 * tokens of one style share a `<span>`, and text in the block's own colour has
 * none. Code in a language Prism has no grammar for comes back as plain text.
 */
export function highlight(code: string, language: string): string {
  const lines: Run[][] = [[]];

  const add = (text: string, style: string) =>
    text.split('\n').forEach((part, i) => {
      if (i > 0) lines.push([]);
      const line = lines[lines.length - 1];
      const last = line.at(-1);
      if (last?.style === style) last.text += part;
      else if (part) line.push({ style, text: part });
    });

  // `types` are the types of the tokens `stream` is nested in, outermost first.
  const walk = (stream: TokenStream, types: string[]) => {
    if (typeof stream === 'string') {
      add(stream, tokenStyle(types));
    } else if (Array.isArray(stream)) {
      for (const token of stream) walk(token, types);
    } else {
      walk(stream.content, types.concat(stream.type, stream.alias ?? []));
    }
  };

  const grammar = Prism.languages[language];
  walk(grammar ? Prism.tokenize(code, grammar) : code, []);

  // An empty line holds a newline, which gives it the height of a line.
  return lines
    .map((line) => `<div>${line.map(runHtml).join('') || '\n'}</div>`)
    .join('');
}

function runHtml({ style, text }: Run): string {
  const html = text.replaceAll('&', '&amp;').replaceAll('<', '&lt;');
  return style ? `<span style="${style}">${html}</span>` : html;
}
