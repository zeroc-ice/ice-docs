---
title: Bidirectional Connections
---

## Use Cases for Bidirectional Connections

An Ice connection normally allows requests to flow in only one direction. If an application's design requires the server
to make callbacks to a client, the server usually establishes a new connection to that client in order to send callback
requests, as shown below:

![The client opens a connection to send requests to the server. The server opens a separate connection to send callbacks to the client.](/attachments/3.8/bidirectional-connections/callback1.svg)

_Callbacks in an open network._

Unfortunately, network restrictions often prevent a server from being able to create a separate connection to the
client, such as when the client resides behind a firewall as shown here:

![The client can open a connection to the server through its firewall, but the firewall blocks a separate incoming callback connection from the server.](/attachments/3.8/bidirectional-connections/callback2.svg)

In this scenario, the firewall blocks any attempt to establish a connection directly to the client.

For situations such as these, a bidirectional connection offers a solution. Requests may flow in both directions over a
bidirectional connection, enabling a server to send callback requests to a client over the client's existing connection
to the server.

There are two ways to make use of a bidirectional connection. First, you can use a [Glacier2 router](../glacier2), in
which case bidirectional connections are used automatically. If you do not require the functionality offered by Glacier2
or you do not want an intermediary service between clients and servers, you can configure bidirectional connections
manually.

The remainder of this section discusses manual configuration of bidirectional connections.

## Configuring a Client for Bidirectional Connections

A client needs to perform the following steps in order to configure a bidirectional connection:

1. [Create an object adapter](../creating-an-object-adapter) to receive callback requests. This adapter does not require
   a name or endpoints if its only purpose is to receive callbacks over bidirectional connections.
2. Set this object adapter as the default object adapter on the communicator. This means the object adapter will gets
   associated with new outgoing connections created by the communicator.
3. [Register the callback object](../object-adapter-activation-and-deactivation) or objects with the object adapter.

{% callout type="tip" %}

The object adapter remains a regular object adapter, unaware of the outgoing connection(s) associated with it. These
connections have no effect on the endpoints and other properties of proxies created by this object adapter.

However, calling `activate` on this object adapter is optional if it's used only for bidirectional and collocated
dispatches.

We recommend using a dedicated, endpoint-less object adapter for “bidir” dispatches.

{% /callout %}

The code below illustrates these steps:

{% language-section name="lang-1" /%}

The callback object (`mockAlarmClock` in the code above) will handle incoming requests for identity `alarmClock`.

## Configuring a Server for Bidirectional Connections

A server needs to create or obtain a proxy to the callback object. This proxy is bound to the incoming connection and is
known as a “fixed” proxy.

A fixed proxy is bound to the connection that created it, and ceases to work once that connection is closed. If the
connection is closed, the server can no longer make callback requests using that proxy. Any attempt to use the proxy
again usually results in a `CloseConnectionException`.

The connection object is accessible as a member of the `Current` parameter supplied to an operation implementation.
These steps are illustrated in the code below:

{% language-section name="lang-2" /%}

## Limitations of Bidirectional Connections

Bidirectional connections have certain limitations:

- They can only be configured for connection-oriented transports such as TCP and SSL.
- Most proxy factory methods are not relevant for a fixed proxy. The proxy is bound to an existing connection, therefore
  the proxy reflects the connection's configuration. Attempting to change settings such as the proxy's timeout value
  causes the Ice runtime to throw `FixedProxyException`. Note however that it is legal to configure a fixed proxy for
  using oneway or twoway invocations.
- A connection established from a Glacier2 router to a server is not configured for bidirectional use. Only the
  connection from a client to the router is bidirectional. However, the client must not attempt to manually configure a
  bidirectional connection to a router, as this is handled internally by the Ice runtime.

## Threading Considerations for Bidirectional Connections

An Ice communicator normally creates two [thread pools](../threading-model) for processing network traffic on
connections: the client thread pool manages outgoing connections and the server thread pool manages incoming
connections. All of the object adapters in a server share the same thread pool by default, but an object adapter can
also be configured to have [its own thread pool](../object-adapter-thread-pools). The default size of the client and
server thread pools is one.

The client thread pool processes replies to pending requests. When a client configures an outgoing connection for
bidirectional requests, the client thread pool also becomes responsible for dispatching callback requests received over
that connection. Similarly, the server thread pool normally dispatches requests from clients. If a server uses a
bidirectional connection to send callback requests, then the server thread pool must also process the replies to those
requests.

You must increase the size of the appropriate thread pool if you need the ability to dispatch multiple requests in
parallel, or if you need to make [nested two-way invocations](../nested-invocations). For example, a client that
receives a callback request over a bidirectional connection and makes nested invocations must increase the size of the
_client_ thread pool.

## See Also

- [Glacier2](../glacier2)
- [Creating an Object Adapter](../creating-an-object-adapter)
- [Object Adapter Activation and Deactivation](../object-adapter-activation-and-deactivation)
- [Object Identity](../object-identity)
- [Nested Invocations](../nested-invocations)
- [The Ice Threading Model](../threading-model)
- [Object Adapter Thread Pools](../object-adapter-thread-pools)
