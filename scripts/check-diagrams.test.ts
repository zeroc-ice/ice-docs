// Copyright (c) ZeroC, Inc.

import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test, type TestContext } from 'node:test';
import { fileURLToPath } from 'node:url';

const checker = fileURLToPath(new URL('./check-diagrams.ts', import.meta.url));

/** Runs the published-figure check on one SVG in an isolated image directory. */
function check(
  t: TestContext,
  css: string,
  text: string,
  filename = 'figure.svg'
) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'check-diagrams-'));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  const image = path.join(directory, 'public', 'images', filename);
  fs.mkdirSync(path.dirname(image), { recursive: true });
  fs.writeFileSync(
    image,
    `<svg width="350" viewBox="0 0 700 200"><style>${css}</style>${text}</svg>`
  );
  return spawnSync(process.execPath, [checker], {
    cwd: directory,
    encoding: 'utf8'
  });
}

test('annotations meet a 12 pixel floor after image scaling', (t) => {
  assert.equal(
    check(
      t,
      '.annotation { font-size: 24px; }',
      '<text class="annotation">Note</text>'
    ).status,
    0
  );
  const result = check(
    t,
    '.annotation { font-size: 23px; }',
    '<text class="annotation">Note</text>'
  );
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /"Note" renders at 11.50 px; text must render at 12 px/
  );
});

test('component labels and boundary titles meet a 13 pixel floor', (t) => {
  for (const role of ['component-label', 'group-label', 'zone-label']) {
    assert.equal(
      check(
        t,
        `.${role} { font-size: 26px; }`,
        `<text class="${role}">Title</text>`
      ).status,
      0
    );
    const result = check(
      t,
      `.${role} { font-size: 25px; }`,
      `<text class="${role}">Title</text>`
    );
    assert.equal(result.status, 1);
    assert.match(
      result.stderr,
      /"Title" renders at 12.50 px; text must render at 13 px/
    );
  }
});

test('nested code spans inherit the component label floor', (t) => {
  const result = check(
    t,
    '.label { font-size: 25px; } .code { font-family: monospace; }',
    '<text class="label"><tspan><tspan class="code">Greeter</tspan></tspan></text>'
  );
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /"Greeter" renders at 12.50 px; text must render at 13 px/
  );
});

test('a code span with its own font size retains the component label floor', (t) => {
  const result = check(
    t,
    '.label { font-size: 26px; } .code { font-size: 25px; }',
    '<text class="label"><tspan class="code">Greeter</tspan></text>'
  );
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /"Greeter" renders at 12.50 px; text must render at 13 px/
  );
});

test('a superscript annotation meets its own floor inside a state label', (t) => {
  const css =
    '.state-label { font-size: 26px; } .asterisk { font-size: 24px; }';
  const text =
    '<text class="state-label">active<tspan class="asterisk">*</tspan></text>';
  assert.equal(check(t, css, text).status, 0);
  const result = check(t, css.replace('24px', '23px'), text);
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /"\*" renders at 11.50 px; text must render at 12 px/
  );
});

test('text following a span retains the enclosing label floor', (t) => {
  const result = check(
    t,
    '.label { font-size: 25px; } .asterisk { font-size: 24px; }',
    '<text class="label"><tspan class="asterisk">*</tspan>Title</text>'
  );
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /"Title" renders at 12.50 px; text must render at 13 px/
  );
});

test('category badges use the annotation floor', (t) => {
  assert.equal(
    check(
      t,
      '.category-badge { font-size: 24px; }',
      '<text class="category-badge">GENERATED</text>'
    ).status,
    0
  );
});

test('every published figure participates in the check', (t) => {
  const result = check(
    t,
    '.annotation { font-size: 22px; }',
    '<text class="annotation">Note</text>',
    'ice/3.8/protocol-messages/protocol-state-machine.svg'
  );
  assert.equal(result.status, 1);
  assert.match(
    result.stderr,
    /protocol-state-machine.svg: "Note" renders at 11.00 px/
  );
});
