---
title: Documenting Slice Definitions
pages:
  - comment-syntax
  - doc-comment-structure
  - generating-documentation-with-doxygen
---

Comments on your Slice definitions help readers understand the semantics of your interfaces and data types. A _doc
comment_ is a comment that documents the definition after it. The Slice compilers for C++, C#, Java, JavaScript, MATLAB,
Python, and Swift check your doc comments and copy them into the code they generate, in the doc comment format of each
language, so the documentation you write in Slice also documents the generated API.

A doc comment uses one of two [comment styles](../comment-syntax), and a small set of [tags](../doc-comment-structure)
for parameters, return values, exceptions, and links to other definitions.

You can also process your Slice files with [Doxygen](../generating-documentation-with-doxygen) to generate a reference
for the Slice definitions themselves, in HTML and other formats. Consider whether your readers need documentation for
your Slice files, for the generated code, or both.
