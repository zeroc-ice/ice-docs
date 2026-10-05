// Copyright (c) ZeroC, Inc.
//
// Pure, framework-free core of the Ice docs content model. No filesystem or
// Next.js dependency: callers inject a file reader, so this is unit-testable
// with `node lib/docs-model/resolve.test.ts`.
//
//  - extractSnippet: pull a named fragment from a source file, delimited by
//    plain-comment markers (`//`, `#`, `%` + `<name>`/`</name>`) that are valid
//    in every Ice language (no C#-specific `#region`).
//  - parseLanguageSections / resolveLanguageSections: fill a shared page's
//    `{% language-section %}` slots with every language overlay's answer, each
//    wrapped in `{% iflang %}` so the page carries all the mappings at once.
//  - inlineSnippets: replace `{% snippet file= name= /%}` tags with fenced code.
//  - resolveDocument: compose the above into a final Markdoc/markdown string.

// ---------------------------------------------------------------------------
// Fragment markers
// ---------------------------------------------------------------------------

/** Line-comment leaders recognized in fragment markers, across all Ice languages. */
const COMMENT_LEADERS = ['//', '#', '%'];

const LEADER_ALT = COMMENT_LEADERS.map((l) =>
  l.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
).join('|');

// A marker line: optional indent, a comment leader, optional space, then
// `<name>` (open) or `</name>` (close), and nothing else.
const MARKER_RE = new RegExp(
  `^\\s*(?:${LEADER_ALT})\\s*<(/?)([A-Za-z0-9._-]+)>\\s*$`
);

export interface Marker {
  name: string;
  close: boolean;
}

/** Parse a line as a fragment marker, or return null if it is not one. */
export function parseMarker(line: string): Marker | null {
  const m = MARKER_RE.exec(line);
  return m ? { name: m[2], close: m[1] === '/' } : null;
}

/** Remove the common leading indentation shared by all non-blank lines. */
export function dedent(lines: string[]): string[] {
  const indents = lines
    .filter((l) => l.trim().length > 0)
    .map((l) => /^[ \t]*/.exec(l)![0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((l) => l.slice(min));
}

function trimBlankEdges(lines: string[]): string[] {
  let a = 0;
  let b = lines.length;
  while (a < b && lines[a].trim() === '') a++;
  while (b > a && lines[b - 1].trim() === '') b--;
  return lines.slice(a, b);
}

/**
 * Extract the fragment named `name` from `source`. The opening/closing marker
 * lines, and any other marker lines inside the fragment, are removed; the result
 * is dedented and stripped of leading/trailing blank lines. Throws if the
 * fragment is missing or unterminated.
 */
export function extractSnippet(source: string, name: string): string {
  const lines = source.split('\n');
  let start = -1;
  let end = -1;
  for (let i = 0; i < lines.length; i++) {
    const marker = parseMarker(lines[i]);
    if (!marker || marker.name !== name) continue;
    if (!marker.close && start === -1) start = i;
    else if (marker.close && start !== -1) {
      end = i;
      break;
    }
  }
  if (start === -1) throw new Error(`snippet "${name}" not found`);
  if (end === -1) throw new Error(`snippet "${name}" is not closed`);

  const body = lines
    .slice(start + 1, end)
    .filter((l) => parseMarker(l) === null); // strip any nested markers
  return trimBlankEdges(dedent(body)).join('\n');
}

// ---------------------------------------------------------------------------
// Markdoc-style tag scanning
// ---------------------------------------------------------------------------

interface Tag {
  name: string;
  attrs: string;
  close: boolean;
  index: number;
  length: number;
}

// Matches `{% name ... %}`, `{% name ... /%}`, and `{% /name %}`. The attrs may
// contain slashes (e.g. file paths); the optional self-closing slash is the one
// immediately before `%}`.
const TAG_RE = /\{%\s*(\/)?\s*([a-zA-Z-]+)([\s\S]*?)(\/)?\s*%\}/g;

function* iterTags(s: string): Generator<Tag> {
  TAG_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = TAG_RE.exec(s)) !== null) {
    yield {
      close: !!m[1],
      name: m[2],
      attrs: m[3] ?? '',
      index: m.index,
      length: m[0].length
    };
  }
}

/** Read a `key="value"` / `key='value'` / `key=value` attribute, or null. */
export function getAttr(attrs: string, key: string): string | null {
  const re = new RegExp(
    `\\b${key}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s/%]+))`
  );
  const m = re.exec(attrs);
  if (!m) return null;
  return m[1] ?? m[2] ?? m[3] ?? null;
}

function isSelfClosing(s: string, tag: Tag): boolean {
  // The character before the closing `%}` is `/` for a self-closing tag.
  const raw = s.slice(tag.index, tag.index + tag.length);
  return /\/\s*%\}$/.test(raw);
}

// ---------------------------------------------------------------------------
// Frontmatter
// ---------------------------------------------------------------------------

/**
 * The leading `---` block of a markdown document.
 *
 * `\r?\n`, not `\n`. `.gitattributes` normalizes the repository to LF and checks
 * files out with the platform's convention, so the content tree is CRLF on
 * Windows and LF elsewhere. An LF-only pattern does not fail loudly here — it
 * simply matches nothing, and every field silently reads as absent. That cost
 * the search index 346 of 348 page titles and disabled every `id:` link alias.
 * Anything that parses page text belongs behind this constant.
 */
const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*\r?\n?/;

/** Split lines without caring which convention the file was checked out with. */
export const splitLines = (text: string): string[] => text.split(/\r?\n/);

/** Split a markdown document into its YAML frontmatter block and body. */
export function splitFrontmatter(md: string): {
  frontmatter: string;
  body: string;
} {
  const m = FRONTMATTER_RE.exec(md);
  return m
    ? { frontmatter: m[1], body: md.slice(m[0].length) }
    : { frontmatter: '', body: md };
}

// ---------------------------------------------------------------------------
// language-section resolution
// ---------------------------------------------------------------------------

/**
 * An overlay's sections by slot name: the prose it adds to each slot its
 * shared page declares. A slot the overlay leaves out gets nothing from that
 * language. Throws on a section with no prose, a self-closing section, one
 * defined twice, or one not closed.
 */
export function parseLanguageSections(
  overlayBody: string
): Map<string, string> {
  const out = new Map<string, string>();
  let open: { name: string; end: number } | null = null;

  for (const t of iterTags(overlayBody)) {
    if (t.name !== 'language-section') continue;

    if (t.close) {
      if (open === null) throw new Error('unmatched {% /language-section %}');
      const content = overlayBody.slice(open.end, t.index).trim();
      if (!content)
        throw new Error(
          `language-section "${open.name}" is empty; leave it out when the mapping adds nothing`
        );
      if (out.has(open.name))
        throw new Error(`duplicate language-section "${open.name}"`);
      out.set(open.name, content);
      open = null;
      continue;
    }

    const name = getAttr(t.attrs, 'name');
    if (!name) throw new Error('language-section is missing a name');
    if (isSelfClosing(overlayBody, t))
      throw new Error(
        `language-section "${name}" in an overlay must hold prose; leave it out when the mapping adds nothing`
      );
    if (open !== null)
      throw new Error(`nested language-section inside "${open.name}"`);
    open = { name, end: t.index + t.length };
  }

  if (open !== null)
    throw new Error(`language-section "${open.name}" is not closed`);
  return out;
}

/** One `{% iflang %}` block: `text`, shown to readers of `langs`. */
function languageBlock(langs: string[], text: string): string {
  return `{% iflang langs="${langs.join(',')}" %}\n\n${text}\n\n{% /iflang %}`;
}

/**
 * Fill each `{% language-section name="x" /%}` slot in a shared body with every
 * language's section. Languages whose sections read the same share one
 * `{% iflang %}` block, so a page carries each distinct answer once; a language
 * that leaves the slot out adds nothing to it.
 */
export function resolveLanguageSections(
  sharedBody: string,
  sections: Map<string, Map<string, string>>
): string {
  let result = '';
  let last = 0;
  for (const t of iterTags(sharedBody)) {
    if (t.name !== 'language-section') continue;
    if (t.close || !isSelfClosing(sharedBody, t)) {
      throw new Error(
        'shared pages must use self-closing {% language-section name="…" /%} slots'
      );
    }
    const name = getAttr(t.attrs, 'name');
    if (!name) throw new Error('language-section slot is missing a name');
    result += sharedBody.slice(last, t.index);

    const byText = new Map<string, string[]>();
    for (const [language, slots] of sections) {
      const text = slots.get(name);
      if (text) byText.set(text, [...(byText.get(text) ?? []), language]);
    }
    result += [...byText]
      .map(([text, langs]) => languageBlock(langs, text))
      .join('\n\n');

    last = t.index + t.length;
  }
  return result + sharedBody.slice(last);
}

/** Every slot a shared page declares, in order. */
export function declaredSlots(sharedBody: string): string[] {
  const out: string[] = [];
  for (const t of iterTags(sharedBody)) {
    if (
      t.name !== 'language-section' ||
      t.close ||
      !isSelfClosing(sharedBody, t)
    )
      continue;
    const name = getAttr(t.attrs, 'name');
    if (name) out.push(name);
  }
  return out;
}

// ---------------------------------------------------------------------------
// snippet inlining
// ---------------------------------------------------------------------------

const EXT_LANG: Record<string, string> = {
  cs: 'csharp',
  cpp: 'cpp',
  cc: 'cpp',
  cxx: 'cpp',
  h: 'cpp',
  hpp: 'cpp',
  py: 'python',
  java: 'java',
  js: 'javascript',
  mjs: 'javascript',
  ts: 'typescript',
  swift: 'swift',
  m: 'matlab',
  php: 'php',
  rb: 'ruby',
  slice: 'slice',
  proto: 'protobuf'
};

/** Infer a fenced-code language token from a file extension. */
export function langForFile(file: string): string {
  const dot = file.lastIndexOf('.');
  const ext = dot === -1 ? '' : file.slice(dot + 1).toLowerCase();
  return EXT_LANG[ext] ?? '';
}

/** Replace every `{% snippet file="…" name="…" [lang="…"] /%}` with a fenced code block. */
export function inlineSnippets(
  md: string,
  readFile: (file: string) => string
): string {
  let result = '';
  let last = 0;
  for (const t of iterTags(md)) {
    if (t.name !== 'snippet') continue;
    const file = getAttr(t.attrs, 'file');
    const name = getAttr(t.attrs, 'name');
    if (!file || !name)
      throw new Error('snippet requires both file= and name=');
    const lang = getAttr(t.attrs, 'lang') || langForFile(file);
    const fragment = extractSnippet(readFile(file), name);
    result += md.slice(last, t.index);
    result += '```' + lang + '\n' + fragment + '\n```';
    last = t.index + t.length;
  }
  return result + md.slice(last);
}

// ---------------------------------------------------------------------------
// Top-level composition
// ---------------------------------------------------------------------------

export interface DocumentInput {
  /** Shared, language-neutral page markdown (empty for a page written per language). */
  shared: string;
  /** Language overlay markdown by language. */
  overlays: Record<string, string>;
  /** Reader for snippet source files. */
  readFile: (file: string) => string;
}

/**
 * Produce the final Markdoc/markdown body for one page, every language in it:
 * fill the shared page's language-section slots from the overlays, then inline
 * all snippets. Without a shared page, the overlays are the page: each is the
 * whole page for its language.
 */
export function resolveDocument(input: DocumentInput): string {
  const { shared, overlays, readFile } = input;
  const languages = Object.keys(overlays);

  if (!shared) {
    const body = languages
      .map((language) =>
        languageBlock(
          [language],
          splitFrontmatter(overlays[language]).body.trim()
        )
      )
      .join('\n\n');
    return inlineSnippets(body, readFile);
  }

  const sections = new Map(
    languages.map((language) => [
      language,
      parseLanguageSections(splitFrontmatter(overlays[language]).body)
    ])
  );
  const merged = resolveLanguageSections(
    splitFrontmatter(shared).body,
    sections
  );
  return inlineSnippets(merged, readFile);
}
