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

An object adapter does not listen for connections. Its _published endpoints_ are the endpoints it embeds in the direct
proxies it creates.

{% /iflang %}

{% iflang langs="cpp,csharp,java,python,swift" %}

An object adapter has two sets of [endpoints](../../endpoint-syntax):

- Its _physical endpoints_ are the endpoints on which it listens for connections.
- Its _published endpoints_ are the endpoints it embeds in the direct proxies it creates, and the endpoints it registers
  with the [location service](../../locators/locator-semantics-for-servers) when it has an adapter ID.

## Physical Object Adapter Endpoints

You specify the endpoints on which an object adapter listens when you [create it](../creating-an-object-adapter): with
the [_name_.Endpoints](../../../property-reference/object-adapter-properties#adapter.endpoints) property for
`createObjectAdapter`, or as an argument of `createObjectAdapterWithEndpoints`. We recommend a single endpoint, despite
the plural in these names: several endpoints provide no real benefit.

An [endpoint](../../endpoint-syntax) consists of a transport, usually followed by a host and a port. For example, the
following object adapter listens for TCP connections on address `10.0.1.1` and port `9999`:

```config
MyAdapter.Endpoints=tcp -h 10.0.1.1 -p 9999
```

The `-h` option selects the network interfaces on which the object adapter listens:

- With an IP address, the object adapter listens only on the network interface with this address: with `-h 10.0.1.1`, it
  does not listen on the loopback interface.
- With `*`, it listens on all network interfaces, including the loopback interface.
- Without `-h`, it uses the host set by the
  [Ice.Default.Host](../../../property-reference/ice-default-properties#ice.default.host) property, or listens on all
  network interfaces when this property is not set.

Specify an IP address, not a DNS name. See [IP Address Syntax](../../endpoint-syntax#ip-address-syntax) for the details
of the `-h` option.

The `-p` option sets the port. Without `-p`, the operating system picks a port each time you create the object adapter,
so a direct proxy that a client kept from a previous run may no longer reach it. Set a fixed port when clients reach the
object adapter with direct proxies. With indirect proxies, such as with [IceGrid](../../../services/icegrid), you can
let the operating system pick the port.

{% /iflang %}

## Published Object Adapter Endpoints

{% iflang langs="js" %}

An object adapter gets its published endpoints from its
[adapter.PublishedEndpoints](../../../property-reference/object-adapter-properties#adapter.publishedendpoints) property.
When this property is not set, the object adapter has no published endpoints.

{% /iflang %}

{% iflang langs="cpp,csharp,java,python,swift" %}

An object adapter gets its published endpoints from its
[adapter.PublishedEndpoints](../../../property-reference/object-adapter-properties#adapter.publishedendpoints) property.
When this property is not set, the object adapter derives its published endpoints from its physical endpoints:

1. It discards the loopback and multicast endpoints, unless all the endpoints are loopback or multicast.
2. It replaces the host in each remaining endpoint with the published host.
3. It removes duplicate endpoints.

The published host is the value of the
[adapter.PublishedHost](../../../property-reference/object-adapter-properties#adapter.publishedhost) property. When this
property is not set, the object adapter uses the host name of the current host, or keeps the host of each endpoint when
all the endpoints are loopback or multicast.

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

Set `adapter.PublishedHost` when clients reach this host under another name or address:

```config
MyAdapter.Endpoints=tcp -h 10.0.1.1 -p 9999
MyAdapter.PublishedHost=sun1.example.com
```

The published endpoint is then `tcp -h sun1.example.com -p 9999`.

Set `adapter.PublishedEndpoints` when clients reach the object adapter through another host and port. For example, with
a firewall that forwards connections on port `25000` of host `corpfw` to the object adapter:

```config
MyAdapter.Endpoints=tcp -h 10.0.1.1 -p 9999
MyAdapter.PublishedEndpoints=tcp -h corpfw -p 25000
```

When replicated servers return direct proxies to their clients, set the same published endpoints in all these servers,
so that each proxy carries the endpoints of [all the replicas](../../invocation/proxies-to-replicated-objects). For
example, the servers on hosts `Sun1` and `Sun2` both set:

```config
MyAdapter.PublishedEndpoints=tcp -h Sun1 -p 9999:tcp -h Sun2 -p 9999
```

Do not list the endpoints of other servers when the object adapter registers its published endpoints with a location
service, such as [IceGrid](../../../services/icegrid): each replica registers only its own endpoints.

{% /iflang %}

## A Router's Effect on Object Adapter Endpoints

When an object adapter is configured with a router, its published endpoints are the endpoints of the router's server
proxy, and you can't set other published endpoints. See [Routers](../../invocation/routers).

## See Also

- [Object Adapter Properties](../../../property-reference/object-adapter-properties)
- [Ice.Default.*](../../../property-reference/ice-default-properties)
- [IceGrid](../../../services/icegrid)
- [Routers](../../invocation/routers)
