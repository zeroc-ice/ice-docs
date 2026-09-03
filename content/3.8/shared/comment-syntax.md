---
id: comment-syntax
title: Comment Syntax
---

Slice supports 2 styles of comments: *line comments* and *block comments*.

```slice
// Inline comments start with '//' and extend to the end of their line.

/* Block comments always begin with a '/*' and keep
   going until reaching a */
```

Normally, Slice compilers ignore comments as-if they were whitespace. They have no effect on generated code, and the only way to see them is to read the Slice file itself. But, in addition to ‘normal’ comments, Slice also supports 2 styles of *doc-comments*, which the compilers validate and attempt to map into generated code.

The 2 supported styles of doc-comment are:

*Doxygen* style doc-comments work the same as line comments, but have an extra forward slash:

```slice
/// This is a doxygen style doc-comment
/// that spans two separate lines.
```

*JavaDoc* style doc-comments work the same as block comments, but have an extra asterisk at the beginning:

```slice
/** This is a single-line JavaDoc style doc-comment. */

/**
 * This is a multi-line JavaDoc style doc-comment.
 */
```

{% callout type="info" %}
Starting each line of a multi-line JavaDoc comment with ‘*' is conventional, but not required.
{% /callout %}

The Slice compilers make no distinction between Doxygen and JavaDoc style comments. The comment’s text will be mapped the same, regardless of which style you use.

<TODO: mention that these styles do not mean we fully support the tags!>

Unlike regular comments comments (which can appear anywhere in your Slice file), doc-comments must be attached to a Slice definition; i.e. they should be written directly before the Slice definition that they describe.

All Slice definitions support doc-comments, except for parameters. See <TODO: LINK TO OPERATION TAGS> for more information about documenting operation parameters.
