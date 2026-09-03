// Copyright (c) ZeroC, Inc.
//
// Publishes prism-react-renderer's Prism instance as the global the grammar
// files in `prismjs/components/*` expect to find. Kept in its own module so a
// static `import` of it is guaranteed to run *before* any grammar module — ES
// imports execute in source order, and the grammars would otherwise register
// onto a Prism that does not exist yet.

import { Prism } from 'prism-react-renderer';

(typeof global !== 'undefined' ? global : window).Prism = Prism;

export default Prism;
