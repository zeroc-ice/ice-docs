---
title: Interfaces
pages:
  - interface-inheritance
  - proxy-types
---

## Syntax and Semantics of Interfaces

The central focus of Slice is on defining interfaces, for example:

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

This definition defines an interface type called `Clock`. The interface supports two operations: `getTime` and
`setTime`. Clients access an object supporting the `Clock` interface by invoking an operation on the proxy for the
object: to read the current time, the client invokes the `getTime` operation; to set the current time, the client
invokes the `setTime` operation, passing an argument of type `TimeOfDay`.

Invoking an operation on a proxy instructs the Ice runtime to send a message to the target object. The location of the
target object is transparent to the client. When an object adapter of the proxy's communicator hosts the target object,
the invocation is [collocated](../collocated-invocation-and-dispatch): by default, the Ice runtime bypasses the network
stack altogether to deliver the request more efficiently. Otherwise, the Ice runtime sends the request through a
transport, even when the target object is in the same process.

Note that nothing but operation definitions are allowed to appear inside an interface definition. In particular, you
cannot define a type, an exception, or a field inside an interface. This does not mean that your object implementation
cannot contain state — it can, but how that state is implemented (in the form of fields or otherwise) is hidden from the
client and, therefore, need not appear in the object's interface definition.

An Ice object has exactly one (most derived) Slice interface type. Of course, you can create multiple Ice objects that
have the same type; to draw the analogy with C++, a Slice interface corresponds to a C++ class definition, whereas an
Ice object corresponds to a C++ class instance (but Ice objects can be implemented in multiple different address
spaces).

Ice also provides multiple interfaces for the same Ice object via a feature called [_facets_](../facets).

A Slice interface defines the smallest grain of distribution in Ice: each Ice object has a unique identity (encapsulated
in its proxy) that distinguishes it from other Ice objects; for communication to take place, you must invoke operations
on an object's proxy. There is no other notion of an addressable entity in Ice. You cannot, for example, instantiate a
Slice structure and have clients manipulate that structure remotely. To make the structure accessible, you must create
an interface that allows clients to access the structure.

The partition of an application into interfaces therefore has profound influence on the overall architecture.
Distribution boundaries must follow interface boundaries; you can spread the implementation of interfaces over multiple
processes (and you can implement multiple interfaces in the same process), but you cannot implement parts of an
interface in different processes.

## Empty Interfaces

The following Slice definition is legal:

```slice
interface Empty {}
```

The Slice compiler will compile this definition without complaint. An interesting question is: "why would I need an
empty interface?". In most cases, empty interfaces are an indication of design errors. If you find yourself writing an
empty interface definition, at least step back and think about the problem at hand; there may be a more appropriate
design that expresses your intent more cleanly.

{% language-section name="language-mapping" /%}

## See Also

- [Operations](../operations)
- [User Exceptions](../exceptions)
