// Copyright (c) ZeroC, Inc.
//
// The Markdoc parser as the site sets it up, shared by the route and the
// content checks so they parse a page alike. It imports only Markdoc's default
// export, which is all `scripts/check-content.js` can load under plain Node.

import Markdoc from '@markdoc/markdoc';

/** A page's Markdoc source, parsed the way the site renders it. */
export function parse(source: string) {
  const tokenizer = new Markdoc.Tokenizer({ allowComments: true });
  return Markdoc.parse(tokenizer.tokenize(source));
}
