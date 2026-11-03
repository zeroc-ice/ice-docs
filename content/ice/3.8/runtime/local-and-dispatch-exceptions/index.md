---
title: Local and Dispatch Exceptions
---

## Local Exceptions

The Ice runtime reports errors by throwing _local exceptions_, which derive from
[LocalException](api:Ice/LocalException): for example, when it cannot establish a connection or when an invocation times
out. Some Ice APIs also throw standard exceptions, such as `std::invalid_argument` in C++ or `IllegalArgumentException`
in Java.

Local exceptions are not defined in Slice. [User exceptions](../../slice/exceptions) are: they derive from
[UserException](api:Ice/UserException), and are the error results of operations, which you receive only from twoway
invocations.

## Dispatch Exceptions

A _dispatch exception_ is a local exception that reports the failure of the dispatch of a twoway request, such as a
request for an Ice object that the object adapter does not have. The failure reaches the caller as a
[reply status](../../protocol/protocol-messages#reply-message-body), and Ice throws the corresponding dispatch exception
in the caller.

Dispatch exceptions derive from [DispatchException](api:Ice/DispatchException), whose `replyStatus` field holds the
reply status:

- [ObjectNotExistException](api:Ice/ObjectNotExistException), [FacetNotExistException](api:Ice/FacetNotExistException),
  and [OperationNotExistException](api:Ice/OperationNotExistException) derive from
  [RequestFailedException](api:Ice/RequestFailedException), which carries the identity, facet, and operation of the
  request.
- [UnknownLocalException](api:Ice/UnknownLocalException) and [UnknownUserException](api:Ice/UnknownUserException) derive
  from [UnknownException](api:Ice/UnknownException), which reports a dispatch that failed with an exception that is
  neither a local exception nor a user exception.
- For the other reply statuses, such as `InvalidData`, `Unauthorized`, and `NotSupported`, Ice throws a
  `DispatchException` with this reply status.

A servant can throw a dispatch exception, which the caller receives. When a servant throws another local exception, the
caller receives an `UnknownLocalException`, and for any other exception except a user exception, an `UnknownException`.
Ice also throws `UnknownUserException` in a client when a reply carries a user exception that is not in the exception
specification of the operation.

## See Also

- [User Exceptions](../../slice/exceptions)
- [Protocol Messages](../../protocol/protocol-messages)
