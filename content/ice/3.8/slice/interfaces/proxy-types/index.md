---
title: Proxy Types
---

## Syntax and Semantics for Proxies

A Slice interface is not a Slice type – you cannot use a Slice interface as the type for a field or for a parameter in
an operation.

Nevertheless, when you define an interface (or [forward-declare](../../forward-declarations) this interface), you
automatically create a new Slice type: the proxy type associated with this interface.

The name of this proxy type is _InterfaceName_*. For example:

```slice
interface Widget { ... }

struct S
{
    Widget badWidget; // syntax error: Widget is not a type
    Widget* widgetProxy; // ok: the field's type is Widget*
}
```

This proxy type can be marshaled/unmarshaled just like any other Slice type. It encapsulates the addressing information
for the target object: object identity, endpoint(s), and proxy options.

{% callout type="note" %}

The marshaled representation of a proxy does not include the proxy’s type.

{% /callout %}

You use proxies in client applications. A proxy acts as a local "ambassador" for the remote object; invoking an
operation on the proxy forwards the invocation to the actual object implementation, in the server.

The semantics of proxies are similar to those of C++ class instance pointers:

- A proxy can be null.
- A proxy can dangle (point a a remote object that is no longer there).

## Self-Referential Interfaces

Proxies have pointer semantics, so an interface can reference a proxy to itself. For example:

```slice
interface Link
{
    idempotent SomeType getValue();
    idempotent Link* next();
}
```

The `Link` interface contains a `next` operation that returns a proxy to a `Link` interface. Obviously, this can be used
to create a chain of interfaces; the final link in the chain returns a null proxy from its `next` operation.
