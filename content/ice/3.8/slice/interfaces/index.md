---
title: Interfaces
pages:
  - interface-inheritance
  - proxy-types
---

## Syntax and Semantics of Interfaces

A Slice interface defines the operations that clients invoke on an Ice object. For example:

```slice
module M
{
    struct TimeOfDay
    {
        short hour;         // 0 - 23
        short minute;       // 0 - 59
        short second;       // 0 - 59
    }

    interface Clock
    {
        TimeOfDay getTime();
        void setTime(TimeOfDay time);
    }
}
```

`Clock` defines two operations: `getTime` returns the current time, and `setTime` sets it. A client calls these
operations on a proxy for an Ice object that implements `Clock`.

An interface contains only operations: you cannot define a type, an exception, or a field inside an interface.

An interface can be empty:

```slice
interface Empty {}
```

{% language-section name="mapping" /%}

## See Also

- [Operations](../operations)
- [User Exceptions](../exceptions)
