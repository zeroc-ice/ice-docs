---
title: Routers
---

A _router_ is an Ice object that forwards invocations between clients and servers. A proxy configured to use a router is
a _routed proxy_: Ice sends its invocations to the router, which forwards them to the target server. Ice connects to the
router rather than to the endpoints of the routed proxy, and typically opens a single connection to a router for all the
routed proxies that use it.

Ice includes two routers, both implementations of the `Ice::Router` interface:

- [Glacier2](../../../services/glacier2) is a single point of entry through which clients on public networks access
  back-end services on an internal network, with session management and access control.
- [IceBridge](../../../services/icebridge) bridges connections over different transports.

## Configuring a Router

[Ice.Default.Router](../../../property-reference/ice-default-properties#ice.default.router) sets the default router of a
communicator, which the proxies created by this communicator use. Its value is a proxy for the router:

```config
Ice.Default.Router=Glacier2/router:tcp -h routerhost -p 4063
```

`setDefaultRouter` on the communicator sets the default router of the proxies created afterwards, and `getDefaultRouter`
returns it. The default router does not apply to object adapters.

The `ice_router` proxy factory method returns a routed proxy:

{% language-section name="configuring-a-router" /%}

The [Router](../../../property-reference/proxy-properties#name.router) proxy property sets the router of the proxy that
`propertyToProxy` creates:

```config
MyProxy.Router=Glacier2/router:tcp -h routerhost -p 4063
```

{% iflang langs="cpp,csharp,java,js,python,swift" %}

## Callbacks Through a Router

A client that receives callbacks through a router creates an object adapter associated with this router, with the
[_adapter_.Router](../../../property-reference/object-adapter-properties#adapter.router) property or by calling
`createObjectAdapterWithRouter`. An object adapter uses a single router, and within a communicator, a router serves a
single object adapter at a time: to receive callbacks through several routers, create an object adapter for each router.

This object adapter does not accept incoming connections, so you don't set its `Endpoints` property: it receives
requests over the [bidirectional connection](../../connection-management/bidirectional-connections) between the client
and the router. The proxies it creates carry the endpoints of the proxy returned by
[`getServerProxy`](api:Ice/RouterPrx.getServerProxy), the server side of the router: a server that invokes on such a
proxy sends the request to the router, which forwards it to the client.

Without a router, you set up bidirectional dispatch by making an object adapter the communicator's default object
adapter; see [Bidirectional Connections](../../connection-management/bidirectional-connections).

See [Callbacks Through Glacier2](../../../services/glacier2/callbacks-through-glacier2) for an example.

{% /iflang %}

## Routing Tables

A router can keep a routing table of the proxies it forwards requests to. Glacier2 keeps one, because it forwards
requests to any number of back-end servers; IceBridge forwards requests to a single, configured server and keeps none.

Ice registers each routed proxy with such a router by calling [`addProxies`](api:Ice/RouterPrx.addProxies), and keeps a
local copy of the table so that it registers each proxy only once. The router can evict proxies from its table:
`addProxies` returns the evicted proxies, and Ice removes them from its copy. Ice uses object identities as the keys of
its table, so your Ice objects need [unique identities](../../object-identity).

When a router receives a request for an identity that is not in its routing table, such as one it evicted, it throws
`ObjectNotExistException` with `operation` set to `ice_add_proxy`. Ice then registers the proxy again and retries the
invocation.

## See Also

- [Glacier2](../../../services/glacier2)
- [IceBridge](../../../services/icebridge)
