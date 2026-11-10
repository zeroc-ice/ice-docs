// Copyright (c) ZeroC, Inc.
//
// A page's Markdoc tree as plain Markdown, for the Markdown copy of every page
// that lib/page-markdown.ts serves: CommonMark, with the site's tags written
// out as text. A callout is a quote that opens with its label in bold, a code
// block a fence with its title in the info string, a card a list item, the
// front page's showcase its code blocks in turn, and a heading whose anchor is
// set by hand carries it as `{#anchor}`. The page shell, the language
// switch and the rest of the chrome render nothing. A tag this file does not
// name renders its children, so a new tag's text is in the copy before this
// file knows the tag.
//
// The text is for some language mappings: one, for a mapping's copy, or every
// mapping the page is written for. An `{% iflang %}` block or span for all of
// them is unwrapped, and one for none of them is left out. Any other names its
// mappings among them: a block is a quote that opens with their names, a span
// a parenthetical that does, and a link whose target differs by mapping, as an
// `api:` link's does, is its text followed by each mapping's link. The text in
// a block or span, its links included, is for the mappings it names.

import Markdoc, { type RenderableTreeNode, type Tag } from '@markdoc/markdoc';

import {
  headingAnchor,
  headingText
} from '../markdoc/nodes/heading.markdoc.ts';
import {
  CALLOUT_LABELS,
  type CalloutType
} from '../markdoc/tags/callout.markdoc.ts';
import { languageLabel } from './docs-model/nav.ts';

export interface RenderOptions {
  /** The language mappings the text is for: one, or every mapping the page is written for. */
  languages: string[];
  /**
   * The URL to write for a link's or an image's, which arrive resolved to site
   * paths, in text for `languages`.
   */
  href: (href: string, languages: string[]) => string;
}

/** A code block of the front page's showcase, as its transform collects them. */
interface ShowcaseFence {
  language: string;
  title?: string;
  code: string;
}

interface ShowcasePanel {
  lang: string;
  contract?: ShowcaseFence;
  client?: ShowcaseFence;
  server?: ShowcaseFence;
}

/** The tags that render within a line of text; every other tag is a block. */
const INLINE = new Set([
  'em',
  'strong',
  's',
  'code',
  'sup',
  'br',
  'AppLink',
  'Image'
]);

const isTag = (node: RenderableTreeNode): node is Tag =>
  Markdoc.Tag.isTag(node);

function isInline(node: RenderableTreeNode): boolean {
  if (!isTag(node)) return true;
  if (node.name === 'LangBlock') return Boolean(node.attributes.inline);
  return INLINE.has(node.name);
}

/** The text of a code node's children. */
const codeText = (nodes: RenderableTreeNode[]) =>
  nodes.filter((node) => typeof node === 'string').join('');

/** Items as English joins them: `a, b, and c`. */
export const list = (items: string[]) =>
  new Intl.ListFormat('en').format(items);

/** Text as Markdown reads it back: the characters that would open markup are escaped. */
export const escapeText = (text: string) =>
  text.replace(/[\\`*_[\]<]/g, '\\$&');

const link = (text: string, href: string, title?: string) =>
  `[${text}](${href}${title ? ` "${title}"` : ''})`;

function longestBacktickRun(text: string): number {
  let longest = 0;
  for (const run of text.match(/`+/g) ?? [])
    longest = Math.max(longest, run.length);
  return longest;
}

function codeSpan(code: string): string {
  const ticks = '`'.repeat(longestBacktickRun(code) + 1);
  const pad = code.startsWith('`') || code.endsWith('`') ? ' ' : '';
  return `${ticks}${pad}${code}${pad}${ticks}`;
}

function fence(language: string | undefined, code: string, title?: string) {
  const body = code.replace(/\n$/, '');
  const ticks = '`'.repeat(Math.max(3, longestBacktickRun(body) + 1));
  const info = [language ?? '', title ? `title="${title}"` : '']
    .filter(Boolean)
    .join(' ');
  return `${ticks}${info}\n${body}\n${ticks}`;
}

const quote = (text: string) =>
  text
    .split('\n')
    .map((line) => (line ? `> ${line}` : '>'))
    .join('\n');

/** Indent every line after the first; a blank line stays blank. */
const indent = (text: string, by: string) =>
  text.replace(/\n(?!\n|$)/g, `\n${by}`);

const isLangBlock = (node: RenderableTreeNode): node is Tag =>
  isTag(node) && node.name === 'LangBlock';

/** The mappings of an `{% iflang %}` block that the text is for. */
const shownLanguages = (block: Tag, options: RenderOptions) =>
  (block.attributes as { langs: string[] }).langs.filter((language) =>
    options.languages.includes(language)
  );

/** Mappings' names, as a reader sees them. */
const mappingNames = (languages: string[]) =>
  list(languages.map(languageLabel));

/**
 * Whether the text differs by language mapping: the tree holds an
 * `{% iflang %}` block, authored or made by an `api:` link.
 */
export function hasLanguageBlocks(node: RenderableTreeNode): boolean {
  return (
    isTag(node) &&
    (node.name === 'LangBlock' || node.children.some(hasLanguageBlocks))
  );
}

/** A page's tree as Markdown, ending in a newline. */
export function renderMarkdown(
  tree: RenderableTreeNode,
  options: RenderOptions
): string {
  return `${renderBlock(tree, options).trim()}\n`;
}

/** Blocks one under another; inline nodes between them, if any, make a paragraph. */
function renderChildren(
  nodes: RenderableTreeNode[],
  options: RenderOptions,
  separator = '\n\n'
): string {
  const parts: string[] = [];
  let inline: RenderableTreeNode[] = [];
  const flush = () => {
    const text = renderInline(inline, options).trim();
    if (text) parts.push(text);
    inline = [];
  };
  for (const node of nodes) {
    if (isInline(node)) {
      inline.push(node);
      continue;
    }
    flush();
    const text = renderBlock(node, options);
    if (text) parts.push(text);
  }
  flush();
  return parts.join(separator);
}

function renderBlock(node: RenderableTreeNode, options: RenderOptions): string {
  if (!isTag(node)) return renderInline([node], options);
  const { name, attributes, children } = node;
  switch (name) {
    case 'p':
      return renderInline(children, options).trim();
    case 'Heading': {
      const { level, id, text } = attributes as {
        level: number;
        id: string;
        text: string;
      };
      // An anchor the text does not yield was set by hand, and links name it.
      const anchor = id === headingAnchor(text) ? '' : ` {#${id}}`;
      return `${'#'.repeat(level)} ${renderInline(children, options).trim()}${anchor}`;
    }
    case 'List':
      return renderList(node, options);
    case 'CodeBlock': {
      const { 'data-language': language, title } = attributes as {
        'data-language'?: string;
        title?: string;
      };
      return fence(language, codeText(children), title);
    }
    case 'Callout': {
      const { type, title } = attributes as {
        type: CalloutType;
        title?: string;
      };
      const body = renderChildren(children, options);
      return quote(`**${title ?? CALLOUT_LABELS[type]}**\n\n${body}`);
    }
    case 'blockquote':
      return quote(renderChildren(children, options));
    case 'hr':
      return '---';
    case 'Table':
      return renderTable(node, options);
    case 'LangBlock': {
      const shown = shownLanguages(node, options);
      if (shown.length === 0) return '';
      const body = renderChildren(children, { ...options, languages: shown });
      if (shown.length === options.languages.length) return body;
      return quote(`**${mappingNames(shown)}**\n\n${body}`);
    }
    case 'Grid':
    case 'Releases':
      return renderChildren(children, options, '\n');
    case 'Card': {
      const { title, description, href } = attributes as {
        title: string;
        description: string;
        href: string;
      };
      return `- ${link(escapeText(title), options.href(href, options.languages))}: ${escapeText(description)}`;
    }
    case 'Release': {
      const { name, date } = attributes as { name: string; date: string };
      const links = children.map((child) => renderInline([child], options));
      return `- **${escapeText(name)}** (${escapeText(date)}): ${links.join(', ')}`;
    }
    case 'Showcase': {
      const { panels } = attributes as { panels: ShowcasePanel[] };
      return renderShowcase(panels, options);
    }
    case 'Selection':
      return '';
    default:
      return renderChildren(children, options);
  }
}

function renderInline(
  nodes: RenderableTreeNode[],
  options: RenderOptions
): string {
  let text = '';
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    if (!isLangBlock(node)) {
      text += renderInlineNode(node, options);
      continue;
    }
    // Spans side by side are one run of alternatives.
    let end = i + 1;
    while (end < nodes.length && isLangBlock(nodes[end])) end++;
    const spans = (nodes.slice(i, end) as Tag[]).filter(
      (span) => shownLanguages(span, options).length > 0
    );
    text += renderAlternatives(spans, options, text);
    i = end - 1;
  }
  return text;
}

/**
 * Spans side by side, each for some of the text's mappings, appended to
 * `preceding`. When there are several and all have the same text, as an
 * `api:` link's do, the run is that text and each mapping's link; otherwise a
 * span for all the text's mappings is its text, and any other a parenthetical
 * that opens with its mappings' names.
 */
function renderAlternatives(
  spans: Tag[],
  options: RenderOptions,
  preceding: string
): string {
  const linkIn = (span: Tag) => {
    const [child] = span.children;
    return isTag(child) && child.name === 'AppLink' ? child : undefined;
  };
  const texts = spans.map((span) => headingText(span.children));
  if (spans.length > 1 && texts.every((text) => text === texts[0])) {
    const [first] = spans;
    const text = renderInline(
      linkIn(first)?.children ?? first.children,
      options
    );
    const links = spans.flatMap((span) => {
      const target = linkIn(span);
      if (!target) return [];
      const { href } = target.attributes as { href: string };
      const shown = shownLanguages(span, options);
      return [link(mappingNames(shown), options.href(href, shown))];
    });
    return `${text} (${list(links)})`;
  }
  let text = '';
  for (const span of spans) {
    const shown = shownLanguages(span, options);
    const inner = renderInline(span.children, { ...options, languages: shown });
    if (shown.length === options.languages.length) {
      text += inner;
      continue;
    }
    const before = preceding + text;
    const space = before && !/\s$/.test(before) ? ' ' : '';
    const after = /\s$/.test(inner) ? ' ' : '';
    // The punctuation that joins the span to the sentence has no place in a parenthetical.
    const aside = inner
      .trim()
      .replace(/^[,.;]\s+/, '')
      .replace(/,$/, '');
    text += `${space}(${mappingNames(shown)}: ${aside})${after}`;
  }
  return text;
}

function renderInlineNode(
  node: RenderableTreeNode,
  options: RenderOptions
): string {
  if (typeof node === 'string') return escapeText(node);
  if (!isTag(node)) return '';
  const { name, attributes, children } = node;
  const inner = () => renderInline(children, options);
  switch (name) {
    case 'em':
      return `*${inner()}*`;
    case 'strong':
      return `**${inner()}**`;
    case 's':
      return `~~${inner()}~~`;
    case 'code':
      return codeSpan(codeText(children));
    case 'sup':
      return `<sup>${inner()}</sup>`;
    case 'br':
      return '  \n';
    case 'AppLink': {
      const { href, title, unresolved } = attributes as {
        href: string;
        title?: string;
        unresolved?: boolean;
      };
      // The site shows a link to a page it lacks as its text alone.
      return unresolved
        ? inner()
        : link(inner(), options.href(href, options.languages), title);
    }
    case 'Image': {
      const {
        src,
        alt = '',
        title
      } = attributes as {
        src: string;
        alt?: string;
        title?: string;
      };
      return `!${link(escapeText(alt), options.href(src, options.languages), title)}`;
    }
    default:
      return renderBlock(node, options);
  }
}

function renderList(list: Tag, options: RenderOptions): string {
  const { ordered, start = 1 } = list.attributes as {
    ordered?: boolean;
    start?: number;
  };
  const items = list.children.filter(isTag).map((item, i) => {
    const marker = ordered ? `${start + i}.` : '-';
    // A tight item is its text, and maybe a nested list; a loose one has paragraphs.
    const loose = item.children.some(
      (child) => isTag(child) && child.name === 'p'
    );
    const body = renderChildren(item.children, options, loose ? '\n\n' : '\n');
    return `${marker} ${indent(body, ' '.repeat(marker.length + 1))}`;
  });
  return items.join(
    items.some((item) => item.includes('\n\n')) ? '\n\n' : '\n'
  );
}

function renderTable(table: Tag, options: RenderOptions): string {
  const rows = (section: string) =>
    table.children
      .filter((child): child is Tag => isTag(child) && child.name === section)
      .flatMap((part) => part.children.filter(isTag))
      .map((row) =>
        row.children.filter(isTag).map((cell) =>
          renderInline(cell.children, options)
            .replace(/\s*\n\s*/g, ' ')
            .trim()
            .replace(/\|/g, '\\|')
        )
      );
  const [header = []] = rows('thead');
  const line = (cells: string[]) => `| ${cells.join(' | ')} |`;
  return [
    line(header),
    line(header.map(() => '---')),
    ...rows('tbody').map(line)
  ].join('\n');
}

/** The showcase's code for the text's mappings, each under its name when there are several. */
function renderShowcase(
  panels: ShowcasePanel[],
  options: RenderOptions
): string {
  const { languages } = options;
  return panels
    .filter((panel) => languages.includes(panel.lang))
    .map((panel) => {
      const blocks = [panel.contract, panel.client, panel.server]
        .filter((block) => block !== undefined)
        .map((block) => fence(block.language, block.code, block.title));
      if (languages.length > 1)
        blocks.unshift(`**${languageLabel(panel.lang)}**`);
      return blocks.join('\n\n');
    })
    .join('\n\n');
}
