---
id: local-and-dispatch-exceptions
title: Local and Dispatch Exceptions
---

# Local Exceptions

The Ice runtime reports errors to the application by throwing exceptions. Ice occasionally throws standard exceptions such as `std::invalid_argument`(C++) or `IllegalArgumentException`(Java), but generally it throws exceptions derived from [LocalException](https://code.zeroc.com/manual/Ice/LocalException). These exceptions are known as *local exceptions*.

As far as Ice is concerned, the opposite of a local exception is a user exception. [User exceptions](../exceptions) are defined in Slice and derive from [UserException](https://code.zeroc.com/manual/Ice/UserException); local exceptions are not defined in Slice and derive from `LocalException`.

{% callout type="info" %}
Even though user exceptions are nominally exceptions that you throw and catch, it’s better to think of them as error results. You may receive a user exception only when you make an invocation using a two-way proxy.
{% /callout %}

# Dispatch Exceptions

When a API call throws an exception, this exception is necessarily thrown in the same program and address space as the caller. This exception can represent an error that was detected locally by the Ice runtime (for example, failed to establish a connection), or it can represent an error that was reported “over the wire” by a remote Ice server (for example, could not find a servant to dispatch this request to).

In the Ice exception type system, all these exceptions are local exceptions, derived from `LocalException`. The exceptions that represent errors reported “over the wire” are a special kind of local exceptions, called dispatch exceptions.

A dispatch exception represents a failure that occurred in the server while dispatching an incoming request. If you get a dispatch exception, it means Ice was able to communicate with the server - and got a failure-response from the server.

{% callout type="info" %}
You can only get a dispatch exception when you make an invocation with a two-way proxy.
{% /callout %}

A dispatch information carries information transmitted in a [Reply](../ice-protocol) message, namely:

- a [ReplyStatus](https://code.zeroc.com/manual/Ice/ReplyStatus) enumerator
- one or more fields that depend on the `ReplyStatus` enumerator

| **ReplyStatus** | **Associated Exception Class** (if any) | **Fields** |
| --- | --- | --- |
| `ObjectNotExist` | `ObjectNotExistException` | `Identity id`  `string facet`  `string operation` |
| `FacetNotExist` | `FacetNotExistException` | `Identity id`  `string facet`  `string operation` |
| `OperationNotExist` | `OperationNotExistException` | `Identity id`  `string facet`  `string operation` |
| `UnknownLocalException` | `UnknownLocalException` | `string message` |
| `UnknownUserException` | `UnknownUserException` | `string message` |
| `UnknownException` | `UnknownException` | `string message` |
| `InvalidData` | | |
| `Unauthorized` | | |
| Any other value greater than `Unauthorized` | | |

A dispatch exception without an associated exception class is an instance of [DispatchException](https://code.zeroc.com/manual/Ice/DispatchException) . The `NotExist` and `Unknown` exceptions all ultimately derive from `DispatchException`.
