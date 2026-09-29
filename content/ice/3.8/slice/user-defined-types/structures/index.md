---
title: Structures
---

# Struct Syntax

Slice supports structures containing one or more named fields of arbitrary type, including user-defined complex types.
For example:

```slice
module M
{
    struct TimeOfDay
    {
        short hour;         // 0 - 23
        short minute;       // 0 - 59
        short second;       // 0 - 59
    }
}
```

This definition introduces a new type called `TimeOfDay`. Structure definitions form a scope, so the names of the
structure fields need to be unique only within their enclosing structure.

Field definitions using a named type are the only construct that can appear inside a structure. It is impossible to, for
example, define a structure inside a structure:

```slice
struct TwoPoints
{
    struct Point      // Illegal!
    {
        short x;
        short y;
    }
    Point coord1;
    Point coord2;
}
```

This rule applies to Slice in general: type definitions cannot be nested (except for [modules](../modules), which do
support nesting). The reason for this rule is that nested type definitions can be difficult to implement for some target
languages and, even if implementable, greatly complicate the scope resolution rules. For a specification language, such
as Slice, nested type definitions are unnecessary – you can always write the above definitions as follows (which is
stylistically cleaner as well):

```slice
struct Point
{
    short x;
    short y;
}

struct TwoPoints      // Legal (and cleaner!)
{
    Point coord1;
    Point coord2;
}
```

# Language Mapping

{% language-section name="lang-1" /%}

##### See Also

- [Fields](../fields)
- [Classes](../classes)
