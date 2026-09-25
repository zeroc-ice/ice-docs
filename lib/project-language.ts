// Copyright (c) ZeroC, Inc.

const IFLANG_TAG_RE = /\{%\s*(?:iflang\s+langs="([^"]*)"|\/iflang)\s*%\}/g;

/** Select the Markdown visible to a language, including restrictions imposed by enclosing blocks. */
export function projectLanguage(source: string, language: string): string {
  const visible = [true];
  const parts: string[] = [];
  let offset = 0;
  for (const match of source.matchAll(IFLANG_TAG_RE)) {
    if (visible.at(-1)) parts.push(source.slice(offset, match.index));
    if (match[1] !== undefined) {
      visible.push(
        visible.at(-1)! &&
          match[1].split(',').some((name) => name.trim() === language)
      );
    } else {
      visible.pop();
    }
    offset = match.index + match[0].length;
  }
  if (visible.at(-1)) parts.push(source.slice(offset));
  return parts.join('');
}
