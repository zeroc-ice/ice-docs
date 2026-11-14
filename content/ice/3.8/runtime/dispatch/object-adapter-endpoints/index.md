---
title: Object Adapter Endpoints
languages:
  - cpp
  - csharp
  - java
  - js
  - python
  - swift
---

{% iflang langs="js" %}

An object adapter embeds its _published endpoints_ in the direct proxies it creates. In Ice for JavaScript, an object
adapter does not listen for connections, so it has no physical endpoints.

{% /iflang %}

{% iflang langs="cpp,csharp,java,python,swift" %}

An object adapter has two sets of [endpoints](../../endpoint-syntax):

- Its _physical endpoints_ are the endpoints on which it listens for connections.
- Its _published endpoints_ are the endpoints it embeds in the direct proxies it creates.

## Physical Object Adapter Endpoints

You configure the endpoints on which an object adapter listens when you [create it](../creating-an-object-adapter), in
one of two ways:

- Set the [_name_.Endpoints](../../../property-reference/object-adapter-properties#adapter.endpoints) property and call
  `createObjectAdapter`.
- Pass the endpoints to `createObjectAdapterWithEndpoints`.

An [endpoint](../../endpoint-syntax) consists of a transport, usually followed by a host and a port. For example, the
following object adapter listens for TCP connections on host `10.0.1.1` and port `9999`:

```config
MyAdapter.Endpoints=tcp -h 10.0.1.1 -p 9999
```

The `-h` option selects the network interfaces on which the object adapter listens:

- With a host name or IP address, the object adapter listens on the address or addresses of this host, which must be
  local.
- With `*`, it listens on all network interfaces, including the loopback interface.
- Without `-h`, it uses the host set by
  [Ice.Default.Host](../../../property-reference/ice-default-properties#ice.default.host), or listens on all network
  interfaces when this property is not set.

The `-p` option sets the port. Without `-p`, the operating system picks a port each time you create the object adapter,
so a direct proxy that a client kept from a previous run may no longer reach it. Give each endpoint a fixed port when
clients keep direct proxies across server restarts. An object adapter that clients reach through indirect proxies, such
as with [IceGrid](../../../services/icegrid), does not need a fixed port.

{% /iflang %}

## Published Object Adapter Endpoints

{% iflang langs="js" %}

An object adapter that is not configured with a router publishes the [endpoints](../../endpoint-syntax) set by
[adapter.PublishedEndpoints](../../../property-reference/object-adapter-properties#adapter.publishedendpoints), and no
endpoints when this property is not set.

{% /iflang %}

{% iflang langs="cpp,csharp,java,python,swift" %}

An object adapter embeds its published endpoints in the direct proxies it creates, and a client that receives such a
proxy connects to these endpoints.

By default, the object adapter derives its published endpoints from its physical endpoints:

1. It discards the loopback and multicast endpoints, unless all the endpoints are loopback or multicast.
2. It replaces the host in each remaining endpoint with the host name of the current host. When all the endpoints are
   loopback or multicast, it keeps their hosts.
3. It removes duplicate endpoints.

{% iflang langs="java" %}

{% callout type="note" %}

On Android, Ice cannot determine the host name, so set `adapter.PublishedHost` when clients use the proxies this object
adapter creates.

{% /callout %}

{% /iflang %}

For example, on host `Sun1`, the following object adapter has the published endpoint `tcp -h Sun1 -p 9999`:

```config
MyAdapter.Endpoints=tcp -p 9999
```

Two properties change the published endpoints:

- [adapter.PublishedHost](../../../property-reference/object-adapter-properties#adapter.publishedhost) sets the host
  that step 2 puts in each endpoint, including when all the endpoints are loopback or multicast.
- [adapter.PublishedEndpoints](../../../property-reference/object-adapter-properties#adapter.publishedendpoints) sets
  the published endpoints directly, and the object adapter skips the steps above.

Set `adapter.PublishedEndpoints` when clients reach the object adapter through another host and port. For example, with
a firewall that forwards connections on port `25000` of host `corpfw` to the object adapter:

```config
MyAdapter.Endpoints=tcp -h 10.0.1.1 -p 9999
MyAdapter.PublishedEndpoints=tcp -h corpfw -p 25000
```

Replicated servers can also set the same published endpoints, so that the proxies each replica creates spread the load
over all the replicas. For example, the servers on hosts `Sun1` and `Sun2` both set:

```config
MyAdapter.PublishedEndpoints=tcp -h Sun1 -p 9999:tcp -h Sun2 -p 9999
```

{% /iflang %}

## A Router's Effect on Object Adapter Endpoints

When an object adapter is configured with a router, its published endpoints are the endpoints of the router's server
proxy, and you can't set other published endpoints. See [Routers](../../invocation/routers).

## See Also

- [Object Adapter Properties](../../../property-reference/object-adapter-properties)
- [Ice.Default.*](../../../property-reference/ice-default-properties)
- [IceGrid](../../../services/icegrid)
- [Routers](../../invocation/routers)
