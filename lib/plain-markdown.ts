// Copyright (c) ZeroC, Inc.
//
// A page's Markdoc tree as plain Markdown, for the Markdown copy of every page
// that lib/page-markdown.ts serves: CommonMark, with the site's tags written
// out as text. A callout is a quote that opens with its label in bold, a code
// block a fence with its title in the info string, a card a list item, the
// front page's showcase its code blocks in turn. The page shell, the language
// switch and the rest of the chrome render nothing. A tag this file does not
// name renders its children, so a new tag's text is in the copy before this
// file knows the tag.
//
// Rendered for one language mapping, the text is what a reader of that mapping
// sees: an `{% iflang %}` block for other mappings is left out, and one for
// that mapping is unwrapped.

import Markdoc, { type RenderableTreeNode, type Tag } from '@markdoc/markdoc';

import {
  CALLOUT_LABELS,
  type CalloutType
} from '../markdoc/tags/callout.markdoc.ts';
import { languageLabel } from './docs-model/nav.ts';

export interface RenderOptions {
  /** The language mapping the text is for; absent, every mapping's text is in it. */
  language?: string;
  /** The URL to write for a link's or an image's, which arrive resolved to site paths. */
  href: (href: string) => string;
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

/** Text as Markdown reads it back: the characters that would open markup are escaped. */
const escape = (text: string) => text.replace(/[\\`*_[\]<]/g, '\\$&');

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

/** Whether an `{% iflang %}` block's text is in the rendering: for its mappings, or for every mapping. */
function shows(block: Tag, options: RenderOptions): boolean {
  const { langs } = block.attributes as { langs: string[] };
  return options.language === undefined || langs.includes(options.language);
}

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
      const { level } = attributes as { level: number };
      return `${'#'.repeat(level)} ${renderInline(children, options).trim()}`;
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
    case 'LangBlock':
      return shows(node, options) ? renderChildren(children, options) : '';
    case 'Grid':
    case 'Releases':
      return renderChildren(children, options, '\n');
    case 'Card': {
      const { title, description, href } = attributes as {
        title: string;
        description: string;
        href: string;
      };
      return `- ${link(escape(title), options.href(href))}: ${escape(description)}`;
    }
    case 'Release': {
      const { name, date } = attributes as { name: string; date: string };
      const links = children.map((child) => renderInline([child], options));
      return `- **${escape(name)}** (${escape(date)}): ${links.join(', ')}`;
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
  return nodes.map((node) => renderInlineNode(node, options)).join('');
}

function renderInlineNode(
  node: RenderableTreeNode,
  options: RenderOptions
): string {
  if (typeof node === 'string') return escape(node);
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
      return unresolved ? inner() : link(inner(), options.href(href), title);
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
      return `!${link(escape(alt), options.href(src), title)}`;
    }
    case 'LangBlock':
      return shows(node, options) ? inner() : '';
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

/** The showcase's code for one mapping, or for every mapping under its name. */
function renderShowcase(
  panels: ShowcasePanel[],
  options: RenderOptions
): string {
  const { language } = options;
  return panels
    .filter((panel) => language === undefined || panel.lang === language)
    .map((panel) => {
      const blocks = [panel.contract, panel.client, panel.server]
        .filter((block) => block !== undefined)
        .map((block) => fence(block.language, block.code, block.title));
      if (language === undefined)
        blocks.unshift(`**${languageLabel(panel.lang)}**`);
      return blocks.join('\n\n');
    })
    .join('\n\n');
}
