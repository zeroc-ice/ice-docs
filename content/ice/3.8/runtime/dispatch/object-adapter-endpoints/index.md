---
title: Object Adapter Endpoints
---

An object adapter maintains two sets of [endpoints](../endpoint-syntax). One set identifies the network interfaces on
which the adapter listens for new connections, and the other set is embedded in proxies created by the adapter and used
by clients to communicate with it. We will refer to these sets of endpoints as the _physical endpoints_ and the
_published endpoints_, respectively.

## Physical Object Adapter Endpoints

An object adapter's physical endpoints identify the network interfaces on which it receives requests from clients. These
endpoints are configured via the [_name_.Endpoints](../object-adapter-properties) property, or they can be specified
explicitly when [creating an adapter](../creating-an-object-adapter) using the operation
`createObjectAdapterWithEndpoints`. The [endpoint syntax](../endpoint-syntax) generally consists of a transport protocol
followed by an optional host name and port.

{% callout type="info" %}

Despite the name of the property and the name of the method, we recommend you always configure your object adapter with
a **single endpoint.**Specifying multiple endpoints, while possible, does not provide any real benefit.

{% /callout %}

If a host name is specified, the object adapter listens only on the network interface associated with that host name. If
no host name is specified but the property [Ice.Default.Host](../ice-default-properties) is defined, the object adapter
uses the property's value as the host name. Finally, if a host name is not specified, and the property
`Ice.Default.Host` is undefined, the object adapter listens on all available network interfaces, including the loopback
interface. You may also force the object adapter to listen on all interfaces by using one of the host names `0.0.0.0` or
`*`. The adapter does _not_ expand the list of interfaces when it is initialized. Instead, if no host is specified, or
you use `-h *` or `-h "::0"`, the adapter binds to `INADDR_ANY` to listen for incoming requests.

If the host name refers to a DNS name which is configured with multiple addresses, the object adapter will listen on the
network interfaces identified by each address. All the addresses should refer to local network interfaces or the object
adapter creation will fail.

{% callout type="info" %}

You should not use DNS names for your object adapter endpoint(s). This DNS support is only provided for backwards
compatibility with previous versions of Ice.

{% /callout %}

If you want an adapter to accept requests on certain network interfaces, you must specify a separate endpoint for each
interface. For example, the following property configures a single endpoint for the adapter named `MyAdapter`:

```config
MyAdapter.Endpoints=tcp -h 10.0.1.1 -p 9999
```

This endpoint causes the adapter to accept requests on the network interface associated with the IP address `10.0.1.1`
at port `9999`. Note however that this adapter configuration does not accept requests on the loopback interface (the one
associated with address `127.0.0.1`). If both addresses must be supported, then both must be specified explicitly, as
shown below:

```config
# An adapter with multiple endpoints (not recommended)
MyAdapter.Endpoints=tcp -h 10.0.1.1 -p 9999:tcp -h 127.0.0.1 -p 9999
```

If these are the only two network interfaces available on the host, then a simpler configuration omits the host name
altogether, causing the object adapter to listen on both interfaces automatically:

```config
MyAdapter.Endpoints=tcp -p 9999
```

If you want to make your configuration more explicit, you can use one of the special host names mentioned earlier:

```config
MyAdapter.Endpoints=tcp -h * -p 9999
```

Careful consideration must also be given to the selection of a port for an endpoint. If no port is specified, the
adapter uses a port that is selected (essentially at random) by the operating system, meaning the adapter will likely be
using a different port each time the server is restarted. Whether that behavior is desirable depends on the application,
but in many applications a client has a proxy containing the adapter's endpoint and expects that proxy to remain valid
indefinitely. Therefore, an endpoint generally should contain a fixed port to ensure that the adapter is always
listening at the same port.

However, there are certain situations where a fixed port is not required. For example, an adapter whose servants are
transient does not need a fixed port, because the proxies for those objects are not expected to remain valid past the
lifetime of the server process. Similarly, a server using indirect binding via [IceGrid](../icegrid) does not need a
fixed port because its port is never published.

## Published-Object-Adapter-Endpoints Published Object Adapter Endpoints

When an object adapter creates a proxy, it embeds its published endpoints in this proxy.

{% callout type="info" %}

The published endpoints of an object adapter matter only if you create proxies with this object adapter and then
transmit these proxies to other applications.

{% /callout %}

Most of the time, the published endpoints consist of a **single** published endpoint. Multiple published endpoints are
useful for replicated servers, as presented below.

The published endpoints of a regular object adapter (that is, not configured with a router) are computed as follows:

1. If the property [adapter.PublishedEndpoints](../object-adapter-properties) is set, use the specified endpoints.
2. start from the physical endpoints, split these endpoints in loopback and multicast endpoints on one side, and regular
   endpoints on the other

   1. if there is any regular endpoint:

      1. discard the loopback and multicast endpoints
      2. replace the host name in each of these endpoints by the value of
         [adapter.PublishedHost](../object-adapter-properties). If `adapter.PublishedHost` is not set, use the DNS name
         of the current host as published host.

   2. otherwise, when all endpoints are loopback or multicast, replace the host name in each of these endpoints by the
      value of `adapter.PublishedHost`, if set. Don’t perform any substitution if `adapter.PublishedHost` is not set.
   3. finally, eliminate duplicate endpoints

{% callout type="info" %}

Your physical endpoint(s) should be simple: a single endpoint that is loopback, multicast, or neither loopback nor
multicast (typically, `INADDR_ANY`).

The published endpoints computation accepts odd mixes of endpoints only to maximize compatibility for existing
applications.

{% /callout %}

As an example, the published endpoints for an object adapter with the following configuration:

```config
MyAdapter.Endpoints=tcp -h 10.0.1.1 -p 9999
MyAdapter.PublishedHost=Sun1
```

are `tcp -h Sun1 -p 9999`.

You can also configure `PublishedEndpoints` explicitly:

```config
MyAdapter.Endpoints=tcp -h 10.0.1.1 -p 9999
MyAdapter.PublishedEndpoints=tcp -h corpfw -p 25000
```

This example assumes that clients connecting to host `corpfw` at port `25000` are forwarded to the adapter's endpoint in
the private network.

Another use case of published endpoints is for replicated servers. Suppose we have two instances of a stateless server
running on separate hosts in order to distribute the load between them. We can supply the client with a bootstrap proxy
containing the endpoints of both servers, and the Ice runtime in the client will select one of the servers at random
when a connection is established. However, should the client invoke an operation on a server that returns a proxy for
another object, that proxy would normally contain only the endpoint of the server that created it. Invocations on the
new proxy would always be directed at the same server, reducing the opportunity for load balancing.

We can alleviate this situation by configuring the adapters to publish the endpoints of both servers. For example, here
is a configuration for the server on host `Sun1`:

```config
MyAdapter.Endpoints=tcp -h 10.0.0.1 -p 9999
MyAdapter.PublishedEndpoints=tcp -h Sun1 -p 9999:tcp -h Sun2 -p 9999
```

Similarly, the configuration for host `Sun2` retains the same published endpoints:

```config
MyAdapter.Endpoints=tcp -h 10.0.0.2 -p 9999
MyAdapter.PublishedEndpoints=tcp -h Sun1 -p 9999:tcp -h Sun2 -p 9999
```

## A Router's Effect on Object Adapter Endpoints

If an object adapter is configured with a router, the adapter's published endpoints are those provided by the router's
server proxy. Calling `setPublishedEndpoints` on such an object adapter will throw an illegal argument exception. See
[Routers](../routers) for additional information.

## See Also

- [Object Adapter Properties](../object-adapter-properties)
- [Ice.Default.*](../ice-default-properties)
- [IceGrid](../icegrid)
- [Communicator](../communicator)
- [Routers](../routers)
