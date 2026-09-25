---
title: Documenting Slice Definitions
pages:
  - comment-syntax
  - doc-comment-structure
  - generating-documentation-with-doxygen
---

A _doc comment_ documents the Slice definition that follows it. Every Slice compiler except `slice2php` and `slice2rb`
checks your doc comments and copies them into the code it generates, in that language's doc-comment format, so what you
write in Slice also documents the generated API.

A doc comment uses one of two [styles](../comment-syntax) and a small set of [tags](../doc-comment-structure). You can
also run [Doxygen](../generating-documentation-with-doxygen) on your Slice files to generate a reference for the Slice
definitions themselves.
