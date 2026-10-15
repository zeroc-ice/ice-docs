---
title: Callbacks Through Glacier2
---

On this page, the client is the application that connects to the Glacier2 router, and the back-end servers are the
applications the client reaches through the router. A callback is a request that a back-end server sends to an object in
the client, often to notify the client about an event such as the completion of a long-running calculation or a change
to a database record. Unfortunately, supporting callbacks in a complicated network environment presents its own
[set of problems](../common-firewall-traversal-issues). Ice overcomes these obstacles using a Glacier2 router and
bidirectional connections.

{% callout type="tip" title="Example" %}

The `Glacier2/callback` demo illustrates the use of callbacks with Glacier2. The `README.md` file in the directory
provides instructions on running the example, and comments in the configuration file describe the properties in detail.

{% /callout %}

## Bidirectional Connections with Glacier2

While a regular unrouted connection carries requests in only one direction, from the application that established it to
its peer, a [bidirectional connection](../../../runtime/connection-management/bidirectional-connections) carries
requests in both directions. This capability is necessary to circumvent the network restrictions that commonly cause
[firewall traversal issues](../common-firewall-traversal-issues), namely, firewalls in front of the client that prevent
a back-end server from establishing a connection directly to the client. The router sends callback requests to the
client over the connection the client established to the router, which creates a virtual connection from the back-end
servers back to the client.

This diagram shows the steps involved in making a callback using Glacier2:

![Four-step request and callback flow through Glacier2. The callback returns to the client over the client's existing bidirectional connection to Glacier2.](/images/ice/3.8/callbacks-through-glacier2/callback-via-glacier2.svg)

_Request and callback flow through Glacier2._

1. The client has a routed proxy for an object in a back-end server and makes an invocation. The client establishes a
   connection to the router's client endpoint and sends the request to the router.
2. The router, using information from the client's proxy, establishes a connection to the back-end server and forwards
   the request. In this example, one of the arguments in the request is a proxy for a callback object in the client.
3. The back-end server makes a callback to the client. For this to succeed, the proxy for the callback object must
   contain endpoints that the back-end server can reach. The only path back to the client is through the router,
   therefore the proxy contains the [router's server endpoints](#configuring-the-router-for-callbacks). The back-end
   server connects to the router and sends the request.
4. The router forwards the callback request to the client using the bidirectional connection established in step 1.

The arrows in the above illustration indicate the flow of requests; notice that two connections are used between the
router and the back-end server. Since the back-end server is unaware of the router, it does not use routed proxies, and
therefore does not use bidirectional connections.

{% callout type="note" %}

An object adapter created with a router becomes the object adapter of the client's connection to this router, so you
don't configure this connection for bidirectional use yourself. To use bidirectional connections without a router, see
[Bidirectional Connections](../../../runtime/connection-management/bidirectional-connections).

{% /callout %}

## Callbacks and Connection Closure

When a client terminates, it closes its connection to the router. If a back-end server later attempts to make a callback
to the client, the attempt fails because the router has no connection to the client over which to forward the request.
This situation is no worse than if the back-end server attempted to contact the client directly, which would be
prevented by the client's firewall. However, this illustrates the inherent limitation of bidirectional connections: the
lifetime of a client's callback proxy is bounded by the lifetime of the client's router session.

## Configuring the Router for Callbacks

In order for the router to support callbacks from back-end servers, it needs to have endpoints in the private network.

The configuration file shown below adds the property
[Glacier2.Server.Endpoints](../../../property-reference/glacier2-properties):

```config
Glacier2.Client.Endpoints=tcp -h 5.6.7.8 -p 4063
Glacier2.Server.Endpoints=tcp -h 10.0.0.1
```

As this example shows, `Glacier2.Server.Endpoints` does not require a fixed port.

{% callout type="note" %}

Glacier2's implementation of [Ice::Router](../../../runtime/invocation/routers)'s `getServerProxy` returns the
[published endpoints](../../../runtime/dispatch/object-adapter-endpoints) of this `Glacier2.Server` object adapter.

{% /callout %}

## Configuring the Client's Object Adapter with a Router

A client that receives callbacks needs an object adapter to dispatch them. Typically, an object adapter has endpoints in
the local network, but those endpoints are of no use to a back-end server in our restricted network environment. We
really want the client's callback proxy to contain the router's server endpoints, and we accomplish that by configuring
the client's object adapter with a proxy for the router.

{% callout type="note" %}

Note that multiple object adapters created by the same communicator cannot use the same router.

{% /callout %}

We supply the router's proxy by creating the object adapter with `createObjectAdapterWithRouter`, or by defining the
object adapter property [_adapter_.Router](../../../property-reference/object-adapter-properties) as shown below:

```config
CallbackAdapter.Router=Glacier2/router:tcp -h 5.6.7.8 -p 4063
```

The direct proxies an object adapter creates contain its
[published endpoints](../../../runtime/dispatch/object-adapter-endpoints). For an object adapter configured with a
router, the published endpoints are the published endpoints of the router's server object adapter, `Glacier2.Server`.

An object adapter configured in this way allows the client to receive callback requests via the router. If the client
also wants to service requests via local (non-routed) endpoints, the client must
[create a separate adapter](../advanced-glacier2-client-configurations) for these requests.

{% callout type="note" %}

An [object adapter configured with a router](../../../runtime/invocation/routers) receives only requests over the
(bidirectional) connection to the router, and collocated dispatches.

{% /callout %}

## Callback Object Identities

Glacier2 assigns a unique category to each client for use in the [identities](../../../runtime/object-identity) of the
client's callback objects. The client creates proxies that contain this identity category and pass these proxies to
back-end servers for use in making callback requests to the client. This category serves two purposes:

1. Upon receipt of a callback request from a back-end server, the router uses the request's category to identify the
   intended client.
2. The category is sufficiently random that, without knowing the category in advance, it is practically impossible for a
   misbehaving or malicious back-end server to send callback requests to an arbitrary client.

A client can obtain its assigned category by calling `getCategoryForClient` on the
[Router](../getting-started-with-glacier2) interface as shown in the example below:

{% language-section name="mapping" /%}

## Nested Invocations with a Router

The client thread pool dispatches the callbacks the client receives through the router, and this pool has a single
thread by default. A callback implementation that makes a synchronous twoway invocation blocks this thread, which is
also the thread that would process the reply. Make the invocation asynchronously, or increase the size of the client
thread pool; see [Nested Invocations](../../../runtime/threading-model/nested-invocations).

## Handling Connection Loss

If the client loses its connection to the Glacier2 router, its session ends, and the router no longer forwards callback
requests for that session's category. To receive callbacks again, the client destroys its callback object adapter and
starts over with a new session: the new session has a new category, so the client creates its callback objects with new
identities and passes the new callback proxies to the back-end servers.

## See Also

- [Bidirectional Connections](../../../runtime/connection-management/bidirectional-connections)
- [Object Adapter Endpoints](../../../runtime/dispatch/object-adapter-endpoints)
- [Object Identity](../../../runtime/object-identity)
- [Getting Started with Glacier2](../getting-started-with-glacier2)
- [The Active Servant Map](../../../runtime/dispatch/active-servant-map)
- [Glacier2.*](../../../property-reference/glacier2-properties)
