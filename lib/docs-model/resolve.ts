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

/**
 * The page template renders the frontmatter title as the page's `h1`, so a body
 * that opens by repeating that same title would show it twice. Drop the leading
 * `# Title` only when it matches; a *different* opening heading is a real
 * section heading and is left alone.
 */
export function stripRedundantTitle(body: string, title?: string): string {
  if (!title) return body;
  const normalized = title.trim().toLowerCase();
  return body.replace(/^\s*#\s+(.+?)\s*(?:\n|$)/, (match, heading: string) =>
    heading.trim().toLowerCase() === normalized ? '' : match
  );
}

/**
 * Push every heading down one level when the body still contains an `h1`.
 *
 * The page title is the page's one `h1`. Pages converted from Confluence open
 * their sections at `#`, which would give a page two competing top-level
 * headings and leave those sections out of the "On this page" list (it lists
 * `h2`/`h3`). Heading anchors are derived from the text, not the level, so
 * demoting does not change any existing link target.
 */
export function demoteHeadings(body: string): string {
  const lines = body.split('\n');
  const code = fencedLines(lines);
  if (!lines.some((line, i) => !code[i] && /^#\s+\S/.test(line))) return body;

  return lines
    .map((line, i) =>
      code[i]
        ? line
        : // `###### ` is already the deepest level markdown has.
          line.replace(/^(#{1,5})(\s+\S)/, '#$1$2')
    )
    .join('\n');
}

/**
 * Mark the lines that are inside a fenced code block.
 *
 * A fence closes only on the same character, at least as long as the one that
 * opened it, so a ``` example nested inside a ```` block does not end it.
 */
function fencedLines(lines: string[]): boolean[] {
  const out = new Array<boolean>(lines.length).fill(false);
  let open: { char: string; length: number } | null = null;
  for (let i = 0; i < lines.length; i++) {
    const fence = /^\s{0,3}(`{3,}|~{3,})/.exec(lines[i]);
    if (fence) {
      const [char, length] = [fence[1][0], fence[1].length];
      if (!open) open = { char, length };
      else if (char === open.char && length >= open.length) open = null;
      out[i] = true; // the delimiter line itself is never a heading
      continue;
    }
    out[i] = open !== null;
  }
  return out;
}

// ---------------------------------------------------------------------------
// language-section resolution
// ---------------------------------------------------------------------------

/**
 * What an overlay says about one of a shared page's slots.
 *
 * A blank section used to mean three different things and the reader could not
 * tell which: the mapping genuinely adds nothing here, the mapping cannot do
 * this at all, or nobody has written it yet. 462 of the corpus's 1,035 slots are
 * blank, concentrated in the thin mappings, so the difference matters. Each
 * overlay now says which one it means:
 *
 *   {% language-section name="mapping" %}real prose{% /language-section %}
 *   {% language-section name="mapping" state="no-addition" /%}
 *   {% language-section name="mapping" state="not-applicable"
 *      note="MATLAB has no server-side dispatch." /%}
 *
 * `unclassified` is what a blank section with no state resolves to. It is not a
 * legal end state — `npm run check:content` counts them and refuses to let the
 * number grow.
 */
export type SlotState =
  'content' | 'no-addition' | 'not-applicable' | 'unclassified';

export const SLOT_STATES: readonly SlotState[] = [
  'content',
  'no-addition',
  'not-applicable',
  'unclassified'
];

export interface LanguageSlot {
  name: string;
  state: SlotState;
  /** The overlay's prose. Empty for every state except `content`. */
  content: string;
  /** Why the feature is absent. Required when the state is `not-applicable`. */
  note?: string;
}

/** Extract the named `{% language-section %}` blocks from an overlay body. */
export function parseLanguageSections(
  overlayBody: string
): Map<string, LanguageSlot> {
  const out = new Map<string, LanguageSlot>();
  let open: {
    name: string;
    end: number;
    state: string | null;
    note: string | null;
  } | null = null;

  const add = (slot: LanguageSlot) => {
    if (out.has(slot.name)) {
      throw new Error(`duplicate language-section "${slot.name}"`);
    }
    out.set(slot.name, slot);
  };

  for (const t of iterTags(overlayBody)) {
    if (t.name !== 'language-section') continue;

    if (t.close) {
      if (open === null) throw new Error('unmatched {% /language-section %}');
      add(
        slotFrom(
          open.name,
          overlayBody.slice(open.end, t.index).trim(),
          open.state,
          open.note
        )
      );
      open = null;
      continue;
    }

    const name = getAttr(t.attrs, 'name');
    if (!name) throw new Error('language-section is missing a name');
    const state = getAttr(t.attrs, 'state');
    const note = getAttr(t.attrs, 'note');

    // A self-closing section in an *overlay* declares a state and has no body.
    if (isSelfClosing(overlayBody, t)) {
      if (!state) {
        throw new Error(
          `language-section "${name}" is self-closing and must declare state="no-addition" or state="not-applicable"`
        );
      }
      add(slotFrom(name, '', state, note));
      continue;
    }

    if (open !== null)
      throw new Error(`nested language-section inside "${open.name}"`);
    open = { name, end: t.index + t.length, state, note };
  }

  if (open !== null)
    throw new Error(`language-section "${open.name}" is not closed`);
  return out;
}

function slotFrom(
  name: string,
  content: string,
  state: string | null,
  note: string | null
): LanguageSlot {
  if (state) {
    if (state !== 'no-addition' && state !== 'not-applicable') {
      throw new Error(
        `language-section "${name}" has state="${state}"; expected "no-addition" or "not-applicable"`
      );
    }
    if (content) {
      throw new Error(
        `language-section "${name}" declares state="${state}" but also has content`
      );
    }
    if (state === 'not-applicable' && !note) {
      throw new Error(
        `language-section "${name}" is not-applicable and must explain why with note="…"`
      );
    }
    return { name, state, content: '', ...(note ? { note } : {}) };
  }
  return content
    ? { name, state: 'content', content }
    : { name, state: 'unclassified', content: '' };
}

/** What one language's answer to a slot renders as; empty when it renders nothing. */
function slotText(name: string, slot: LanguageSlot | undefined): string {
  if (!slot)
    throw new Error(`no overlay content for language-section "${name}"`);
  if (slot.state === 'content') return slot.content;
  if (slot.state === 'not-applicable') {
    // The reader is told, rather than shown a silent gap where the other
    // mappings have prose.
    return `{% callout type="note" %}\n${slot.note}\n{% /callout %}`;
  }
  // `no-addition`, and a blank slot not yet classified, render nothing: the
  // shared prose already covers it.
  return '';
}

/** One `{% iflang %}` block: `text`, shown to readers of `langs`. */
function languageBlock(langs: string[], text: string): string {
  return `{% iflang langs="${langs.join(',')}" %}\n\n${text}\n\n{% /iflang %}`;
}

/**
 * Fill each `{% language-section name="x" /%}` slot in a shared body with every
 * language's section. Languages whose sections read the same share one
 * `{% iflang %}` block, so a page carries each distinct answer once.
 */
export function resolveLanguageSections(
  sharedBody: string,
  sections: Map<string, Map<string, LanguageSlot>>
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
      const text = slotText(name, slots.get(name));
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
