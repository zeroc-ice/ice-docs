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

- its _physical endpoints_, on which it listens for connections;
- its _published endpoints_, which it embeds in the direct proxies it creates and, when it has an adapter ID, registers
  with the [locator registry](../../locators/locator-semantics-for-servers).

## Physical Object Adapter Endpoints

The [_name_.Endpoints](../../../property-reference/object-adapter-properties#adapter.endpoints) property sets the
physical endpoints of an object adapter, and so does `createObjectAdapterWithEndpoints` when you
[create the object adapter](../creating-an-object-adapter).

The host of an endpoint selects the network interfaces on which the object adapter listens:

- with a host name or IP address, the object adapter listens on the address or addresses of this host, which must be
  local;
- with `*`, it listens on all network interfaces, including the loopback interface;
- without a host, it uses the host set by
  [Ice.Default.Host](../../../property-reference/ice-default-properties#ice.default.host), or listens on all network
  interfaces when this property is not set.

For example, the object adapter `MyAdapter` configured as follows listens on the network interface with address
`10.0.1.1` only, and not on the loopback interface:

```config
MyAdapter.Endpoints=tcp -h 10.0.1.1 -p 9999
```

Without a port, the operating system picks a port each time you create the object adapter, and the proxies that clients
kept from a previous run no longer reach it. Give the endpoints a fixed port, unless clients reach the object adapter
through indirect proxies, such as with [IceGrid](../../../services/icegrid), or use its proxies only while the server
runs. An object adapter with an adapter ID registers its published endpoints with the
[locator registry](../../locators/locator-semantics-for-servers) when you activate it.

{% /iflang %}

## Published Object Adapter Endpoints

{% iflang langs="js" %}

An object adapter that is not configured with a router publishes the [endpoints](../../endpoint-syntax) set by
[adapter.PublishedEndpoints](../../../property-reference/object-adapter-properties#adapter.publishedendpoints), and no
endpoints when this property is not set.

{% /iflang %}

{% iflang langs="cpp,csharp,java,python,swift" %}

An object adapter that is not configured with a router publishes the endpoints set by
[adapter.PublishedEndpoints](../../../property-reference/object-adapter-properties#adapter.publishedendpoints). When
this property is not set, it derives its published endpoints from its physical endpoints:

1. It discards the loopback and multicast endpoints, unless all the endpoints are loopback or multicast.
2. It replaces the host of each endpoint with the value of
   [adapter.PublishedHost](../../../property-reference/object-adapter-properties#adapter.publishedhost). When this
   property is not set, it uses the DNS name of the current host, unless all the endpoints are loopback or multicast:
   then it keeps their hosts.
3. It removes duplicate endpoints.

For example, the following object adapter publishes `tcp -h Sun1 -p 9999` on host `Sun1`:

```config
MyAdapter.Endpoints=tcp -p 9999
```

{% iflang langs="java" %}

On Android, Ice cannot determine the DNS name of the current host: set `adapter.PublishedHost` when clients use the
proxies this object adapter creates.

{% /iflang %}

Set `adapter.PublishedHost` to publish another host name, or `adapter.PublishedEndpoints` when clients reach the object
adapter through another host or port, such as through a firewall that forwards connections to `corpfw` on port `25000`
to the object adapter:

```config
MyAdapter.Endpoints=tcp -h 10.0.1.1 -p 9999
MyAdapter.PublishedEndpoints=tcp -h corpfw -p 25000
```

Replicated servers can also publish the endpoints of all the replicas, so that the proxies each one creates spread the
load over all of them. For example, the server on host `Sun1` and the server on host `Sun2` both publish:

```config
MyAdapter.PublishedEndpoints=tcp -h Sun1 -p 9999:tcp -h Sun2 -p 9999
```

{% /iflang %}

## A Router's Effect on Object Adapter Endpoints

An object adapter configured with a router publishes the endpoints of the router's server proxy, and you can't set other
published endpoints. See [Routers](../../invocation/routers).

## See Also

- [Object Adapter Properties](../../../property-reference/object-adapter-properties)
- [Ice.Default.*](../../../property-reference/ice-default-properties)
- [IceGrid](../../../services/icegrid)
- [Routers](../../invocation/routers)
