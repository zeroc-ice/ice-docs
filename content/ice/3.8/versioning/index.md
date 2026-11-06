---
title: Versioning
---

Applications built with different versions of your Slice definitions can communicate with each other, provided each
change preserves compatibility with the deployed clients and servers. You can evolve an application by adding operations
and types, by adding optional parameters and fields, or by adding facets.

## Adding Operations and Types

You can add operations to an existing interface, and add new types, without affecting the clients and servers built with
the earlier definitions.

For example, version 1 of the [Greeter](../greeter-example) application defines:

```slice
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

Version 2 adds an enumeration and an operation:

```slice
module VisitorCenter
{
    enum TimeOfDay { Morning, Afternoon, Night }

    interface Greeter
    {
        string greet(string name);
        string greetAtTime(string name, TimeOfDay time);
    }
}
```

Version 1 clients keep working with version 2 servers: the Ice protocol identifies an operation by its name, and `greet`
is unchanged.

A version 2 client that calls `greetAtTime` on a version 1 server receives an `OperationNotExistException`. Upgrade the
servers before the clients, or catch this exception in the version 2 client and fall back to `greet`.

## Adding Optional Parameters and Fields

You can add an [optional parameter](../slice/operations#optional-parameters-and-return-values) to an existing operation
without breaking the clients and servers built with the earlier definition. For example, version 2 could instead extend
`greet`:

```slice
module VisitorCenter
{
    enum TimeOfDay { Morning, Afternoon, Night }

    interface Greeter
    {
        string greet(string name, optional(1) TimeOfDay time);
    }
}
```

A receiver ignores an optional parameter it does not know, and reads an optional parameter it does not receive as unset:

| Client    | Server    | `time`                                                                 |
| --------- | --------- | ---------------------------------------------------------------------- |
| version 2 | version 2 | received                                                               |
| version 2 | version 1 | ignored; the servant gets `name` alone                                 |
| version 1 | version 2 | unset; the servant handles it, for example with the version 1 greeting |

Likewise, you can add [optional fields](../slice/fields#optional-fields) to an existing class or exception.

The tag of an optional parameter or field identifies it across the versions of your Slice definitions. The scope of a
tag is an operation, for its parameters and return value, or a class or exception, for the fields it declares. Within
this scope:

- Adding an optional parameter or field with an unused tag is a compatible change.
- Removing one is a compatible change. Don't reuse its tag while applications built with the earlier definition are
  still deployed.
- Making a required parameter or field optional, or an optional one required, is an incompatible change.

## Adding Facets

A [facet](../runtime/facets) adds an interface to an existing Ice object without changing the interface the object
already implements. Use a facet when you cannot make the change compatibly, for example when `greet` needs a new
required parameter:

```slice
module VisitorCenter
{
    enum TimeOfDay { Morning, Afternoon, Night }

    interface GreeterV2
    {
        string greet(string name, TimeOfDay time);
    }
}
```

The server keeps its `Greeter` servant as the default facet of the Ice object, and adds a `GreeterV2` servant as the
`v2` facet of the same Ice object. The two proxies below share the identity `greeter` and differ only by facet:

```text
greeter:tcp -h localhost -p 4061
greeter -f v2:tcp -h localhost -p 4061
```

Version 1 clients keep using the default facet, and version 2 clients use the `v2` facet. A version 2 client that calls
the `v2` facet on a version 1 server receives a `FacetNotExistException`. As with a new operation, upgrade the servers
first, or catch this exception and fall back to the default facet.

## See Also

- [Facets](../runtime/facets)
- [Syntax for Stringified Proxies](../runtime/invocation/syntax-for-stringified-proxies)
