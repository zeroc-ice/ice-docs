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

# Formatting and Links

Text between backticks is code, and each compiler formats it as code in its language:

```slice
/// Returns `true` if the catalog holds no items.
bool isEmpty();
```

To write a backtick that does not start code, escape it with a backslash.

`{@link identifier}` links to another Slice definition. The compilers look up the identifier from the scope of the
definition being documented, as for any [Slice name](../names-and-scoping), and warn when it names nothing. Write
`Catalog#findItem` to link to the member `findItem` of `Catalog`, or `#findItem` for a member of the type that the doc
comment belongs to:

```slice
/// Holds the items of a store. Use {@link #findItem} to look one up.
interface Catalog
```

`@p name` refers to the parameter `name` of the operation being documented, and is formatted as code. It is only valid
in an operation's doc comment:

```slice
/// Looks for the item whose primary key is @p p and whose secondary key is @p s.
Item findItem(Key p, Key s) throws NotFound;
```

# General Tags

The following tags can be used in any doc comment.

## `@see identifier`

Adds a cross-reference to another Slice definition, looked up like the identifier of `{@link}`. Each `@see` tag holds
one identifier, on a line of its own and with no trailing period:

```slice
/// Thrown when no item matches a search.
/// @see Catalog#findItem
exception NotFound {}
```

## `@remark` / `@remarks`

Starts a remarks section, for details that don't belong in the description.

## `@deprecated`

Documents that the definition is deprecated. The text after the tag says why, or what to use instead. The tag only
affects the documentation: to deprecate the definition in the generated code as well, use the
[`deprecated` metadata directive](../deprecating-slice-definitions).

# Operation Tags

The following tags can only be used to document operations. The compilers warn about them anywhere else, and ignore
them.

## `@param name`

Documents the parameter `name`, which must be one of the operation's parameters. For clarity, write the `@param` tags in
the order in which the parameters are declared.

## `@return`

Documents the return value. The compilers warn about `@return` on an operation that does not return a value.

## `@throws name` / `@exception name`

Documents when the operation throws the exception `name`, which must be listed in the operation's exception
specification. The two tags are equivalent.

Each parameter, exception, and return value is documented once: the compilers warn about a duplicate tag and ignore it.
