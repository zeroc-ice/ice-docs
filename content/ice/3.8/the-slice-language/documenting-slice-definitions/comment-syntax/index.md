---
title: Comment Syntax
---

Slice supports two styles of comments: _line comments_ and _block comments_.

```slice
// A line comment starts with '//' and extends to the end of its line.

/* A block comment starts with '/*' and keeps
   going until it reaches a */
```

The Slice compilers ignore these comments as if they were whitespace: they have no effect on the generated code, and the
only way to see them is to read the Slice file itself. Slice also supports two styles of _doc comments_, which
[document](../documenting-slice-definitions) the definition that follows them.

A line doc comment is a line comment with a third slash. Consecutive lines form one doc comment:

```slice
/// This is a doc comment
/// that spans two lines.
```

A block doc comment is a block comment that starts with a second asterisk:

```slice
/** This is a single-line doc comment. */

/**
 * This is a multi-line doc comment.
 */
```

{% callout type="info" %}

Starting each line of a multi-line block doc comment with `*` is conventional, but not required.

{% /callout %}

The two styles are equivalent, and both accept only the tags described in
[Doc-Comment Structure](../doc-comment-structure).

Unlike regular comments, which can appear anywhere in a Slice file, doc comments must be attached to a Slice definition:
write each one directly before the definition it describes.

All Slice definitions support doc comments, except parameters. You document an operation's parameters with `@param` tags
in the operation's doc comment; see [Operation Tags](../doc-comment-structure#operation-tags).
