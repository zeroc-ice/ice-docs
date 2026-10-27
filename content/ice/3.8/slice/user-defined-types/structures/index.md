---
title: Structures
---

## Struct Syntax

A structure groups one or more named fields, of any type, into a new type. For example:

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

This definition introduces a new type named `TimeOfDay`. The name of a field must be unique within its structure.

A structure contains only fields. As elsewhere in Slice, type definitions cannot be nested, except for
[modules](../../modules): to use a structure as the type of a field, define it in the module, next to the structure that
uses it.

## Language Mapping

{% language-section name="mapping" /%}

## See Also

- [Fields](../../fields)
- [Classes](../classes)
