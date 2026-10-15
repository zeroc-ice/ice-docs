---
title: Bidirectional Connections
languages: [cpp, csharp, java, js, python, swift]
---

## Use Cases for Bidirectional Connections

By default, requests flow over an Ice connection in one direction: from the client that establishes the connection to
the server that accepts it. If the server needs to call back the client, it usually establishes a new connection to that
client to send these callback requests, as shown below:

![The client opens a connection to send requests to the server. The server opens a separate connection to send callbacks to the client.](/images/ice/3.8/bidirectional-connections/callback1.svg)

_Callbacks in an open network._

A firewall in front of the client, however, typically blocks this connection:

![The client can open a connection to the server through its firewall, but the firewall blocks a separate incoming callback connection from the server.](/images/ice/3.8/bidirectional-connections/callback2.svg)

A bidirectional connection solves this: requests flow over it in both directions, so the server can send callbacks over
the connection the client established.

## Configuring a Client for Bidirectional Connections

A client needs to perform the following steps in order to configure a bidirectional connection:

1. [Create an object adapter](../../dispatch/creating-an-object-adapter) to receive callback requests.
2. Set this object adapter as the default object adapter on the communicator. The communicator associates its default
   object adapter with the outgoing connections it creates afterward.
3. [Register the callback object](../../dispatch/object-adapter-activation-and-deactivation) or objects with the object
   adapter.

{% callout type="tip" %}

We recommend a dedicated object adapter for the callbacks. Such an object adapter needs no name or endpoints, and you
don't need to activate it, since it accepts no connection: it only dispatches the callbacks received over the
bidirectional connections. You can also use an object adapter with endpoints: it then dispatches the requests received
over its own incoming connections as well as the callbacks.

{% /callout %}

The code below illustrates these steps:

{% language-section name="configuring-a-client-for-bidirectional-connections" /%}

The callback object (`mockAlarmClock` in the code above) will handle incoming requests for identity `alarmClock`.

To set an object adapter on a connection created before you set the default object adapter, or to give a connection a
different object adapter, call `setAdapter` on this outgoing connection, for example the connection returned by a
proxy's `ice_getConnection`. A connection without an object adapter rejects incoming requests with
`ObjectNotExistException`.

These two approaches differ in scope. With a default object adapter, every outgoing connection that the communicator
creates afterward dispatches the requests it receives to this adapter, so any server the client connects to can send
callbacks to it. With `setAdapter`, only the connections you choose accept callbacks.

## Configuring a Server for Bidirectional Connections

{% iflang langs="cpp,csharp,java,python,swift" %}

A server sends callbacks over the incoming connection with a _fixed proxy_, a proxy bound to this connection. The
connection is the `con` member of the `Current` object passed to the operation implementation. You create a fixed proxy
in one of two ways:

- Call `createProxy` on the connection with the identity of the callback object, as the code below does.
- Call `ice_fixed` with the connection on a proxy that the client sent, for example a callback proxy passed as an
  operation argument. The fixed proxy keeps the identity, facet, and other settings of this proxy.

{% /iflang %}

{% language-section name="configuring-a-server-for-bidirectional-connections" /%}

{% iflang langs="cpp,csharp,java,python,swift" %}

A fixed proxy ceases to work once its connection is closed. Ice does not retry an invocation on a fixed proxy: once the
connection is closed, invocations on the proxy fail with the exception that closed the connection, such as
`CloseConnectionException` when the client closed it gracefully.

{% /iflang %}

## Limitations of Bidirectional Connections

Bidirectional connections have certain limitations:

- They can only be configured for connection-oriented transports such as TCP and SSL.
- A fixed proxy is bound to an existing connection: you cannot change the settings that select a connection, such as its
  endpoints or its router, and you cannot marshal it or convert it to proxy properties. You can still change its
  invocation mode, for example to oneway.

{% iflang langs="cpp,csharp,java,python,swift" %}

## Threading Considerations for Bidirectional Connections

Over a bidirectional connection, each side sends requests and dispatches the requests it receives, but the thread pool
does not depend on the direction of a request: the client thread pool services an outgoing connection, even when the
callback object adapter has its own thread pool, and the thread pool of the object adapter that accepted the connection
services an incoming connection. This pool dispatches the requests and processes the replies received over the
connection; see [Thread Pools](../../threading-model/thread-pools).

{% /iflang %}

## See Also

- [Callbacks through Glacier2](../../../services/glacier2/callbacks-through-glacier2)
- [Creating an Object Adapter](../../dispatch/creating-an-object-adapter)
- [Object Adapter Activation and Deactivation](../../dispatch/object-adapter-activation-and-deactivation)
- [Object Identity](../../object-identity)
- [Nested Invocations](../../threading-model/nested-invocations)
- [The Ice Threading Model](../../threading-model)
- [Object Adapter Thread Pools](../../threading-model/object-adapter-thread-pools)
