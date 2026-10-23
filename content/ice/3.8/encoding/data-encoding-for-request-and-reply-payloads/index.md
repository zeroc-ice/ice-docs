---
title: Data Encoding for Request and Reply Payloads
sidebarLabel: Request and Reply Payloads
---

The [request](../../protocol/protocol-messages#request-message-body),
[batch request](../../protocol/protocol-messages#batch-request-message-body), and
[reply](../../protocol/protocol-messages#reply-message-body) messages of the Ice protocol carry the parameters, return
value, or user exception of an operation in an [encapsulation](../basic-data-encoding#encoding-for-encapsulations). This
page describes the contents of these encapsulations.

## Request Payload

The `params` encapsulation of a request holds the in-parameters of the operation:

1. The required in-parameters, in order of declaration.
2. The [optional](../data-encoding-for-optional-values) in-parameters that have a value, sorted by tag in ascending
   order.

No [end marker](../data-encoding-for-optional-values) follows the optional in-parameters: the end of the encapsulation
marks their end. If the operation has no in-parameters, the encapsulation is empty.

The encapsulation has the encoding version of the proxy that sends the request.

## Reply Payload

A reply with status `Ok` or `UserException` carries an encapsulation with the encoding version of the request's `params`
encapsulation.

### Ok Reply Payload

For reply status `Ok`, the encapsulation holds the out-parameters and the return value of the operation:

1. The required out-parameters, in order of declaration.
2. The required return value, if any.
3. The [optional](../data-encoding-for-optional-values) out-parameters and the optional return value that have a value,
   sorted by tag in ascending order.

No end marker follows the optional values: the end of the encapsulation marks their end. If the operation has a `void`
return type and no out-parameters, the encapsulation is empty.

The [optional parameters example](../data-encoding-for-optional-values#optional-parameters-example) shows a request
payload and an `Ok` reply payload byte by byte.

### User Exception Reply Payload

For reply status `UserException`, the encapsulation holds the user exception, marshaled as described in
[Data Encoding for Exceptions](../data-encoding-for-exceptions).

## Encoding Version 1.0

Optional values require encoding version 1.1. With version 1.0, the payload holds the required parameters and the
required return value only.

## See Also

- [Protocol Messages](../../protocol/protocol-messages)
- [Basic Data Encoding](../basic-data-encoding)
- [Data Encoding for Optional Values](../data-encoding-for-optional-values)
- [Data Encoding for Exceptions](../data-encoding-for-exceptions)
- [Operations](../../slice/operations)
