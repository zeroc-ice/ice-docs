---
title: Advanced Glacier2 Client Configurations
---

This section details strategies that Glacier2 clients can use to address more advanced requirements.

## Callback Strategies with Multiple Object Adapters

An application that needs to support callback requests from a router as well as requests from local clients should use
multiple object adapters to ensure that proxies created by these object adapters contain the appropriate endpoints. For
example, suppose we have the network configuration as shown in the following illustration:

![A local client at 10.0.0.2 calls the callback client at 10.0.0.1. The callback client reuses a bidirectional connection through its firewall at 1.2.3.4 to Glacier2. Both Glacier2 endpoint sets use 10.0.0.1. The server at 10.0.0.2 uses a separate callback connection.](/attachments/3.8/advanced-glacier2-client-configurations/callback-and-local-requests.svg)

Notice that the two local area networks use the same private network addresses, which is not an unrealistic scenario.

Now, if the callback client were to use a single object adapter for handling both callback requests and local requests,
then any proxies created by that object adapter would contain the application's local endpoints as well as the router's
server endpoints. As you might imagine, this could cause some subtle problems.

1. When the local client attempts to establish a connection to the callback client via one of these proxies, it might
   arbitrarily select one of the router's server endpoints to try first. Since the router's server endpoints use
   addresses in the same network, the local client attempts to make a connection over the local network, with two
   possible outcomes: the connection attempts to those endpoints fail, in which case they are skipped and the real local
   endpoints are attempted; or, even worse, one of the endpoints might accidentally be valid in the local network, in
   which case the local client has just connected to some unintended server.
2. The server may encounter similar problems when attempting to establish a local connection to the router in order to
   make a callback request.

The solution is to dedicate an object adapter solely to handling callback requests, and another one for servicing local
clients. The object adapter dedicated to callback requests must be
[configured with the router proxy](../callbacks-through-glacier2).

## Using Multiple Routers

A client is not limited to using only one router at a time: the
[proxy method](https://code.zeroc.com/manual/Ice/ObjectPrx) `ice_router` allows a client to configure its routed proxies
as necessary. With respect to callbacks, a client must create a new callback object adapter for each router that can
forward callback requests to the client. A client must also be aware of the
[object identities](../getting-started-with-glacier2) in use by the routers.

## Using the `RouterFinder` Interface

A router's identity can be changed by setting the `Glacier2.InstanceName` property, which affects the category portion
of the identity. The default identity of a Glacier2 router is `Glacier2/Router`, but we can change it to
`Production/Router` with the following setting:

```config
Glacier2.InstanceName=Production
```

A client could configure its corresponding router proxy as follows:

```config
Ice.Default.Router=Production/Glacier2:tcp -p 4063 -h prodhost
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

{% language-section name="lang-1" /%}

## See Also

- [Getting Started with Glacier2](../getting-started-with-glacier2)
- [Callbacks Through Glacier2](../callbacks-through-glacier2)
