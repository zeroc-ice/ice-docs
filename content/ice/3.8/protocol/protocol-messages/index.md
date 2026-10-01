---
title: Protocol Messages
---

The Ice protocol uses five messages:

- Request (from client to server)
- Batch request (from client to server)
- Reply (from server to client)
- Validate connection (from server to client)
- Close connection (client to server or server to client)

Of these messages, validate and close connection only apply to connection-oriented transports such as `tcp`.

As with the [Ice Encoding](../encoding), protocol messages have no alignment restrictions. Each message consists of a
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
Ice protocol 1.0, the encoding version is always 1.0.

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

| **Field**   | **Description**                                                                      |
| ----------- | ------------------------------------------------------------------------------------ |
| `requestId` | The request identifier                                                               |
| `id`        | The [object identity](../object-identity)                                            |
| `facet`     | The [facet](../versioning) name (zero- or one-element sequence)                      |
| `operation` | The operation name                                                                   |
| `mode`      | A byte representation of `Ice::OperationMode` (`0`=normal, `2`=idempotent)           |
| `context`   | The invocation [context](../request-contexts)                                        |
| `params`    | The [encapsulated](../basic-data-encoding) input parameters, in order of declaration |

The request identifier zero (`0`) is reserved for use in [oneway](../oneway-invocations) requests and indicates that the
server must not send a reply to the client. A non-zero request identifier must uniquely identify the request on a
connection, and must not be reused while a reply for the identifier is outstanding.

The `facet` field has either zero elements or one element. An empty sequence denotes the default facet, and a
one-element sequence provides the facet name in its first field. If a receiver receives a request with a `facet` field
with more than one element, it must throw a `MarshalException`.

## Batch Request Message Body

A [batch](../batched-invocations) request message contains one or more oneway requests, bundled together for the sake of
efficiency. A batch request message is encoded as integer (not a size) that specifies the number of requests in the
batch, followed by the corresponding number of requests, encoded as if each request were the following structure:

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

| **Field**   | **Description**                                                 |
| ----------- | --------------------------------------------------------------- |
| `id`        | The [object identity](../object-identity)                       |
| `facet`     | The [facet](../versioning) name (zero- or one-element sequence) |
| `operation` | The operation name                                              |
| `mode`      | A byte representation of `Ice::OperationMode`                   |
| `context`   | The request [context](../request-contexts)                      |
| `params`    | The encapsulated input parameters, in order of declaration      |

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
the requester to associate the reply with the [original request](../protocol-messages).

The byte following the request ID indicates the status of the request. The reply payload follows the status byte; its
format depends on the status value. The possible reply status values are shown in the table below (most of these values
correspond to [common exceptions](../local-and-dispatch-exceptions)).

| **Reply status**            | **Numeric value** | **Description**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------- | ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ok                          | `0`               | The dispatch completed successfully. The reply payload is an [encapsulation](../basic-data-encoding) containing out-parameters (in the order of declaration) followed by the return value of the operation, encoded according to their types as specified by the [Ice Encoding](../encoding). If an operation declares a `void` return type and no out-parameters, an empty encapsulation is encoded.                                                                                                                                                                                                                                                                                                            |
| User exception              | `1`               | The dispatch completed with a user exception. The reply payload is an [encapsulation](../basic-data-encoding) containing the [encoded user exception](../data-encoding-for-exceptions).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Object does not exist       | `2`               | The dispatch completed with an `ObjectNotExistException`. The reply payload is the following Slice 1.0-encoded structure (it's not enclosed in an encapsulation): `struct RequestFailedData { Ice::Identity id; Ice::StringSeq facet; string operation; }` where `id` is the object identity of the target object, `facet` is the optional facet of the target object, and `operation` is the operation name. The `facet` field has either zero elements or one element. An empty sequence denotes the default facet, and a one-element sequence provides the facet name in its first field. If a receiver receives a reply with a `facet` field with more than one element, it must throw a `MarshalException`. |
| Facet does not exist        | `3`               | The dispatch completed with a `FacetNotExistException`. The reply payload is the same as for reply status 2.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Operation does not exist    | `4`               | The dispatch completed with an `OperationNotExistException`. The reply payload is the same as for reply status 2.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Unknown Ice local exception | `5`               | The dispatch completed with an exception defined in local Slice. The reply payload is an Ice 1.0-encoded string that describes the exception.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Unknown Ice user exception  | `6`               | The dispatch completed with an exception defined in Slice that does not match any exception in the operation's exception specification. The reply payload is an Ice 1.0-encoded string that describes the exception.Ice does not enforce exception specifications on the server-side: Ice always encodes a Slice-defined exception in a reply status = 1 reply. The conversion into an `UnknownUserException` (if appropriate) is performed by the client-side generated code.                                                                                                                                                                                                                                   |
| Unknown exception           | `7`               | The dispatch completed with another type of exception. The reply payload is an Slice 1.0-encoded string that describes the exception.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Invalid data                | `8`               | The dispatch failed because the request payload could not be unmarshaled. The reply payload is an Ice 1.0-encoded string that describes the exception.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Unauthorized                | `9`               | The caller is not authorized to access the requested resource. The reply payload is an Ice 1.0-encoded string that describes the exception.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Other                       | `10` to `255`     | The dispatch failed for some other reason.The reply payload is an Ice 1.0-encoded string that describes the exception.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |

## Validate Connection Message

A server sends a validate connection message when it receives a new connection.

{% callout type="info" %}

Validate connection messages are only used for connection-oriented transports.

{% /callout %}

The message indicates that the server is ready to receive requests; the client must not send any messages on the
connection until it has received the validate connection message from the server. No reply to the message is expected by
the server.

The purpose of the validate connection message is two-fold:

- It confirms to the client that the server is indeed an Ice server and not another type of server reached by accident.
- It prevents the client from writing a request message to its local transport buffers until after the server has
  acknowledged that it can actually process the request. This avoids a race condition caused by the server's TCP/IP
  stack accepting connections in its backlog while the server is in the process of shutting down: if the client were to
  send a request in this situation, the request would be lost but the client could not safely re-issue the request
  because that might violate at-most-once semantics. The validate connection message guarantees that a server is not in
  the middle of shutting down when the server's TCP/IP stack accepts an incoming connection and so avoids the race
  condition.

{% callout type="info" %}

Validate connection messages may also be sent at any time by either side as a heartbeat.

{% /callout %}

The [message header](#message-header) comprises the entire validate connection message. The
[compression](../protocol-compression) status of a validate connection message is always `0`.

## Close Connection Message

A close connection message is sent when a peer is about to gracefully shutdown a [connection](../connection-management).

{% callout type="info" %}

Close connection messages are only used for connection-oriented transports.

{% /callout %}

The [message header](#message-header) comprises the entire close connection message. The
[compression](../protocol-compression) status of a close connection message is always `0`.

Either client or server can initiate connection closure.

This means that connection closure can be initiated at will by either end of a connection; most importantly, no state is
associated with a connection as far as the object model or application semantics are concerned.

The client side can close a connection whenever no reply for a request is outstanding on the connection. The sequence of
events is:

1. The client sends a close connection message.
2. The client closes the writing end of the connection.
3. The server responds to the client's close connection message by closing the connection.

The server side can close a connection whenever no operation invocation is in progress that was invoked via that
connection. This guarantees that the server will not violate [at-most-once semantics](../automatic-retries): an
operation, once invoked in a servant, is allowed to complete and its results are returned to the client. Note that the
server can close a connection even after it has received a request from the client, provided that the request has not
yet been passed to a servant. In other words, if the server decides that it wants to close a connection, the sequence of
events is:

1. The server discards all incoming requests on the connection.
2. The server waits until all still executing requests have completed and their results have been returned to the
   client.
3. The server sends a close connection message to the client.
4. The server closes its writing end of the connection.
5. The client responds to the server's close connection message by closing both its reading and writing ends of the
   connection.
6. If the client has outstanding requests at the time it receives the close connection message, it re-issues these
   requests on a new connection. Doing so is guaranteed not to violate at-most-once semantics because the server
   guarantees not to close a connection while requests are still in progress on the server side.

## Protocol State Machine

From a client's perspective, the Ice protocol behaves according to the state machine shown below:

![Ice protocol state machine from inactive through active and graceful close to the final closed state.](/attachments/3.8/protocol-messages/protocol-state-machine.svg)

_Protocol state machine._

To summarize, a new connection is inactive until a [validate connection](../protocol-messages) message has been received
by the client, at which point the active state is entered. The connection remains in the active state until it is shut
down, which can occur when there are no more proxies using the connection, or after the connection has been idle for a
while. At this point, the connection is [gracefully closed](../connection-closure), meaning that a
[close connection](../protocol-messages) message is sent, and the connection is closed.

## Disorderly Connection Closure

Any violation of the protocol or encoding rules results in a disorderly connection closure: the side of the connection
that detects a violation unceremoniously closes it (without sending a close connection message or similar). There are
many potential error conditions that can lead to disorderly connection closure; for example, the receiver might detect
that a message has a bad magic number or incompatible version, receive a reply with an ID that does not match that of an
outstanding request, receive a validate connection message when it should not, or find illegal data in a request (such
as a negative size, or a size that disagrees with the actual data that was unmarshaled).

## See Also

- [Protocol Compression](../protocol-compression)
- [Object Identity](../object-identity)
- [Versioning](../versioning)
- [Request Contexts](../request-contexts)
- [Oneway Invocations](../oneway-invocations)
- [Batched Invocations](../batched-invocations)
- [Automatic Retries](../automatic-retries)
- [Connection Closure](../connection-closure)
