---
title: Versioning
---

You can change the Slice definitions of an application and keep it compatible with the clients and servers already
deployed. This page describes two such changes: adding operations and types, and adding optional parameters and fields.

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

Version 1 clients keep working with version 2 servers: version 2 changes nothing that version 1 defines.

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

A client and a server recognize an optional parameter or field by its tag, the number in `optional(1)`, and not by its
name. The scope of a tag is an operation, for its parameters and return value, or a class or exception, for the fields
it declares. Within this scope:

- Adding an optional parameter or field with an unused tag is a compatible change.
- Removing one is a compatible change. Don't reuse its tag while applications built with the earlier definition are
  still deployed.
- Making a required parameter or field optional, or an optional one required, is an incompatible change.

## See Also

- [Optional Parameters and Return Values](../slice/operations#optional-parameters-and-return-values)
- [Optional Fields](../slice/fields#optional-fields)
