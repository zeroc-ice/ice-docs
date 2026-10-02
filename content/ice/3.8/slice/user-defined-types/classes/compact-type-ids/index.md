---
title: Classes with Compact Type IDs
---

You can optionally associate a numeric identifier with a class. The Ice runtime substitutes this value, known as a
_compact ID_, in place of its equivalent [string type ID](../../../type-ids) during marshaling to conserve space. The
compact ID follows immediately after the class name, enclosed in parentheses:

```slice
module M
{
    class CompactExample(4)
    {
        // ...
    }
}
```

In this example, the Ice runtime marshals the value `4` instead of its string equivalent `"::M::CompactExample"`. The
specified value must be a non-negative integer that is unique within your application.

{% callout type="info" %}

Using values less than 255 produces the most efficient
[encoding](../../../../encoding/data-encoding-for-classes/class-type-ids).

{% /callout %}

## See Also

- [Type IDs](../../../type-ids)
- [Data Encoding for Class Type IDs](../../../../encoding/data-encoding-for-classes/class-type-ids)
