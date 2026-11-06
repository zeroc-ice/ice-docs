---
title: Local and Dispatch Exceptions
---

## Local Exceptions

The Ice runtime reports errors by throwing _local exceptions_, which derive from
[LocalException](api:Ice/LocalException): for example, when it cannot establish a connection or when an invocation times
out. Some Ice APIs also throw standard exceptions, such as `std::invalid_argument` in C++ or `IllegalArgumentException`
in Java.

The exceptions you define in Slice are [user exceptions](../../slice/exceptions). A user exception is an error result of
an operation, which you receive only from a twoway invocation. In every language mapping, the class mapped from a Slice
exception derives from [UserException](api:Ice/UserException).

## Dispatch Exceptions

A _dispatch exception_ is a local exception that reports the failure of the dispatch of a twoway request, such as a
request for an Ice object that the object adapter does not host. The object adapter reports this failure with the
[reply status](../../protocol/protocol-messages#reply-message-body) of its reply message, and Ice throws the
corresponding dispatch exception in the caller.

Dispatch exceptions derive from [DispatchException](api:Ice/DispatchException), whose `replyStatus` field holds the
reply status. For the reply statuses `ObjectNotExist` through `UnknownException`, Ice throws the exception class named
after the reply status; for the other reply statuses, such as `InvalidData`, `Unauthorized`, and `NotSupported`, it
throws a `DispatchException`.

[ObjectNotExistException](api:Ice/ObjectNotExistException), [FacetNotExistException](api:Ice/FacetNotExistException),
and [OperationNotExistException](api:Ice/OperationNotExistException) derive from
[RequestFailedException](api:Ice/RequestFailedException), which carries the identity, facet, and operation of the
request. [UnknownLocalException](api:Ice/UnknownLocalException) and [UnknownUserException](api:Ice/UnknownUserException)
derive from [UnknownException](api:Ice/UnknownException).

A servant can throw a dispatch exception, which the caller receives. When a servant throws another local exception, the
caller receives an `UnknownLocalException`, and for an exception that is neither a local exception nor a user exception,
an `UnknownException`. Ice throws `UnknownUserException` locally, in the caller, when a reply carries a user exception
that is not in the exception specification of the operation.

## See Also

- [User Exceptions](../../slice/exceptions)
- [Protocol Messages](../../protocol/protocol-messages)
