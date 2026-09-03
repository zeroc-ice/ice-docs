// Copyright (c) ZeroC, Inc.
//
// Every syntax the manual writes code in, in one place.
//
// The grammars are pure side effects — they register themselves on the global
// `Prism` and export nothing. A module whose imports are *all* side effects can
// be dropped from the client bundle, which is exactly what was happening: the
// page was prerendered in Node with highlighting, and the browser then hydrated
// it back to plain text because no chunk carrying the grammars was ever loaded.
//
// So this module exports the Prism instance it has just extended, and the code
// block passes it to `<Highlight prism={…}>`. The value is used, so the module —
// and with it every grammar below — has to ship.
//
// `./prism-global` must stay first: it installs the global `Prism` that every
// grammar file registers itself on, and ES imports run in source order.

import './prism-global';

// Ice's own grammars.
import './prism-ebnf';
import './prism-ice';
import './prism-slice';

// The nine language mappings the manual documents.
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-matlab';
import 'prismjs/components/prism-typescript';
// php extends markup-templating, so that has to be registered first.
import 'prismjs/components/prism-markup-templating';
import 'prismjs/components/prism-php';

// Everything else the manual shows: build files, config, shells, diffs.
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-groovy';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-powershell';
import 'prismjs/components/prism-diff';
import 'prismjs/components/prism-properties';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-protobuf';

// The extended Prism instance. Importing this value (rather than the module for
// its side effects alone) is what keeps the grammars in the client bundle.
export { default } from './prism-global';
