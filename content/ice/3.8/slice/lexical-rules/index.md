---
title: Lexical Rules
---

## Comments

Slice supports block comments, delimited by `/*` and `*/`, and line comments, which start with `//` and extend to the
end of the line:

```slice
/*
 * Block comment.
 */

// Line comment.
```

Slice also supports doc comments, which document the definition that follows them: line comments that start with `///`
and block comments that start with `/**`. See [Comment Syntax](../documenting-slice-definitions/comment-syntax).

## Keywords

Slice uses a number of [keywords](../slice-keywords), which must be spelled in lowercase, such as `class` and
`dictionary`. The keywords `Object` and `Value` are the exceptions: they must be capitalized as shown.

## Identifiers

An identifier begins with an ASCII letter, followed by any number of ASCII letters, digits, and underscores. An
identifier cannot begin or end with an underscore, or contain two consecutive underscores: `get_account_name` is legal,
but `_account`, `account_`, and `get__account` are not. Non-ASCII letters, such as Å, cannot appear in an identifier.

An identifier cannot end with `Helper`, `Holder`, `Prx`, or `Ptr`: the Slice compilers reserve these suffixes.

### Case Sensitivity

Identifiers that differ only in capitalization are the same identifier: you cannot declare both `TimeOfDay` and
`TIMEOFDAY` in the same scope. After you declare an identifier, you must refer to it with the same capitalization;
otherwise, the compiler rejects the reference.

### Escaped Identifiers

You can use a Slice keyword as an identifier by prefixing it with a backslash:

```slice
struct Value     // Error!
{
    // ...
}

struct \Value    // OK
{
    // ...
}
```

The backslash lets an existing definition keep a name that a later version of Slice makes a keyword. In new definitions,
avoid keywords as identifiers. A backslash before an identifier that is not a keyword has no effect.

### Language Mapping

{% language-section name="mapping" /%}

## See Also

- [Slice Keywords](../slice-keywords)
- [Comment Syntax](../documenting-slice-definitions/comment-syntax)
- [Slice Metadata Directives](../slice-metadata-directives)
