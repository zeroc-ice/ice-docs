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

Ice marshals and unmarshals a proxy like any other Slice type. A proxy holds the addressing information for its target
object: the object identity, the endpoints or adapter ID, and the proxy options. The marshaled proxy does not include
its proxy type: the receiver uses the type declared in the Slice definition.

A client invokes operations on a proxy, and the Ice runtime delivers each invocation to the target object.

A proxy can be null. A proxy can also dangle: point to a remote object that no longer exists.
