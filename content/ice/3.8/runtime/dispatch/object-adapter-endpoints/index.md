---
title: Object Adapter Endpoints
---

An object adapter maintains two sets of [endpoints](../../endpoint-syntax). One set identifies the network interfaces on
which the adapter listens for new connections, and the other set is embedded in proxies created by the adapter and used
by clients to communicate with it. We will refer to these sets of endpoints as the _physical endpoints_ and the
_published endpoints_, respectively.

## Physical Object Adapter Endpoints

An object adapter's physical endpoints identify the network interfaces on which it receives requests from clients. These
endpoints are configured via the
[_name_.Endpoints](../../../property-reference/object-adapter-properties#adapter.endpoints) property, or they can be
specified explicitly when [creating an adapter](../creating-an-object-adapter) using the operation
`createObjectAdapterWithEndpoints`. The [endpoint syntax](../../endpoint-syntax) generally consists of a transport
protocol followed by an optional host name and port.

{% callout type="note" %}

Despite the name of the property and the name of the method, we recommend you always configure your object adapter with
a **single endpoint.**Specifying multiple endpoints, while possible, does not provide any real benefit.

{% /callout %}

If a host name is specified, the object adapter listens only on the network interface associated with that host name. If
no host name is specified but the property
[Ice.Default.Host](../../../property-reference/ice-default-properties#ice.default.host) is defined, the object adapter
uses the property's value as the host name. Finally, if a host name is not specified, and the property
`Ice.Default.Host` is undefined, the object adapter listens on all available network interfaces, including the loopback
interface. You may also force the object adapter to listen on all interfaces by using one of the host names `0.0.0.0` or
`*`. The adapter does _not_ expand the list of interfaces when it is initialized. Instead, if no host is specified, or
you use `-h *` or `-h "::0"`, the adapter binds to `INADDR_ANY` to listen for incoming requests.

If the host name refers to a DNS name which is configured with multiple addresses, the object adapter will listen on the
network interfaces identified by each address. All the addresses should refer to local network interfaces or the object
adapter creation will fail.

{% callout type="note" %}

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
lifetime of the server process. Similarly, a server using indirect binding via [IceGrid](../../../services/icegrid) does
not need a fixed port because its port is never published.

## Published Object Adapter Endpoints

An object adapter embeds its published endpoints in the direct proxies it
creates{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %} and, when it has an adapter ID, registers them
with the locator registry{% /iflang %}.

By default, the object adapter has as many published endpoints as physical endpoints: each published endpoint is a
physical endpoint with its host replaced by the DNS name of the current host. An object adapter usually has a single
physical endpoint, and therefore a single published endpoint. For example, an object adapter configured with

```config
MyAdapter.Endpoints=tcp -p 9999
```

on host `Sun1` publishes `tcp -h Sun1 -p 9999`. The exact rules, including the loopback and multicast cases, are in
[How Ice Derives Published Endpoints](#how-ice-derives-published-endpoints) below.

To publish another host name, set
[adapter.PublishedHost](../../../property-reference/object-adapter-properties#adapter.publishedhost):

```config
MyAdapter.Endpoints=tcp -h 10.0.1.1 -p 9999
MyAdapter.PublishedHost=sun1.example.com
```

The published endpoints are then `tcp -h sun1.example.com -p 9999`.

When clients reach the adapter through another host or port, set
[adapter.PublishedEndpoints](../../../property-reference/object-adapter-properties#adapter.publishedendpoints)
explicitly:

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

### How Ice Derives Published Endpoints

The published endpoints of a regular object adapter (that is, not configured with a router) are computed as follows:

1. If the property `adapter.PublishedEndpoints` is set, use the specified endpoints.
2. Otherwise, start from the physical endpoints and split them into loopback and multicast endpoints on one side, and
   regular endpoints on the other.
   1. If there is any regular endpoint, discard the loopback and multicast endpoints, and replace the host in each
      remaining endpoint by the value of `adapter.PublishedHost`, or by the DNS name of the current host when
      `adapter.PublishedHost` is not set.
   2. Otherwise, when all endpoints are loopback or multicast, replace the host in each endpoint by the value of
      `adapter.PublishedHost`, if set. Perform no substitution when `adapter.PublishedHost` is not set.
   3. Finally, eliminate duplicate endpoints.

## A Router's Effect on Object Adapter Endpoints

If an object adapter is configured with a router, the adapter's published endpoints are those provided by the router's
server proxy. Calling `setPublishedEndpoints` on such an object adapter will throw an illegal argument exception. See
[Routers](../../invocation/routers) for additional information.

## See Also

- [Object Adapter Properties](../../../property-reference/object-adapter-properties)
- [Ice.Default.*](../../../property-reference/ice-default-properties)
- [IceGrid](../../../services/icegrid)
- [Communicator](../../communicator)
- [Routers](../../invocation/routers)
