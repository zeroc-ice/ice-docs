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
// Pages are validated as written, one file at a time, so a diagnostic names the
// file and line to fix. The two tags the resolver consumes before Markdoc sees a
// page — `language-section` and `snippet` — are declared here with their
// attributes, so they validate too instead of reading as unknown tags.
//
// Exit code 1 on any diagnostic at warning level or above. `child-invalid`,
// which a `{% callout %}` reflowed into its paragraph produces, is a warning.

import fs from 'node:fs';
import path from 'node:path';
import Markdoc from '@markdoc/markdoc';

import config from '../markdoc/config.ts';
import { listVersions } from '../lib/docs-model/content.ts';

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

let pages = 0;
const diagnostics = [];

for (const version of listVersions(ROOT)) {
  for (const file of markdownFiles(path.join(ROOT, version)).sort()) {
    pages++;
    const source = fs.readFileSync(file, 'utf8');
    // The same tokenizer settings as lib/markdown.ts, so the check sees the
    // page the build sees.
    const tokenizer = new Markdoc.Tokenizer({ allowComments: true });
    const ast = Markdoc.parse(tokenizer.tokenize(source));
    const overlay = /[\\/]languages[\\/]([^\\/]+)[\\/]/.exec(file);
    const errors = Markdoc.validate(ast, {
      ...config,
      tags: { ...config.tags, ...resolverTags },
      variables: { ...config.variables, version, language: overlay?.[1] ?? '' }
    });
    for (const { error, lines } of errors) {
      if (!fails(error.level)) continue;
      diagnostics.push({
        file: path.relative(process.cwd(), file),
        line: (lines?.[0] ?? 0) + 1,
        text: `${error.level} ${error.id}: ${error.message}`
      });
    }
  }
}

diagnostics.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line);
for (const d of diagnostics) console.error(`${d.file}:${d.line}: ${d.text}`);

if (diagnostics.length) {
  const files = new Set(diagnostics.map((d) => d.file)).size;
  console.error(
    `\n${diagnostics.length} diagnostic(s) in ${files} of ${pages} pages`
  );
  process.exit(1);
}
console.log(`${pages} pages validate against the Markdoc schema`);
