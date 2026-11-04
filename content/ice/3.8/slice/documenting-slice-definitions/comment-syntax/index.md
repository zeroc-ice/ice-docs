---
title: Comment Syntax
sidebarLabel: Syntax
---

Slice supports two styles of comments: a _line comment_ starts with `//` and extends to the end of the line, and a
_block comment_ starts with `/*` and ends at the next `*/`, so it can span several lines:

```slice
// A line comment.

/* A block comment
   that spans two lines. */
```

Slice also supports two styles of _doc comments_, which [document](..) the definition that follows them.

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
