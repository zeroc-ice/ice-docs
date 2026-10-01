// Copyright (c) ZeroC, Inc.
//
// Every syntax the manual writes code in, in one place.
//
// Prism's core installs itself as the global `Prism`, and every grammar file
// registers itself on that global when it runs, so the core has to be imported
// first: ES imports run in source order.

import Prism from 'prismjs';

// Ice's own grammars.
import './prism-ebnf.ts';
import './prism-slice.ts';

// The nine language mappings the manual documents. JavaScript is part of the
// core. A grammar that extends another has to be registered after it.
import 'prismjs/components/prism-c.js';
import 'prismjs/components/prism-cpp.js';
import 'prismjs/components/prism-csharp.js';
import 'prismjs/components/prism-java.js';
import 'prismjs/components/prism-python.js';
import 'prismjs/components/prism-ruby.js';
import 'prismjs/components/prism-swift.js';
import 'prismjs/components/prism-matlab.js';
// TypeScript copies JavaScript's tokens when it extends it, so JavaScript's
// extra tokens have to be registered first.
import 'prismjs/components/prism-js-extras.js';
import 'prismjs/components/prism-typescript.js';
import 'prismjs/components/prism-markup-templating.js';
import 'prismjs/components/prism-php.js';

// Everything else the manual shows: build files, config, shells, diffs.
import 'prismjs/components/prism-kotlin.js';
import 'prismjs/components/prism-rust.js';
import 'prismjs/components/prism-groovy.js';
import 'prismjs/components/prism-bash.js';
import 'prismjs/components/prism-powershell.js';
import 'prismjs/components/prism-diff.js';
import 'prismjs/components/prism-properties.js';
import 'prismjs/components/prism-yaml.js';
import 'prismjs/components/prism-json.js';
import 'prismjs/components/prism-protobuf.js';

export default Prism;
