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
operations on a proxy for an Ice object that implements `Clock`, and the Ice runtime delivers each request to this
object, whether it is in another process or in the client's own; see
[Collocated Invocation and Dispatch](../../runtime/collocated-invocation-and-dispatch).

An interface contains only operations: you cannot define a type, an exception, or a field inside an interface. The
implementation of an Ice object can hold state, but this state does not appear in its interface.

An Ice object is the only entity a client can address: the client invokes operations on the object's proxy, which holds
the object's identity. To give clients access to a structure, you define an interface whose operations read or update
it. A process can implement several interfaces, but you cannot implement parts of one interface in different processes.

An interface can be empty:

```slice
interface Empty {}
```

{% language-section name="mapping" /%}

## See Also

- [Operations](../operations)
- [User Exceptions](../exceptions)
