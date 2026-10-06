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
| `protocolMajor`     | The Ice protocol major version number                                                                          |
| `protocolMinor`     | The Ice protocol minor version number                                                                          |
| `encodingMajor`     | The Ice encoding major version number                                                                          |
| `encodingMinor`     | The Ice encoding minor version number                                                                          |
| `messageType`       | The message type                                                                                               |
| `compressionStatus` | The [compression](../protocol-compression) status of the message                                               |
| `messageSize`       | The size of the message in bytes, including the header                                                         |

The encoding version number represents the version of the Ice encoding used to encode fields of the Ice protocol
messages, such as `messageSize`. This encoding version depends on the protocol version and is therefore redundant. For
Ice protocol 1.0, the encoding version is always 1.0. Each encapsulation in a message body, such as the `params` of a
request, carries its own encoding version.

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

| **Field**   | **Description**                                                                                                                                                                                                                 |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `requestId` | The request identifier                                                                                                                                                                                                          |
| `id`        | The [object identity](../../runtime/object-identity)                                                                                                                                                                            |
| `facet`     | The [facet](../../runtime/facets) name (zero- or one-element sequence)                                                                                                                                                          |
| `operation` | The operation name                                                                                                                                                                                                              |
| `mode`      | A byte representation of `Ice::OperationMode`: `0` = `Normal`, `1` = `Nonmutating` (deprecated, equivalent to `Idempotent`), `2` = `Idempotent`                                                                                 |
| `context`   | The invocation [context](../../runtime/invocation/request-contexts)                                                                                                                                                             |
| `params`    | The [encapsulated](../../encoding/basic-data-encoding) input parameters: the required parameters in order of declaration, followed by the [optional parameters](../../encoding/data-encoding-for-optional-values) sorted by tag |

The request identifier zero (`0`) is reserved for use in
[oneway](../../runtime/invocation/invocation-mode/oneway-invocations) requests and indicates that the server must not
send a reply to the client. A non-zero request identifier must be unique among the sender's outstanding requests on the
connection.

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

| **Field**   | **Description**                                                                               |
| ----------- | --------------------------------------------------------------------------------------------- |
| `id`        | The [object identity](../../runtime/object-identity)                                          |
| `facet`     | The [facet](../../runtime/facets) name (zero- or one-element sequence)                        |
| `operation` | The operation name                                                                            |
| `mode`      | A byte representation of `Ice::OperationMode`, as in a [request](#request-message-body)       |
| `context`   | The request [context](../../runtime/invocation/request-contexts)                              |
| `params`    | The encapsulated input parameters, in the same order as in a [request](#request-message-body) |

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

This layout describes an uncompressed message. For a [compressed](../protocol-compression) message, it applies to the
decompressed message, and `messageSize` in this layout is the uncompressed message size that precedes the compressed
body.

The first four bytes of a reply message body contain a request ID. The request ID matches an outgoing request and allows
the requester to associate the reply with the [original request](./).

The byte following the request ID indicates the status of the request. The reply payload follows the status byte; its
format depends on the status value. The possible reply status values are shown in the table below (most of these values
correspond to [common exceptions](../../runtime/local-and-dispatch-exceptions)).

| **Reply status**            | **Numeric value** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------------------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ok                          | `0`               | The dispatch completed successfully. The reply payload is an [encapsulation](../../encoding/basic-data-encoding) containing the required out-parameters in order of declaration, followed by the return value if it is required, followed by the [optional](../../encoding/data-encoding-for-optional-values) out-parameters and optional return value sorted by tag, all encoded according to their types as specified by the [Ice Encoding](../../encoding). If an operation declares a `void` return type and no out-parameters, an empty encapsulation is encoded.                                                                                                                                         |
| User exception              | `1`               | The dispatch completed with a user exception. The reply payload is an [encapsulation](../../encoding/basic-data-encoding) containing the [encoded user exception](../../encoding/data-encoding-for-exceptions).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Object does not exist       | `2`               | The dispatch completed with an `ObjectNotExistException`. The reply payload is the following Ice 1.0-encoded structure (it's not enclosed in an encapsulation): `struct RequestFailedData { Ice::Identity id; Ice::StringSeq facet; string operation; }` where `id` is the object identity of the target object, `facet` is the optional facet of the target object, and `operation` is the operation name. The `facet` field has either zero elements or one element. An empty sequence denotes the default facet, and a one-element sequence provides the facet name in its first field. If a receiver receives a reply with a `facet` field with more than one element, it must throw a `MarshalException`. |
| Facet does not exist        | `3`               | The dispatch completed with a `FacetNotExistException`. The reply payload is the same as for reply status 2.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Operation does not exist    | `4`               | The dispatch completed with an `OperationNotExistException`. The reply payload is the same as for reply status 2.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Unknown Ice local exception | `5`               | The dispatch completed with an `UnknownLocalException` or with an Ice local exception other than a `DispatchException`, such as a `MarshalException` raised while unmarshaling the input parameters. The reply payload is an Ice 1.0-encoded string that describes the exception.                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Unknown Ice user exception  | `6`               | The dispatch completed with an `UnknownUserException`, for example one that the servant received from an invocation it made and did not catch. The reply payload is an Ice 1.0-encoded string that describes the exception. A servant that throws a Slice user exception produces reply status 1, even when this exception does not match the operation's exception specification; the client converts such an exception into an `UnknownUserException`.                                                                                                                                                                                                                                                       |
| Unknown exception           | `7`               | The dispatch completed with another type of exception. The reply payload is an Ice 1.0-encoded string that describes the exception.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Invalid data                | `8`               | The dispatch failed because the request payload could not be unmarshaled. The reply payload is an Ice 1.0-encoded string that describes the exception.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Unauthorized                | `9`               | The caller is not authorized to access the requested resource. The reply payload is an Ice 1.0-encoded string that describes the exception.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Not supported               | `10`              | The dispatch failed because the request requires a feature that the server or the target servant does not support. The reply payload is an Ice 1.0-encoded string that describes the exception.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Other                       | `11` to `255`     | The dispatch failed for some other reason. The reply payload is an Ice 1.0-encoded string that describes the exception. The client reports such a reply as a `DispatchException` that carries the reply status value.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

## Validate Connection Message

A server sends a validate connection message when it receives a new connection.

{% callout type="note" %}

Validate connection messages are only used for connection-oriented transports.

{% /callout %}

The message indicates that the server is ready to receive requests; the client must not send any messages on the
connection until it has received the validate connection message from the server. No reply to the message is expected by
the server.

The purpose of the validate connection message is two-fold:

- It confirms to the client that the server is indeed an Ice server and not another type of server reached by accident.
- It prevents the client from writing a request message to its local transport buffers until the server has accepted the
  connection at the Ice level. The server's TCP/IP stack can accept connections in its backlog while the server is in
  the process of shutting down: if the client were to send a request in this situation, the request would be lost but
  the client could not safely re-issue the request because that might violate at-most-once semantics. When the server
  closes such a connection without sending a validate connection message, the client knows that it has not sent any
  request on this connection.

{% callout type="note" %}

Once the connection is validated, either side can also send validate connection messages as a heartbeat.

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

1. The initiator discards any request or batch request it receives from now on, without dispatching it.
2. The initiator waits until the dispatch of all requests it accepted on the connection has completed and their replies
   have been sent.
3. The initiator sends a close connection message.
4. The initiator waits for the peer to close the connection. If the peer does not close the connection within the
   [close timeout](../../property-reference/ice-connection-properties#ice.connection.name.closetimeout), the initiator
   aborts the connection.

The peer that receives the close connection message (the receiver) closes the connection without waiting for its own
dispatches to complete.

When the application closes a connection, Ice starts this sequence once it has received the replies to all outstanding
requests sent on this connection; the close timeout also applies to this wait.

Because of steps 1 and 2, the receiver can re-issue its outstanding requests on a new connection without violating
[at-most-once semantics](../../runtime/invocation/automatic-retries). Ice retries these requests as described in
[Automatic Retries](../../runtime/invocation/automatic-retries), except for requests sent with a fixed proxy, which is
bound to the closed connection.

## Protocol State Machine

From a client's perspective, the Ice protocol behaves according to the state machine shown below:

![Ice protocol state machine from inactive through active and graceful close to the final closed state.](/images/ice/3.8/protocol-messages/protocol-state-machine.svg)

_Protocol state machine._

To summarize, a new connection is inactive until a [validate connection](#validate-connection-message) message has been
received by the client, at which point the active state is entered. The connection remains in the active state until one
side closes it. When the client initiates a
[graceful closure](../../runtime/connection-management/connection-closure#graceful-connection-closure), for example
because the application closed the connection or the connection remained inactive for longer than the
[inactivity timeout](../../runtime/connection-management/connection-closure#the-inactivity-check), the client sends a
[close connection](#close-connection-message) message and enters the graceful close state until the connection is
closed. The connection goes directly to the close state when the client receives a close connection message, or when Ice
aborts the connection, for example because the connection did not receive any bytes for longer than the
[idle timeout](../../runtime/connection-management/connection-closure#the-idle-check).

## Disorderly Connection Closure

On a connection-oriented transport, a violation of the protocol rules results in a disorderly connection closure: the
side of the connection that detects the violation unceremoniously closes it (without sending a close connection message
or similar). For example, the receiver closes the connection when a message has a bad magic number, an incompatible
version, a size smaller than the header size, or an unknown message type; when the client receives a message other than
validate connection before the connection is validated; or when it cannot unmarshal a request header in a request or
batch request: the fields that precede `params`, and the size and encoding version of the `params` encapsulation.

The receiver of a reply ignores a reply whose request ID does not match that of an outstanding request, such as the
reply to a request that timed out. Once the connection is validated, either side accepts a validate connection message
as a heartbeat.

When the dispatch of a request fails with an exception, including a failure to unmarshal the input parameters in
`params`, the receiver of the request keeps the connection open and, for a twoway request, sends a reply with the
corresponding [reply status](#reply-message-body), such as `5` for a `MarshalException`. In a batch request, the
receiver reads each request header from where the dispatch of the previous request stopped reading, so a failure to
unmarshal the input parameters of a batched request can leave the next request header unreadable, which closes the
connection.

With a datagram transport such as `udp`, the receiver discards a datagram with an invalid message header, an unknown
message type, or a body it cannot decompress, and keeps receiving datagrams; it logs a warning when
[Ice.Warn.Connections](../../property-reference/ice-warn-properties#ice.warn.connections) is set. It also discards a
datagram larger than its receive buffer, and logs a warning when
[Ice.Warn.Datagrams](../../property-reference/ice-warn-properties#ice.warn.datagrams) is set. A request header that the
receiver cannot unmarshal closes the datagram connection, as it does on a connection-oriented transport.

## See Also

- [Protocol Compression](../protocol-compression)
- [Object Identity](../../runtime/object-identity)
- [Versioning](../../versioning)
- [Request Contexts](../../runtime/invocation/request-contexts)
- [Oneway Invocations](../../runtime/invocation/invocation-mode/oneway-invocations)
- [Batched Invocations](../../runtime/invocation/invocation-mode/batched-invocations)
- [Automatic Retries](../../runtime/invocation/automatic-retries)
- [Connection Closure](../../runtime/connection-management/connection-closure)
