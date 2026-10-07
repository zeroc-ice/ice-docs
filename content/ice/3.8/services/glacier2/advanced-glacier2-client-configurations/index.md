---
title: Advanced Glacier2 Client Configurations
---

This section details strategies that Glacier2 clients can use to address more advanced requirements.

## Callback Strategies with Multiple Object Adapters

An application that receives callback requests through a router and also services requests from local clients uses two
object adapters. For example, suppose we have the network configuration shown in the following illustration:

![A local client at 10.0.0.2 calls the callback client at 10.0.0.1. The callback client reuses a bidirectional connection through its firewall at 1.2.3.4 to Glacier2. Both Glacier2 endpoint sets use 10.0.0.1. The server at 10.0.0.2 uses a separate callback connection.](/images/ice/3.8/advanced-glacier2-client-configurations/callback-and-local-requests.svg)

An object adapter configured with a router has no endpoints of its own: its published endpoints are the published
endpoints of the router's server object adapter, `Glacier2.Server`, so the proxies it creates contain these endpoints.
The callback client therefore dedicates one object adapter,
[configured with the router proxy](../callbacks-through-glacier2), to callback requests, and a second object adapter,
with local endpoints, to requests from local clients.

## Using Multiple Routers

A client is not limited to using only one router at a time: the [proxy method](api:Ice/ObjectPrx) `ice_router` allows a
client to configure its routed proxies as necessary. With respect to callbacks, a client must create a new callback
object adapter for each router that can forward callback requests to the client. A client must also be aware of the
[object identities](../getting-started-with-glacier2) in use by the routers.

## Using the `RouterFinder` Interface

You may know the endpoints of a Glacier2 router but not its identity, since a router can be configured with a
non-default identity through `Glacier2.InstanceName`. In this situation, create a proxy with the identity
`Ice/RouterFinder` and the router's endpoints, for example `Ice/RouterFinder:tcp -h prodhost -p 4063`, and call
`getRouter` on this proxy. The router finder returns a proxy to the Glacier2 router.

## See Also

- [Getting Started with Glacier2](../getting-started-with-glacier2)
- [Callbacks Through Glacier2](../callbacks-through-glacier2)
