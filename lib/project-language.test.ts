// Copyright (c) ZeroC, Inc.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { projectLanguage } from './project-language.ts';

test('shared prose and matching sibling blocks remain visible', () => {
  const source =
    'shared {% iflang langs="cpp, python" %}native{% /iflang %} ' +
    '{% iflang langs="java" %}java{% /iflang %} end';
  assert.equal(projectLanguage(source, 'python'), 'shared native  end');
});

test('a hidden parent hides every nested block and trailing parent prose', () => {
  const source =
    'before {% iflang langs="cpp" %}parent ' +
    '{% iflang langs="java" %}child{% /iflang %} tail{% /iflang %} after';
  assert.equal(projectLanguage(source, 'java'), 'before  after');
});

test('visible parents keep only matching nested content at every depth', () => {
  const source =
    '{% iflang langs="cpp,python" %}outer ' +
    '{% iflang langs="cpp" %}cpp{% /iflang %}' +
    '{% iflang langs="python" %}python ' +
    '{% iflang langs="python" %}deep{% /iflang %}{% /iflang %}' +
    ' tail{% /iflang %} end';
  assert.equal(projectLanguage(source, 'python'), 'outer python deep tail end');
  assert.equal(projectLanguage(source, 'cpp'), 'outer cpp tail end');
});
