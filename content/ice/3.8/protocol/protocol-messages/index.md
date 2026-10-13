---
title: Protocol Messages
---

The Ice protocol uses five messages:

- Request (from client to server)
- Batch request (from client to server)
- Reply (from server to client)
- Validate connection (from server to client to establish the connection, then from either side as a heartbeat)
- Close connection (client to server or server to client)

Of these messages, validate and close connection only apply to connection-oriented transports such as `tcp`.

As with the [Ice Encoding](../../encoding), protocol messages have no alignment restrictions. Each message consists of a
message header and (except for validate and close connection) a message body that immediately follows the header.

## Message Header

Each protocol message has a 14-byte header that is encoded as if it were the following structure:

```slice
struct HeaderData
{
    int  magic;
    byte protocolMajor;
    byte protocolMinor;
    byte encodingMajor;
    byte encodingMinor;
    byte messageType;
    byte compressionStatus;
    int  messageSize;
}
```

The message header fields are described in the following table.

| **Field**           | **Description**                                                                                                |
| ------------------- | -------------------------------------------------------------------------------------------------------------- |
| `magic`             | A four-byte magic number consisting of the ASCII-encoded values of 'I', 'c', 'e', 'P' (0x49, 0x63, 0x65, 0x50) |
| `protocolMajor`     | The Ice protocol major version number, always 1                                                                |
| `protocolMinor`     | The Ice protocol minor version number, always 0                                                                |
| `encodingMajor`     | The Ice encoding major version number, always 1                                                                |
| `encodingMinor`     | The Ice encoding minor version number, always 0                                                                |
| `messageType`       | The message type                                                                                               |
| `compressionStatus` | The [compression](../protocol-compression) status of the message                                               |
| `messageSize`       | The size of the message in bytes, including the header                                                         |

The valid message types are shown in the following table.

| **Message Type**    | **Encoding** |
| ------------------- | ------------ |
| Request             | `0`          |
| Batch request       | `1`          |
| Reply               | `2`          |
| Validate connection | `3`          |
| Close connection    | `4`          |

The encoding for the message bodies of each of these message types is described in the sections that follow.

## Request Message Body

A request message contains the data necessary to perform an invocation on an object, including the identity of the
object, the operation name, and input parameters. A request message is encoded as if it were the following structure:

```slice
struct RequestData
{
    int requestId;
    Ice::Identity id;
    Ice::StringSeq facet;
    string operation;
    byte mode;
    Ice::Context context;
    Encapsulation params;
}
```

The request fields are described in the following table.

| **Field**   | **Description**                                                                                                                                 |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `requestId` | The request identifier                                                                                                                          |
| `id`        | The [object identity](../../runtime/object-identity)                                                                                            |
| `facet`     | The [facet](../../runtime/facets) name (zero- or one-element sequence)                                                                          |
| `operation` | The operation name                                                                                                                              |
| `mode`      | A byte representation of `Ice::OperationMode`: `0` = `Normal`, `1` = `Nonmutating` (deprecated, equivalent to `Idempotent`), `2` = `Idempotent` |
| `context`   | The invocation [context](../../runtime/invocation/request-contexts)                                                                             |
| `params`    | The [encapsulated](../../encoding/basic-data-encoding) input parameters                                                                         |

The `params` encapsulation holds the required input parameters in order of declaration, followed by the
[optional](../../encoding/data-encoding-for-optional-values) input parameters sorted by tag.

The request identifier zero (`0`) is reserved for use in
[oneway](../../runtime/invocation/invocation-mode/oneway-invocations) requests and indicates that the server must not
send a reply to the client. The sender gives each of its outstanding twoway requests on the connection a distinct
non-zero request identifier.

The `facet` field has either zero elements or one element. An empty sequence denotes the default facet, and a
one-element sequence provides the facet name in its first field. If a receiver receives a request with a `facet` field
with more than one element, it must throw a `MarshalException`.

## Batch Request Message Body

A [batch](../../runtime/invocation/invocation-mode/batched-invocations) request message contains one or more oneway
requests, bundled together for the sake of efficiency. A batch request message is encoded as integer (not a size) that
specifies the number of requests in the batch, followed by the corresponding number of requests, encoded as if each
request were the following structure:

```slice
struct BatchRequestData
{
    Ice::Identity id;
    Ice::StringSeq facet;
    string operation;
    byte mode;
    Ice::Context context;
    Encapsulation params;
}
```

The batch request fields are described in the following table.

| **Field**   | **Description**                                                                         |
| ----------- | --------------------------------------------------------------------------------------- |
| `id`        | The [object identity](../../runtime/object-identity)                                    |
| `facet`     | The [facet](../../runtime/facets) name (zero- or one-element sequence)                  |
| `operation` | The operation name                                                                      |
| `mode`      | A byte representation of `Ice::OperationMode`, as in a [request](#request-message-body) |
| `context`   | The request [context](../../runtime/invocation/request-contexts)                        |
| `params`    | The encapsulated input parameters                                                       |

Note that no request ID is necessary for batch requests because only oneway invocations can be batched.

The `facet` field has either zero elements or one element. An empty sequence denotes the default facet, and a
one-element sequence provides the facet name in its first field. If a receiver receives a batch request with a `facet`
field with more than one element, it must throw a `MarshalException`.

## Reply Message Body

A reply message body contains the result of a twoway dispatch, including any return value, out-parameters, or exception.
A reply message body is encoded as if it were the following structure:

```slice
struct ReplyData
{
    int requestId;
    byte replyStatus;
    byte[messageSize - 19] replyPayload; // pseudo-Slice
}
```

The first four bytes of a reply message body contain a request ID. The request ID matches an outgoing request and allows
the requester to associate the reply with the [original request](./). The requester ignores a reply whose request ID
does not match that of an outstanding request, such as the reply to a request that timed out.

The byte following the request ID indicates the status of the request, and the reply payload follows the status byte.
The table below shows the possible reply status values; the first column gives the corresponding
[ReplyStatus](api:Ice/ReplyStatus) enumerator.

| **Reply status**        | **Numeric value** | **Payload**                                                                  | **Description**                                                                                                                                                         |
| ----------------------- | ----------------- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Ok`                    | `0`               | [Encapsulation containing the results](#ok-reply-payload)                    | The dispatch completed successfully.                                                                                                                                    |
| `UserException`         | `1`               | [Encapsulation containing the user exception](#user-exception-reply-payload) | The dispatch completed with a Slice user exception.                                                                                                                     |
| `ObjectNotExist`        | `2`               | [`RequestFailedData`](#request-failed-reply-payload)                         | The dispatch could not find an implementation for the target object.                                                                                                    |
| `FacetNotExist`         | `3`               | [`RequestFailedData`](#request-failed-reply-payload)                         | The dispatch found an implementation for the target object but could not find the requested facet.                                                                      |
| `OperationNotExist`     | `4`               | [`RequestFailedData`](#request-failed-reply-payload)                         | The dispatch found an implementation for the target object but could not find the requested operation.                                                                  |
| `UnknownLocalException` | `5`               | `string`                                                                     | The dispatch failed with an Ice local exception.                                                                                                                        |
| `UnknownUserException`  | `6`               | `string`                                                                     | The dispatch failed with a Slice user exception that does not conform to the exception specification of the operation.                                                  |
| `UnknownException`      | `7`               | `string`                                                                     | The dispatch failed with some other exception (neither an Ice local exception nor a Slice user exception).                                                              |
| `InvalidData`           | `8`               | `string`                                                                     | The dispatch failed because the request payload could not be unmarshaled. It is typically due to a mismatch in the Slice definitions used by the client and the server. |
| `Unauthorized`          | `9`               | `string`                                                                     | The caller is not authorized to access the requested resource.                                                                                                          |
| `NotSupported`          | `10`              | `string`                                                                     | The dispatch failed because the request requires a feature that the server or the target servant does not support.                                                      |
|                         | `11` to `255`     | `string`                                                                     | The dispatch failed for some other reason.                                                                                                                              |

Only the payloads of reply statuses 0 and 1 are [encapsulations](../../encoding/basic-data-encoding); the
`RequestFailedData` and `string` payloads follow the status byte directly.

### Ok Reply Payload

For reply status 0, the reply payload is an encapsulation that holds the required out-parameters in order of
declaration, followed by the return value if it is required, followed by the
[optional](../../encoding/data-encoding-for-optional-values) out-parameters and optional return value sorted by tag. If
an operation declares a `void` return type and no out-parameters, the encapsulation is empty.

### User Exception Reply Payload

For reply status 1, the reply payload is an encapsulation that holds the
[encoded user exception](../../encoding/data-encoding-for-exceptions).

### Request Failed Reply Payload

For reply statuses 2, 3, and 4, the reply payload is the following structure:

```slice
struct RequestFailedData
{
    Ice::Identity id;
    Ice::StringSeq facet;
    string operation;
}
```

`id`, `facet`, and `operation` hold the identity, facet, and operation name of the target of the request. As in a
[request](#request-message-body), `facet` has either zero elements or one element.

## Validate Connection Message

A server sends a validate connection message when it accepts a new connection, to indicate that it is ready to receive
requests: the client must not send any message on this connection before it receives the validate connection message.
This message also confirms to the client that the server is indeed an Ice server and not another type of server reached
by accident.

{% callout type="note" %}

Validate connection messages are only used for connection-oriented transports.

{% /callout %}

{% callout type="note" %}

After the client receives this message, either side can also send validate connection messages as a heartbeat.

{% /callout %}

The [message header](#message-header) comprises the entire validate connection message. The
[compression](../protocol-compression) status of a validate connection message is always `0`.

## Close Connection Message

A close connection message is sent when a peer is about to gracefully shutdown a
[connection](../../runtime/connection-management).

{% callout type="note" %}

Close connection messages are only used for connection-oriented transports.

{% /callout %}

The [message header](#message-header) comprises the entire close connection message. The
[compression](../protocol-compression) status of a close connection message is always `0`.

Either side of a connection can initiate a graceful connection closure. The side that initiates the closure (the
initiator) proceeds as follows:

1. The initiator stops sending requests to the peer, and discards any request or batch request it receives from now on,
   without dispatching it.
2. The initiator waits until its outstanding invocations on the connection have completed, and until the dispatch of all
   the requests it accepted on the connection has completed and it has sent their replies.
3. The initiator sends a close connection message.
4. The initiator waits for the peer to close the connection, then closes the connection. If the peer does not close the
   connection within the
   [close timeout](../../property-reference/ice-connection-properties#ice.connection.name.closetimeout), the initiator
   aborts the connection.

The peer that receives the close connection message (the receiver) closes the connection.

Because of steps 1 and 2, the receiver can re-issue its outstanding requests on a new connection without violating
[at-most-once semantics](../../slice/operations#idempotent-operations). Ice retries these requests as described in
[Automatic Retries](../../runtime/invocation/automatic-retries), except for requests sent with a fixed proxy, which is
bound to the closed connection.

## Connection Abort

Either side can abort a connection at any time: it closes the connection without sending a close connection message. Ice
aborts a connection when it detects a violation of the protocol rules, such as a message with a bad magic number, when
it receives a message larger than its [message size limit](../../property-reference/ice-properties#ice.messagesizemax),
or when the connection does not receive any bytes for longer than the
[idle timeout](../../runtime/connection-management/connection-closure#the-idle-check).

With a datagram transport such as `udp`, the receiver discards a datagram that violates the protocol rules and keeps
receiving datagrams.

## See Also

- [Protocol Compression](../protocol-compression)
- [Object Identity](../../runtime/object-identity)
- [Versioning](../../versioning)
- [Request Contexts](../../runtime/invocation/request-contexts)
- [Oneway Invocations](../../runtime/invocation/invocation-mode/oneway-invocations)
- [Batched Invocations](../../runtime/invocation/invocation-mode/batched-invocations)
- [Automatic Retries](../../runtime/invocation/automatic-retries)
- [Connection Closure](../../runtime/connection-management/connection-closure)
