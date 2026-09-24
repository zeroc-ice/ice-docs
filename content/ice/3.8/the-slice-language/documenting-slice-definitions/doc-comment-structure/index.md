---
title: Doc-Comment Structure
---

A doc comment starts with a summary sentence, continues with any further description, and ends with _tags_ that document
specific parts of the definition. A tag starts a line with `@`, and its text continues until the next tag or the end of
the comment:

```slice
/// Looks for an item with the specified primary and secondary keys.
/// Keys are compared case-sensitively.
/// @param p The primary search key.
/// @param s The secondary search key.
/// @return The item that matches the specified keys.
/// @throws NotFound Thrown if no item matches the specified keys.
Item findItem(Key p, Key s) throws NotFound;
```

The Slice compilers for C++, C#, Java, JavaScript, MATLAB, Python, and Swift check each doc comment against the rules on
this page: they warn about a tag they don't recognize, and ignore it.

# Formatting and Links

Text between backticks is code, and the compilers format it as code in each language:

```slice
/// Returns `true` if the catalog holds no items.
bool isEmpty();
```

To write a backtick that does not start code, escape it with a backslash.

`{@link identifier}` links to another Slice definition. The compilers look up the identifier from the scope of the
definition the comment documents, as for any [Slice name](../names-and-scoping), and warn when it names nothing. Write
`Catalog#findItem` to link to the member `findItem` of `Catalog`, or `#findItem` for a member of the type that the doc
comment belongs to:

```slice
/// Holds the items of a store. Use {@link #findItem} to look one up.
interface Catalog
```

`@p name` refers to the parameter `name` of the operation the comment documents, and the compilers format it as code. It
is only valid in an operation's doc comment:

```slice
/// Looks for the item whose primary key is @p p and whose secondary key is @p s.
Item findItem(Key p, Key s) throws NotFound;
```

# General Tags

You can use the following tags in any doc comment.

## `@see identifier`

Adds a cross-reference to another Slice definition. The compilers look up its identifier as they do for `{@link}`. Each
`@see` tag holds one identifier, on a line of its own and with no trailing period:

```slice
/// Thrown when no item matches a search.
/// @see Catalog#findItem
exception NotFound {}
```

## `@remark` / `@remarks`

Starts a remarks section, for details that don't belong in the description.

## `@deprecated`

Documents that the definition is deprecated. The text after the tag says why, or what to use instead.

# Operation Tags

You can use the following tags only in an operation's doc comment. The compilers warn about them anywhere else, and
ignore them.

## `@param name`

Documents the parameter `name`, which must be one of the operation's parameters. For clarity, write the `@param` tags in
the order of the parameters.

## `@return`

Documents the return value. The compilers warn about `@return` on an operation that does not return a value.

## `@throws name` / `@exception name`

Documents when the operation throws the exception `name`, which must appear in the operation's exception specification.
The two tags are equivalent.

Document each parameter, exception, and return value once: the compilers warn about a duplicate tag, and ignore it.
