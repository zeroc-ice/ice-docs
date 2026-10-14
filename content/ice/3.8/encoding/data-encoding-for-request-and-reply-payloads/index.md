---
title: Data Encoding for Request and Reply Payloads
---

The [request](../../protocol/protocol-messages#request-message-body),
[batch request](../../protocol/protocol-messages#batch-request-message-body), and
[reply](../../protocol/protocol-messages#reply-message-body) messages of the Ice protocol carry the parameters, return
value, or user exception of an operation in an [encapsulation](../basic-data-encoding#encoding-for-encapsulations). This
page describes the contents of these encapsulations.

## Request Payload

The `params` encapsulation of a request holds the in-parameters of the operation:

1. The required in-parameters, in order of declaration.
2. The [optional](../data-encoding-for-optional-values) in-parameters, sorted by tag in ascending order. The client
   encodes an optional parameter only if it has a value.

If the operation has no in-parameters, the encapsulation is empty. The client encodes the encapsulation with the
encoding version of the proxy that sends the request.

## Reply Payload

A reply with status `Ok` or `UserException` carries an encapsulation. The server encodes this encapsulation with the
encoding version of the request's `params` encapsulation.

### Ok Reply Payload

For reply status `Ok`, the encapsulation holds the out-parameters and the return value of the operation:

1. The required out-parameters, in order of declaration.
2. The required return value, if any.
3. The [optional](../data-encoding-for-optional-values) out-parameters and the optional return value, sorted by tag in
   ascending order. The server encodes an optional out-parameter or return value only if it has a value.

If the operation has a `void` return type and no out-parameters, the encapsulation is empty.

The [optional parameters example](../data-encoding-for-optional-values#optional-parameters-example) shows a request
payload and an `Ok` reply payload byte by byte.

### User Exception Reply Payload

For reply status `UserException`, the encapsulation holds the user exception. The server encodes the user exception as
described in [Data Encoding for Exceptions](../data-encoding-for-exceptions).

## Encoding Version 1.0

With version 1.0, the sender omits the optional parameters and the optional return value, because optional values
require encoding version 1.1.

With version 1.0, when the type of an in-parameter is or contains a class, the class instances that the in-parameters
reference follow the last in-parameter, as described in
[Encoding a Class Graph Version 1.0](../data-encoding-for-classes/class-graphs#encoding-a-class-graph-version-1.0). The
same rule applies to the out-parameters and return value in an `Ok` reply payload. A user exception encoded with version
1.0 carries its class instances as described in
[Exception Encoding Version 1.0](../data-encoding-for-exceptions#exception-encoding-version-1.0).

## See Also

- [Protocol Messages](../../protocol/protocol-messages)
- [Basic Data Encoding](../basic-data-encoding)
- [Data Encoding for Optional Values](../data-encoding-for-optional-values)
- [Data Encoding for Exceptions](../data-encoding-for-exceptions)
- [Operations](../../slice/operations)
