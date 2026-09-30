---
title: Versioning Through Incremental Updates
---

Ice allows you to update your applications and Slice definitions in a backwards-compatible manner - letting existing
applications (using the current Slice definitions) and updated applications (using the updated Slice definitions) easily
and safely communicate with each other.

You can safely update your Slice definitions using the techniques described on this page:

## Adding Operations and Types

Suppose that we’ve already deployed our [Greeter](../../greeter-example) application (version 1) and want to add extra
functionality to a new version (version 2). Specifically, let’s say we want to add a new greeting that depends on the
time of day. How can we upgrade the existing application with this new functionality? Let’s start by looking at the
original:

```slice
// Version 1
module VisitorCenter
{
    interface Greeter
    {
        string greet(string name);
    }
}
```

And then adding this new functionality could look like:

```slice
// Version 2
module VisitorCenter
{
    enum TimeOfDay // new in version 2
    {
        Morning,
        Afternoon,
        Night
    }

    interface Greeter
    {
        string greet(string name);

        string greetAtTime(string name, TimeOfDay time); // new in version 2
    }
}
```

Note that the version 2 file does not change anything that was present in version 1; it only adds things (1 new type and
1 new operation). Because of this, we’re guaranteed that version 1 clients can continue working with both version 1 and
version 2 `Greeter` objects. Version 1 clients do not know or care about this new type or new operation and so it does
not affect them. And Version 2 clients are free to use this new functionality.

The reason this works is that the Ice protocol invokes an operation by sending the operation name as a string, rather
than an ordinal number or hash value. So it’s safe to add new operations to existing interfaces without recompiling all
the clients.

However, this approach contains a tacit assumption: that no version 2 client will ever use a version 1 object. If the
assumption is violated (i.e. a version 2 client uses a version 1 object), the version 2 client will receive an
`OperationNotExistException` when it invokes the new `greetAtTime` operation because that operation is supported only by
version 2 objects.

Whether you can make this assumption depends on your application. In some cases, it may be possible to ensure that
version 2 clients will never access a version 1 object, for example, by simultaneously upgrading all servers from
version 1 to version 2, or by taking advantage of application-specific constraints that ensure that version 2 clients
only contact version 2 objects. However, for some applications, doing this is impractical.

Note that you could write version 2 clients to catch and react to an `OperationNotExistException` when they invoke the
`greetAtTime` operation: if the operation succeeds, the client is dealing with a version 2 object, and if the operation
raises `OperationNotExistException`, the client is dealing with a version 1 object.

## Optional Parameters and Fields

Another way to upgrade our application is by using [optional parameters](../../slice/operations) or fields. These can be
added to existing operations/definitions without breaking clients or servers that don’t know about them. For example,
another approach to upgrading our `Greeter` application would have been:

```slice
// Version 2
module VisitorCenter
{
    enum TimeOfDay // new in version 2
    {
        Morning,
        Afternoon,
        Night
    }

    interface Greeter
    {
        string greet(string name, optional(1) TimeOfDay time);
    }
}
```

A version 2 client can supply the `time` argument. A version 2 servant receives this value, while a version 1 server
skips it and dispatches the request to its servant with `name` alone. A version 1 client sends only `name`: the version
2 servant then receives `time` unset, and has to handle this case, for example by returning the version 1 greeting.

Ice transmits optional values with the 1.1 encoding, which is the default. When a proxy uses the 1.0 encoding, Ice
leaves every optional value out of the request and of its reply, and the receiver reads each of them as unset.

Likewise, you can add optional fields to an existing class or exception without breaking existing applications that use
it. See the [optional fields](../../slice/fields#optional-fields) page for more information.

### Changing Optional Parameters and Fields

Ice [encodes](../../encoding/data-encoding-for-optional-values) an optional value that is set as its tag and an _optional type_
derived from its Slice type, followed by the value. The receiver looks up each optional value it knows by tag, skips the
values whose tags it does not know, and reads as unset a value whose tag is missing. The name of the parameter or field
is not transmitted. The consequences for applications built with different versions of a Slice definition are as
follows:

- Adding an optional parameter or field with a tag that no earlier version used is a compatible change, as shown above.
- Removing an optional parameter or field is a compatible change: a receiver built without it skips the value, and a
  receiver built with it reads it as unset. Keep the tag of a removed parameter or field unused as long as applications
  built with the earlier definition remain deployed, since a receiver decodes any value carrying this tag as the
  parameter or field it knows under this tag.
- Changing the tag of an optional parameter or field to a tag that the earlier version does not use loses its value
  between the two versions: each side skips the tag the other side sends and reads its own as unset.
- Changing the type of an optional parameter or field while keeping its tag is an incompatible change. When the two
  types have different optional types, such as `int` and `long`, the receiver raises `MarshalException`. When they share
  an optional type, such as `int` and `float`, the receiver decodes the bytes of one type as the other, and either
  produces a wrong value or raises `MarshalException`.
- Making a required parameter or field optional, or an optional one required, is an incompatible change. Ice encodes
  required values without a tag, in their order of declaration and ahead of the optional values, so a receiver built
  with the other definition looks for the value in the wrong place.

These rules apply within the scope of a tag: the parameters and return value of one operation, or the fields that one
class or exception defines itself. A base or derived type has its own tags.

## See Also

- [Optional Parameters and Return Values](../../slice/operations#optional-parameters-and-return-values)
- [Data Encoding for Optional Values](../../encoding/data-encoding-for-optional-values)
