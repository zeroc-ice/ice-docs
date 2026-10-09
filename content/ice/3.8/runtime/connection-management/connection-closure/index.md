---
title: Connection Closure
---

An Ice communicator creates, reuses and eventually closes outgoing connections, while an object adapter accepts and
eventually closes incoming connections.

A connection closure can be either graceful or abortive. A graceful close requires coordination with the peer, and
therefore can take some time, while an abort is immediate.

The timeouts described on this page are [Ice.Connection.\*](../../../property-reference/ice-connection-properties)
properties: the `Ice.Connection.Client.*` properties configure outgoing connections and, in language mappings that
accept incoming connections, the [adapter.Connection.\*](../../../property-reference/object-adapter-properties)
properties configure the incoming connections of an object adapter and default to the `Ice.Connection.Server.*`
properties. The idle check and the inactivity check apply only to connection-oriented transports.

## The Idle Check

Once a connection is established, Ice aborts a connection when a read or write on this connections fails.

But what happens when there is no read or write activity on a connection? For example, an object adapter may be
listening for requests from a dead client, but there is nothing to read or write from that client (remember, it’s dead).
Likewise, a client may send a request to a server and not hear back from this server for while–it could because the
request dispatch takes a while, or because the connection dropped.

Ice provides a simple mechanism to monitor connection health: the idle check. If a connection waits to read a byte for
over [IdleTimeout](../../../property-reference/ice-connection-properties), the connection is considered idle and
aborted.

The default idle timeout is 60 seconds. Setting `IdleTimeout` to 0 or less disables both the idle check and heartbeats.

This idle check requires regular “write” activity from a healthy peer, which Ice provides: when the application does not
write anything to a connection for half the idle timeout, Ice sends (writes) a heartbeat message to clear the idle check
in the peer. A heartbeat is a oneway, unacknowledged, `ValidateConnection` message.

In order to operate properly, the idle check requires the same `IdleTimeout` configuration on both sides of the
connection. You should assign the same idle timeout to all your clients and servers, and typically keep the default.

{% iflang langs="cpp,csharp,java,python,swift" %}

A connection suspends its idle check while it stops reading: when the object adapter of an incoming connection is on
hold, or when it reaches the [MaxDispatches](../../../property-reference/ice-connection-properties) limit.

{% /iflang %}

{% callout type="note" %}

Interop with previous versions of Ice

Ice 3.7 (and before) did not generate regular write activity on connections by default. If one side of your connection
uses Ice 3.7 (or earlier) and the other side uses Ice 3.8 (or newer), the idle check on the 3.8 side can abort a healthy
but inactive connection.

To prevent such idle check aborts, configure your Ice 3.7 or 3.6 application to generate regular write activity by
setting `Ice.ACM.Heartbeat` to 3, and making sure `Ice.ACM.Timeout` matches your Ice 3.8 `IdleTimeout`. The default
`Ice.ACM.Timeout` is 60 seconds, just like the default `IdleTimeout`.

If you cannot reconfigure your older Ice application, you can disable the idle check on the 3.8 side by setting
[EnableIdleCheck](../../../property-reference/ice-connection-properties) to `0`.

{% /callout %}

## The Inactivity Check

A client can establish a connection to a server, send one request to this server, and never use this connection again.
While a connection doesn’t consume much resources, we’d rather clean it up and not to keep this connection open until
either the client or server shuts down.

This is where the “inactivity check” comes in. A connection that remains inactive for
[InactivityTimeout](../../../property-reference/ice-connection-properties) is automatically closed. This timeout only
takes into account application-level activities: heartbeats don’t count. The default inactivity timeout is 300 seconds
(5 minutes).

Setting `InactivityTimeout` to 0 or less disables the inactivity check. Calling `disableInactivityCheck` on a connection
disables it for that connection only.

{% callout type="warning" %}

A connection that is inactive is a healthy, but unused, connection. The graceful closure of an inactive connection is an
innocuous event.

{% /callout %}

## Graceful Connection Closure

When a client or server closes a connection gracefully, it sends a `CloseConnection` message to the peer, to notify the
peer of the pending connection closure.

The client or server that sends `CloseConnection` guarantees that:

- it won’t send additional requests over the connection; and
- it has sent responses to all requests it accepted over the connection; any other request sent by the peer will be
  discarded and not processed in any way (meaning the peer can safely retry them)

Then, it waits for the peer to acknowledge this `CloseConnection` message. This acknowledgment can take two forms:

- a `CloseConnection` message from the peer, which occurs when both sides initiate a graceful connection closure at
  about the same time; or
- the closure of the underlying transport connection

The peer closes the connection when it receives the `CloseConnection` message, without waiting for its own dispatches to
complete.

This process can take some time. If the graceful closure exceeds the configured
[CloseTimeout](../../../property-reference/ice-connection-properties), the connection is aborted.

## Closing a Connection from the Application

An application obtains a connection from a proxy with `ice_getConnection`, or from the `con` field of the `Current`
object in a dispatch. It can then close this connection:

- `close` (`closeAsync` in C#) waits for the connection's outstanding invocations to complete and then starts a graceful
  closure. The close timeout covers this wait as well as the closure. `close` completes when the connection is closed,
  and fails when the closure is not graceful, such as when it exceeds the close timeout.
- `abort` aborts the connection immediately.

{% iflang langs="cpp,csharp,java,js,python,swift" %}

A connection sends `CloseConnection` only once its dispatches have completed, so a dispatch that waits for the closure
of its own connection never completes. In a dispatch, start the closure of the connection that received the request and
return without waiting for the closure to complete. In Java, whose `close` blocks until the connection is closed, call
`close` from another thread.

To be notified when a connection closes, whatever the reason, register a callback with `setCloseCallback`. Ice calls
this callback once the connection is closed. When you set it on a connection that is already closed, Ice schedules the
call immediately; it never calls the callback from `setCloseCallback` itself.
{% iflang langs="cpp,csharp,java,python" %}Like dispatches and asynchronous invocation callbacks, the close callback
runs through the communicator's executor when one is configured.{% /iflang %}

{% /iflang %}

## Closure Exceptions

A connection records the exception that describes why it closed. `Connection.throwException` throws this exception, and
invocations on a [fixed proxy](../bidirectional-connections) bound to this connection fail with it:

| Reason for the closure                                                                                       | Exception                                                             |
| ------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| The application called `abort`.                                                                              | `ConnectionAbortedException`, with `closedByApplication` set to true  |
| The idle check aborted the connection.                                                                       | `ConnectionAbortedException`, with `closedByApplication` set to false |
| The application called `close`.                                                                              | `ConnectionClosedException`, with `closedByApplication` set to true   |
| The inactivity check closed the connection.                                                                  | `ConnectionClosedException`, with `closedByApplication` set to false  |
| The peer closed the connection gracefully.                                                                   | `CloseConnectionException`                                            |
| The connection was not established within the connect timeout.                                               | `ConnectTimeoutException`                                             |
| The graceful closure did not complete within the close timeout.                                              | `CloseTimeoutException`                                               |
| The communicator of an outgoing connection was destroyed.                                                    | `CommunicatorDestroyedException`                                      |
| The object adapter of an incoming connection was deactivated, including when its communicator was destroyed. | `ObjectAdapterDeactivatedException`                                   |
| The transport connection failed, for example when the peer disappeared.                                      | `ConnectionLostException` or another socket exception                 |

## See Also

- [Protocol Messages](../../../protocol/protocol-messages)
- [Connection Establishment](../connection-establishment)
- [Oneway Invocations](../../invocation/invocation-mode/oneway-invocations)
- [Automatic Retries](../../invocation/automatic-retries)
