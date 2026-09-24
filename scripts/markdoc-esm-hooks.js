// Copyright (c) ZeroC, Inc.
//
// Load Markdoc's ES module build under plain Node.
//
// The package ships one — `module` in its package.json — but declares no
// `exports`, so Node picks the CommonJS build and cannot see its named exports:
// `import { nodes } from '@markdoc/markdoc'` fails outside a bundler. This hook
// sends that specifier to the ES module build instead, which is the one Next
// bundles. `npm run check:markdoc` registers it with `--import`.

import { register } from 'node:module';
import { isMainThread } from 'node:worker_threads';

export async function resolve(specifier, context, next) {
  return next(
    specifier === '@markdoc/markdoc'
      ? '@markdoc/markdoc/dist/index.mjs'
      : specifier,
    context
  );
}

// Registered from the main thread; the hook itself runs on a worker thread.
if (isMainThread) register(import.meta.url);
