---
title: Documenting Slice Definitions
pages:
  - comment-syntax
  - doc-comment-structure
  - generating-documentation-with-doxygen
---

A _doc comment_ documents the Slice definition that follows it. Every Slice compiler except `slice2php` and `slice2rb`
checks doc comments and maps them into the generated code, using that language's doc-comment conventions, so what you
write in Slice also documents the generated API.

Slice supports two [styles](../comment-syntax) of doc comments and a small set of [tags](../doc-comment-structure). You
can also run [Doxygen](../generating-documentation-with-doxygen) on your Slice files to generate an API reference for
the Slice definitions themselves.
