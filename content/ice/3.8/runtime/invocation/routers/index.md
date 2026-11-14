---
title: Routers
---

A _router_ is an Ice object that forwards requests between clients and servers. On this page, the client is the
application that connects to the router, and the server is the application the router forwards to, whichever of them
sends a request. A proxy configured to use a router is a _routed proxy_: Ice sends its requests to the router, which
forwards them to the target server. Ice connects to the router rather than to the endpoints of the routed proxy, and
typically opens a single connection to a router for all the routed proxies that use it.

A router implements the `Ice::Router` interface. Ice includes two routers:

- [Glacier2](../../../services/glacier2) forwards the requests of authenticated clients to servers on another network,
  typically behind a firewall, and forwards callbacks to these clients over their existing connections. It finds the
  target of each request by its identity, so the objects that a client reaches through Glacier2 need
  [unique identities](../../object-identity).
- [IceBridge](../../../services/icebridge) forwards requests to a single target server that the clients cannot reach
  directly, for example because they do not support its transport.

## Configuring a Router

A communicator can have a default router. Every proxy this communicator creates, from a string, from a property, or by
unmarshaling a proxy returned by an operation, is a routed proxy that uses this router. The
[Ice.Default.Router](../../../property-reference/ice-default-properties#ice.default.router) property sets the default
router; the value is a proxy for the router:

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
`createObjectAdapterWithRouter`. An object adapter uses a single router, and within a communicator a router serves a
single object adapter.

This object adapter does not accept incoming connections, so you don't set its `Endpoints` property: it receives
requests over the [bidirectional connection](../../connection-management/bidirectional-connections) between the client
and the router. The proxies it creates carry the endpoints of the proxy returned by
[`getServerProxy`](api:Ice/RouterPrx.getServerProxy), the server side of the router: a server that invokes on such a
proxy sends the request to the router, which forwards it to the client.

See [Callbacks Through Glacier2](../../../services/glacier2/callbacks-through-glacier2) for an example.

{% /iflang %}

## See Also

- [Glacier2](../../../services/glacier2)
- [IceBridge](../../../services/icebridge)
