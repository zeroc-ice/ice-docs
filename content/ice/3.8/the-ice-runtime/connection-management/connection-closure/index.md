---
id: connection-closure
title: Connection Closure
---

An Ice communicator creates, reuses and eventually closes outgoing connections, while an object adapter accepts and
eventually closes incoming connections.

A connection closure can be either graceful or abortive. A graceful close requires coordination with the peer, and
therefore can take some time, while an abort is immediate.

# The Idle Check

Once a connection is established, Ice aborts a connection when a read or write on this connections fails.

But what happens when there is no read or write activity on a connection? For example, an object adapter may be
listening for requests from a dead client, but there is nothing to read or write from that client (remember, it’s dead).
Likewise, a client may send a request to a server and not hear back from this server for while–it could because the
request dispatch takes a while, or because the connection dropped.

Ice provides a simple mechanism to monitor connection health: the idle check. If a connection waits to read a byte for
over [IdleTimeout](../ice-connection-properties), the connection is considered idle and aborted.

The default idle timeout is 60 seconds.

This idle check requires regular “write” activity from a healthy peer, which Ice provides: when the application does not
write anything to a connection for half the idle timeout, Ice sends (writes) a heartbeat message to clear the idle check
in the peer. A heartbeat is a oneway, unacknowledged, `ValidateConnection` message.

In order to operate properly, the idle check requires the same `IdleTimeout` configuration on both sides of the
connection. You should assign the same idle timeout to all your clients and servers, and typically keep the default.

{% callout type="info" %}

Interop with previous versions of Ice

Ice 3.7 (and before) did not generate regular write activity on connections by default. If one side of your connection
uses Ice 3.7 (or earlier) and the other side uses Ice 3.8 (or newer), the idle check on the 3.8 side can abort a healthy
but inactive connection.

To prevent such idle check aborts, configure your Ice 3.7 or 3.6 application to generate regular write activity by
setting `Ice.ACM.Heartbeat` to 3, and making sure `Ice.ACM.Timeout` matches your Ice 3.8 `IdleTimeout`. The default
`Ice.ACM.Timeout` is 60 seconds, just like the default `IdleTimeout`.

If you cannot reconfigure your older Ice application, you can disable the idle check on the 3.8 side by setting
[EnableIdleCheck](../ice-connection-properties) to `0`.

{% /callout %}

# The Inactivity Check

A client can establish a connection to a server, send one request to this server, and never use this connection again.
While a connection doesn’t consume much resources, we’d rather clean it up and not to keep this connection open until
either the client or server shuts down.

This is where the “inactivity check” comes in. A connection that remains inactive for
[InactivityTimeout](../ice-connection-properties) is automatically closed. This timeout only takes into account
application-level activities: heartbeats don’t count. The default inactivity timeout is 300 seconds (5 minutes).

{% callout type="warning" %}

A connection that is inactive is a healthy, but unused, connection. The graceful closure of an inactive connection is an
innocuous event.

{% /callout %}

# Graceful Connection Closure

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

The peer sends this acknowledgment only after it has completed the dispatch of all requests received before the
`CloseConnection` message, and sent the corresponding responses.

This process can take some time. If the graceful closure exceeds the configured
[CloseTimeout](../ice-connection-properties), the connection is aborted.

##### See Also

- [Protocol Messages](../protocol-messages)
- [Connection Establishment](../connection-establishment)
- [Oneway Invocations](../oneway-invocations)
- [Automatic Retries](../automatic-retries)
