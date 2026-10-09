// Copyright (c) ZeroC, Inc.
//
// Check that the text of every published SVG figure is readable on the page.
// Run with `npm run check:diagrams`.
//
// A figure is shown at its native `width` at most, and SVG text scales with the
// image, so a font size of S units renders at S × width ÷ viewBox width pixels.
// diagrams/STYLE-GUIDE.md sets the floor this check enforces.
//
// The figures are hand-written, self-contained SVGs that set font sizes only in
// their <style> element, with class selectors (`.label`, `text.label`,
// `.label.code`) and the `text` element selector, so a regular-expression
// reading of that subset is enough here.

import fs from 'node:fs';
import path from 'node:path';

const IMAGES = path.join(process.cwd(), 'public', 'images');
const MIN_RENDERED_PX = 12;

// Figures drawn before the rule whose text is not yet at the floor.
const EXEMPT = new Set([
  'ice/3.8/protocol-messages/protocol-state-machine.svg'
]);

interface FontRule {
  element?: string;
  classes: string[];
  size: number;
}

function fontRules(svg: string): FontRule[] {
  const css = [...svg.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)]
    .map((match) => match[1])
    .join('\n')
    .replace(/\/\*[\s\S]*?\*\//g, '');
  const rules: FontRule[] = [];
  for (const [, selectors, body] of css.matchAll(/([^{}]+)\{([^}]*)\}/g)) {
    const size = /font-size:\s*([\d.]+)/.exec(body);
    if (!size) continue;
    for (const selector of selectors.split(',')) {
      const parts = /^([a-z]*)((?:\.[\w-]+)*)$/.exec(selector.trim());
      if (!parts) continue;
      rules.push({
        element: parts[1] || undefined,
        classes: parts[2].split('.').filter(Boolean),
        size: Number(size[1])
      });
    }
  }
  return rules;
}

// The font size of a <text> or <tspan> as CSS resolves it: the most specific
// matching rule wins, and the later one among equally specific rules. A <tspan>
// without a rule of its own inherits from its parent.
function fontSize(
  element: string,
  classes: string[],
  rules: FontRule[]
): number | undefined {
  let size: number | undefined;
  let best = -1;
  for (const rule of rules) {
    if (rule.element && rule.element !== element) continue;
    if (!rule.element && rule.classes.length === 0) continue;
    if (!rule.classes.every((name) => classes.includes(name))) continue;
    const specificity = rule.classes.length * 10 + (rule.element ? 1 : 0);
    if (specificity >= best) {
      best = specificity;
      size = rule.size;
    }
  }
  return size;
}

const attribute = (tag: string, name: string) =>
  new RegExp(`\\s${name}="([^"]*)"`).exec(tag)?.[1];

function smallestText(svg: string) {
  const root = /<svg\b[^>]*>/.exec(svg)?.[0] ?? '';
  const width = Number(attribute(root, 'width'));
  const viewBoxWidth = Number(attribute(root, 'viewBox')?.split(/\s+/)[2]);
  const scale = width / viewBoxWidth;
  const rules = fontRules(svg);

  let smallest: { px: number; text: string } | undefined;
  const record = (size: number, content: string) => {
    const text = content.trim();
    if (text && (!smallest || size * scale < smallest.px))
      smallest = { px: size * scale, text };
  };
  const parents: number[] = [];
  for (const [tag, closing, name, content] of svg
    .matchAll(/<(\/?)(text|tspan)\b[^>]*?(\/?)>([^<]*)/g)
    .map((match) => [match[0], match[1], match[2], match[4]])) {
    if (closing) {
      parents.pop();
      // Text after a closing </tspan> belongs to the enclosing element.
      const enclosing = parents.at(-1);
      if (enclosing !== undefined) record(enclosing, content);
      continue;
    }
    const classes = (attribute(tag, 'class') ?? '').split(/\s+/);
    const size =
      fontSize(name, classes, rules) ??
      parents.at(-1) ??
      fontSize('text', [], rules) ??
      16;
    if (!tag.endsWith('/>')) parents.push(size);
    record(size, content);
  }
  return { scale, smallest };
}

function svgFiles(directory: string): string[] {
  return fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const file = path.join(directory, entry.name);
      if (entry.isDirectory()) return svgFiles(file);
      return entry.name.endsWith('.svg') ? [file] : [];
    })
    .sort();
}

let errors = 0;
const files = svgFiles(IMAGES);
for (const file of files) {
  const relative = path.relative(IMAGES, file).split(path.sep).join('/');
  if (EXEMPT.has(relative)) continue;
  const { scale, smallest } = smallestText(fs.readFileSync(file, 'utf8'));
  if (!Number.isFinite(scale)) {
    console.error(
      `error: ${relative}: the root <svg> needs a numeric width and viewBox`
    );
    errors++;
  } else if (smallest && smallest.px < MIN_RENDERED_PX - 1e-9) {
    console.error(
      `error: ${relative}: "${smallest.text}" renders at ${smallest.px.toFixed(1)} px; text must render at ${MIN_RENDERED_PX} px or more (font size × width ÷ viewBox width)`
    );
    errors++;
  }
}

if (errors) {
  console.error(`\n${errors} error(s)`);
  process.exit(1);
}
console.log(
  `${files.length - EXEMPT.size} diagrams checked (${EXEMPT.size} exempt): all text renders at ${MIN_RENDERED_PX} px or more`
);
