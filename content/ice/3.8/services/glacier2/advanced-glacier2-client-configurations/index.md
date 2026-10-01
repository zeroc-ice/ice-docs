---
title: Advanced Glacier2 Client Configurations
---

This section details strategies that Glacier2 clients can use to address more advanced requirements.

## Callback Strategies with Multiple Object Adapters

An application that receives callback requests through a router and also services requests from local clients uses two
object adapters. For example, suppose we have the network configuration shown in the following illustration:

![A local client at 10.0.0.2 calls the callback client at 10.0.0.1. The callback client reuses a bidirectional connection through its firewall at 1.2.3.4 to Glacier2. Both Glacier2 endpoint sets use 10.0.0.1. The server at 10.0.0.2 uses a separate callback connection.](/images/ice/3.8/advanced-glacier2-client-configurations/callback-and-local-requests.svg)

The router's server endpoints become the published endpoints of an object adapter configured with a router, so the
direct proxies this object adapter creates contain the router's server endpoints. Such an object adapter cannot also
have endpoints of its own.

The callback client therefore dedicates one object adapter,
[configured with the router proxy](../callbacks-through-glacier2), to callback requests, and, in a language mapping
whose object adapters accept incoming connections, a second object adapter with local endpoints to requests from local
clients.

## Using Multiple Routers

A client is not limited to using only one router at a time: the [proxy method](api:Ice/ObjectPrx) `ice_router` allows a
client to configure its routed proxies as necessary. With respect to callbacks, a client must create a new callback
object adapter for each router that can forward callback requests to the client. A client must also be aware of the
[object identities](../getting-started-with-glacier2) in use by the routers.

## Using the `RouterFinder` Interface

`Glacier2.InstanceName` specifies the category of the router's identity. The default identity of a Glacier2 router is
`Glacier2/router`, but we can change it to `Production/router` with the following setting:

```config
Glacier2.InstanceName=Production
```

A client could configure its corresponding router proxy as follows:

```config
Ice.Default.Router=Production/router:tcp -p 4063 -h prodhost
```

In most cases the client can statically configure the router's proxy as we've shown here. For clients that need to
discover a router's proxy at run time, Ice also requires router implementations to support the `RouterFinder` interface:

```slice
module Ice
{
    interface RouterFinder
    {
        Router* getRouter();
    }
}
```

An object supporting this interface must be available with the identity `Ice/RouterFinder`. By knowing the host and port
of a router's client endpoints, a client can discover the router's proxy with a call to `getRouter`:

{% language-section name="mapping" /%}

## See Also

- [Getting Started with Glacier2](../getting-started-with-glacier2)
- [Callbacks Through Glacier2](../callbacks-through-glacier2)
