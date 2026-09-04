// Copyright (c) ZeroC, Inc.
//
// Validate every page of the manual against the site's Markdoc schema. Run with
// `npm run check:markdoc`; `npm run build` runs it first.
//
// The build never validates. `Markdoc.transform` renders whatever the parser
// produced, and the parser is forgiving: a block tag that lands inside a
// paragraph, a closing tag with no opening one, or an attribute value the
// schema does not accept all render as something — usually the wrong thing —
// without a word from the build. This is the check the Markdoc language server
// runs in the editor, applied to the whole tree, so CI sees what the editor
// would have shown.
//
// Two passes. The first validates each page as written, one file at a time, so
// a diagnostic names the file and line to fix; the two tags the resolver
// consumes before Markdoc sees a page — `language-section` and `snippet` — are
// declared for it with their attributes. The second validates each page as the
// site renders it: a shared page with the language overlay's sections inserted
// and its snippets expanded, once per language, which is the only place a
// problem of insertion can show, such as an overlay heading that lands inside
// a callout. That pass can only point at a line of the assembled page, so it
// quotes the line, and it skips anything the first pass already reported.
//
// Exit code 1 on any diagnostic at warning level or above. `child-invalid`,
// which a `{% callout %}` reflowed into its paragraph produces, is a warning.

import fs from 'node:fs';
import path from 'node:path';
import Markdoc from '@markdoc/markdoc';
import { load as yamlLoad } from 'js-yaml';

import config from '../markdoc/config.ts';
import {
  listPageParams,
  listVersions,
  readNavigationYaml,
  readPageSources,
  snippetReader
} from '../lib/docs-model/content.ts';
import {
  demoteHeadings,
  resolveDocument,
  splitFrontmatter,
  stripRedundantTitle
} from '../lib/docs-model/resolve.ts';

const ROOT = path.join(process.cwd(), 'content');

// Consumed by lib/docs-model/resolve.ts before a page reaches Markdoc.
const resolverTags = {
  'language-section': {
    attributes: {
      name: { type: String, required: true },
      state: { type: String, matches: ['no-addition', 'not-applicable'] },
      note: { type: String }
    }
  },
  snippet: {
    selfClosing: true,
    attributes: {
      file: { type: String, required: true },
      name: { type: String, required: true },
      lang: { type: String }
    }
  }
};

const LEVELS = ['debug', 'info', 'warning', 'error', 'critical'];
const fails = (level) => LEVELS.indexOf(level) >= LEVELS.indexOf('warning');

function markdownFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir)) {
    const abs = path.join(dir, entry);
    if (fs.statSync(abs).isDirectory()) markdownFiles(abs, out);
    else if (entry.endsWith('.md')) out.push(abs);
  }
  return out;
}

/** Validate one document with the same tokenizer settings as lib/markdown.ts. */
function validate(source, tags, variables) {
  const tokenizer = new Markdoc.Tokenizer({ allowComments: true });
  const ast = Markdoc.parse(tokenizer.tokenize(source));
  const lines = source.split('\n');
  return Markdoc.validate(ast, { ...config, tags, variables })
    .filter(({ error }) => fails(error.level))
    .map(({ error, lines: at }) => ({
      line: (at?.[0] ?? 0) + 1,
      text: `${error.level} ${error.id}: ${error.message}`,
      source: (lines[at?.[0] ?? 0] ?? '').trim()
    }));
}

const frontmatterOf = (source) =>
  yamlLoad(splitFrontmatter(source).frontmatter ?? '') ?? {};

const diagnostics = [];
// What the first pass reported, so the second does not repeat it.
const reported = new Set();

// 1. Every page as written.
let pages = 0;
const sourceTags = { ...config.tags, ...resolverTags };
for (const version of listVersions(ROOT)) {
  for (const file of markdownFiles(path.join(ROOT, version)).sort()) {
    pages++;
    const overlay = /[\\/]languages[\\/]([^\\/]+)[\\/]/.exec(file);
    const variables = {
      ...config.variables,
      version,
      language: overlay?.[1] ?? ''
    };
    for (const d of validate(
      fs.readFileSync(file, 'utf8'),
      sourceTags,
      variables
    )) {
      diagnostics.push({
        where: `${path.relative(process.cwd(), file)}:${d.line}`,
        text: d.text
      });
      reported.add(`${d.text}\n${d.source}`);
    }
  }
}

// 2. Every page as the site renders it, per language.
let rendered = 0;
const languagesByVersion = {};
for (const version of listVersions(ROOT)) {
  const nav = yamlLoad(readNavigationYaml(ROOT, version) ?? '') ?? {};
  languagesByVersion[version] = nav.languages?.length ? nav.languages : ['cpp'];
}
for (const { version, language, slug } of listPageParams(
  ROOT,
  languagesByVersion
)) {
  rendered++;
  const { shared, overlay } = readPageSources(ROOT, version, language, slug);
  const frontmatter = frontmatterOf(shared ?? overlay ?? '');
  const where = `${version}/${language}/${slug} (assembled)`;
  let body;
  try {
    // The same steps, in the same order, as the page route.
    body = demoteHeadings(
      stripRedundantTitle(
        resolveDocument({
          shared: shared ?? '',
          overlay: overlay ?? undefined,
          readFile: snippetReader(ROOT, version)
        }),
        frontmatter.title
      )
    );
  } catch (error) {
    diagnostics.push({ where, text: `cannot assemble: ${error.message}` });
    continue;
  }
  const variables = { ...config.variables, version, language, frontmatter };
  for (const d of validate(body, config.tags, variables)) {
    if (reported.has(`${d.text}\n${d.source}`)) continue;
    diagnostics.push({
      where: `${where}:${d.line}`,
      text: `${d.text}\n    ${d.source}`
    });
  }
}

for (const d of diagnostics) console.error(`${d.where}: ${d.text}`);

if (diagnostics.length) {
  console.error(
    `\n${diagnostics.length} diagnostic(s) across ${pages} pages and ${rendered} rendered pages`
  );
  process.exit(1);
}
console.log(
  `${pages} pages and ${rendered} rendered pages validate against the Markdoc schema`
);
