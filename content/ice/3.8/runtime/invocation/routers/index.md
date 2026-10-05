---
title: Routers
---

## Router Overview

A _router_ is an Ice object that provides information to the Ice runtime to allow routing messages between clients and
servers. In a client, configuring a proxy to use a router produces a _routed proxy_ on which all invocations are sent to
the router for forwarding to the target server. The endpoints in a routed proxy are ignored by the Ice runtime, at least
for the purposes of connection establishment. Instead, the Ice runtime in the client establishes a connection to the
router and may pass along the proxy's endpoints so that the router can establish its own connection to the target
server, as described in [Routing Tables](#routing-tables). Ice typically opens only one connection to a router and
reuses that connection for invocations on all of the routed proxies configured to use the same router.

The Ice distribution includes two router implementations that serve different purposes:

- [Glacier2](../../../services/glacier2) is a sophisticated routing service that is commonly used as a single point of
  entry through which clients on public networks access back-end services on an internal network, with support for
  application-specific session management and access control.
- [IceBridge](../../../services/icebridge) is a simpler service that facilitates bridging connections over different
  transports.

Both services implement the `Ice::Router` interface, which the Ice runtime requires of any router implementation.

## Default Router

A communicator can be configured with a default router. The most common way to configure the default router is to set
the property [Ice.Default.Router](../../../property-reference/ice-default-properties). The value of this property is a
proxy for the router's primary Ice object, as shown in the example below for Glacier2:

```config
Ice.Default.Router=Glacier2/router:tcp -h routerhost -p 4063
```

You can also specify a default router by calling `setDefaultRouter` on the communicator, and obtain the current setting
using `getDefaultRouter`.

{% callout type="note" %}

Proxies created with this communicator are configured with this router by default (see below). Object adapters created
with this communicator are not affected by the default router.

{% /callout %}

## Configuring a Router for Client Invocations

Setting a default router as described above means every proxy created by the communicator will be configured to use the
router by default. If your client needs to use a router more selectively, you can use the `ice_router` proxy method to
obtain a routed proxy:

{% language-section name="configuring-a-router-for-client-invocations-1" /%}

{% language-section name="configuring-a-router-for-client-invocations-2" /%}

Another way to configure a router is with a [proxy property](../../../property-reference/proxy-properties):

```config
MyProxy.Router=Glacier2/router:tcp -h routerhost -p 4063
```

In this example, calling `propertyToProxy("MyProxy")` on a communicator returns a proxy that is already configured to
use Glacier2 router.

## Configuring a Client for Callbacks

A client that needs to receive callbacks from the server through the router creates an object adapter that hosts
callback objects and associates the router with this object adapter. You create this object adapter-router association
using the property `adapter.Router` (in the
[object adapter's configuration](../../../property-reference/object-adapter-properties)), or by creating the object
adapter with `createObjectAdapterWithRouter`.

This is a one-to-one association: an object adapter can be associated with a single router and likewise a router can be
associated with only one object adapter.

An object adapter with a router does not accept incoming connections, so you don't set its `Endpoints` property. When
the object adapter is created, it associates itself with the connection between the client and the router. This
connection is either reused (if a connection to the router already existed) or established during the creation of the
object adapter. Later, when the server calls on a proxy to the callback object, the router forwards the request to the
object adapter over this [bidirectional connection](../../connection-management/bidirectional-connections) between the
client and the router.

The proxies created by an object adapter with a router carry the endpoints of the proxy returned by `getServerProxy`,
which typically point to the "server-side" of the router. This way, the client can give these proxies to the server (via
the router), and when the server sends a request using such a proxy, the request is directed to the router and then
forwarded to the client's object adapter.

Without a router, you set up bidirectional dispatch by making an object adapter the communicator's default object
adapter; see [Bidirectional Connections](../../connection-management/bidirectional-connections).

See [Callbacks Through Glacier2](../../../services/glacier2/callbacks-through-glacier2) for an example.

## Routing Tables

A router implementation may optionally maintain an internal routing table that the Ice client runtime populates
automatically by calling `addProxies`.

For example, Glacier2 uses a routing table because it can forward requests to any number of back-end servers, whereas
IceBridge does not use a routing table because each IceBridge instance is statically configured to forward requests to a
single server. When a client makes an initial invocation on a routed proxy, and the configured router uses a routing
table, the Ice runtime in the client needs to send that routed proxy to the router so that the router has the endpoint
information necessary to establish a connection to the back-end server. The Ice runtime in the client also maintains its
own local version of the routing table in order to minimize overhead; Ice only sends each routed proxy to the router
once. Furthermore, Ice keeps its table synchronized with the router's by tracking any proxies that the router might have
evicted from its table (the proxies returned by the call to `addProxies`).

{% callout type="note" %}

Ice uses object identities as the keys in its routing table, which means it's important that your Ice objects use
[unique identities](../../object-identity).

{% /callout %}

If a router receives an operation to be forwarded for an object identity that is not in its routing table (e.g., it may
have been recently evicted), the router throws `ObjectNotExistException` and sets the `operation` member to the reserved
value `ice_add_proxy` in order to notify the Ice runtime in the client that the routed proxy is unknown. The Ice client
runtime must then register the proxy with the router and retry the invocation.

## See Also

- [Glacier2](../../../services/glacier2)
- [IceBridge](../../../services/icebridge)
