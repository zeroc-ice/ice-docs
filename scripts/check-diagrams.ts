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

const MIN_LABEL_PX = 13;
const LABEL_CLASSES = new Set([
  'label',
  'component-label',
  'major-label',
  'actor-label',
  'application-label',
  'runtime-label',
  'executable-label',
  'interface-name',
  'file-label',
  'facet-name',
  'state-label',
  'process-title',
  'boundary-title',
  'group-label',
  'zone-label'
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

/** Finds the text closest to or furthest below its rendered-size minimum. */
function leastReadableText(svg: string) {
  const root = /<svg\b[^>]*>/.exec(svg)?.[0] ?? '';
  const width = Number(attribute(root, 'width'));
  const viewBoxWidth = Number(attribute(root, 'viewBox')?.split(/\s+/)[2]);
  const scale = width / viewBoxWidth;
  const rules = fontRules(svg);

  let leastReadable:
    { px: number; minimumPx: number; text: string } | undefined;
  const record = (size: number, minimumPx: number, content: string) => {
    const text = content.trim();
    const px = size * scale;
    if (
      text &&
      (!leastReadable ||
        px / minimumPx < leastReadable.px / leastReadable.minimumPx)
    )
      leastReadable = { px, minimumPx, text };
  };
  const parents: { size: number; minimumPx: number }[] = [];
  for (const [tag, closing, name, content] of svg
    .matchAll(/<(\/?)(text|tspan)\b[^>]*?(\/?)>([^<]*)/g)
    .map((match) => [match[0], match[1], match[2], match[4]])) {
    if (closing) {
      parents.pop();
      // Text after a closing </tspan> belongs to the enclosing element.
      const enclosing = parents.at(-1);
      if (enclosing !== undefined)
        record(enclosing.size, enclosing.minimumPx, content);
      continue;
    }
    const classes = (attribute(tag, 'class') ?? '').split(/\s+/);
    const size =
      fontSize(name, classes, rules) ??
      parents.at(-1)?.size ??
      fontSize('text', [], rules) ??
      16;
    const minimumPx = classes.includes('asterisk')
      ? MIN_RENDERED_PX
      : classes.some((name) => LABEL_CLASSES.has(name))
        ? MIN_LABEL_PX
        : (parents.at(-1)?.minimumPx ?? MIN_RENDERED_PX);
    if (!tag.endsWith('/>')) parents.push({ size, minimumPx });
    record(size, minimumPx, content);
  }
  return { scale, leastReadable };
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
  const { scale, leastReadable } = leastReadableText(
    fs.readFileSync(file, 'utf8')
  );
  if (!Number.isFinite(scale)) {
    console.error(
      `error: ${relative}: the root <svg> needs a numeric width and viewBox`
    );
    errors++;
  } else if (
    leastReadable &&
    leastReadable.px < leastReadable.minimumPx - 1e-9
  ) {
    console.error(
      `error: ${relative}: "${leastReadable.text}" renders at ${leastReadable.px.toFixed(2)} px; text must render at ${leastReadable.minimumPx} px or more (font size × width ÷ viewBox width)`
    );
    errors++;
  }
}

if (errors) {
  console.error(`\n${errors} error(s)`);
  process.exit(1);
}
console.log(
  `${files.length} diagrams checked: labels and titles render at ${MIN_LABEL_PX} px or more; other text at ${MIN_RENDERED_PX} px or more`
);
