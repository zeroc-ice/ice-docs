---
title: Lexical Rules
---

Slice's lexical rules are very similar to those of C++, C#, and Java.

# Comments

Slice definitions permit both the C and the C++ style of writing comments:

```slice
/*
 * C-style comment.
 */

// C++-style comment extending to the end of this line.
```

# Keywords

Slice uses a number of [keywords](../slice-keywords), which must be spelled in lowercase. For example, `class` and
`dictionary` are keywords and must be spelled as shown. There are two exceptions to this lowercase rule: `Object` and
`Value` are keywords and must be capitalized as shown.

# Identifiers

Identifiers begin with an alphabetic character followed by any number of alphabetic characters or digits. Underscores
are also permitted in identifiers with the following limitations:

- an identifier cannot begin or end with an underscore
- an identifier cannot contain multiple consecutive underscores

Given these rules, the identifier `get_account_name` is legal but not `_account`, `account_`, or `get__account`.

Slice identifiers are restricted to the ASCII range of alphabetic characters and cannot contain non-English letters,
such as Å.

## Case Sensitivity

Identifiers are case-insensitive but must be capitalized consistently. For example, `TimeOfDay` and `TIMEOFDAY` are
considered the same identifier within a naming scope. However, Slice enforces consistent capitalization. After you have
introduced an identifier, you must capitalize it consistently throughout; otherwise, the compiler will reject it as
illegal. This rule exists to permit mappings of Slice to languages that ignore case in identifiers as well as to
languages that treat differently capitalized identifiers as distinct.

## Escaped Identifiers

It is possible to use a Slice keyword as an identifier by prefixing the keyword with a backslash, for example:

```slice
struct dictionary     // Error!
{
    // ...
}

struct \dictionary    // OK
{
    // ...
}

struct \foo           // Legal, same as "struct foo"
{
    // ...
}
```

The backslash escapes the usual meaning of a keyword; in the preceding example, `\dictionary` is treated as the
identifier `dictionary`. The escape mechanism exists to permit keywords to be added to the Slice language over time with
minimal disruption to existing specifications: if a pre-existing specification happens to use a newly-introduced
keyword, that specification can be fixed by simply prepending a backslash to the new keyword. Note that, as a matter of
style, you should avoid using Slice keywords as identifiers (even though the backslash escapes allow you to do this).

It is legal (though redundant) to precede an identifier that is not a keyword with a backslash — the backslash is
ignored in that case.

## Language Mapping

{% language-section name="lang-1" /%}

##### See Also

- [Slice Keywords](../slice-keywords)
