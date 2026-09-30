---
title: Comment Syntax
---

Slice supports two styles of comments: _line comments_ and _block comments_.

```slice
// A line comment starts with '//' and extends to the end of its line.

/* A block comment starts with '/*' and keeps
   going until it reaches a */
```

Slice also supports two styles of _doc comments_, which [document](../documenting-slice-definitions) the definition that
follows them.

A line doc comment is a line comment with a third slash. Consecutive lines form one doc comment:

```slice
/// This is a doc comment
/// that spans two lines.
```

A block doc comment is a block comment that starts with exactly two asterisks:

```slice
/** This is a single-line block doc comment. */

/**
 * This is a multi-line block doc comment.
 */
```

Starting each line of a multi-line block doc comment with `*` is conventional but optional.

The two styles are equivalent, and both accept only the tags described in
[Doc-Comment Structure](../doc-comment-structure).

The Slice compilers treat every comment other than a doc comment as whitespace.

All Slice definitions support doc comments, except parameters. To document a parameter, use a `@param` tag in its
operation's doc comment; see [Operation Tags](../doc-comment-structure#operation-tags).
