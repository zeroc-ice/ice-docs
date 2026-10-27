---
title: IceDiscovery
---

## IceDiscovery Overview

IceDiscovery provides a location service using UDP multicast that allows Ice applications to discover objects and object
adapters.

IceDiscovery is an [Ice plug-in](../plug-in-facility) that you install in both clients and servers. It installs a
[locator](../../runtime/locators) in the communicator: your clients use
[indirect proxies](../../runtime/invocation/proxy-endpoints#proxy-with-no-endpoint), such as `greeter@greeterAdapter` or
`greeter`, with no server endpoints and no locator endpoints in their configuration. In a server, an object adapter with
an adapter ID registers its endpoints with this locator. In a client, this locator resolves an indirect proxy by sending
a lookup request over multicast to the servers; the server that hosts this object adapter or this object replies to the
client.

IceDiscovery and [IceGrid](../../services/icegrid) both provide a location service. IceDiscovery needs no additional
process: the clients and servers of your application find each other on the local network with UDP multicast, as long as
the servers are running. IceGrid provides its location service through a registry that you deploy and configure, and
also manages your servers, with features such as on-demand server activation, replication and remote administration. To
discover an IceGrid registry with multicast, use [IceLocatorDiscovery](../icelocatordiscovery).

## Installing IceDiscovery

Install the IceDiscovery plug-in in every client that needs to locate objects and in every server that hosts those
objects. IceDiscovery sends its lookup requests with UDP multicast, so your network must support it.

{% language-section name="mapping" /%}

## Configuring IceDiscovery

Applications configure IceDiscovery with properties. IceDiscovery installs its own locator as the default locator of the
communicator: do not set `Ice.Default.Locator` in an application that installs IceDiscovery.

### IceDiscovery Property Overview

IceDiscovery works without any configuration: all the clients and servers use the same default multicast address and
port.

The main properties are:

- [IceDiscovery.DomainId](../../property-reference/icediscovery-properties#icediscovery.domainid) separates unrelated
  applications that use the same multicast address and port: a client includes its domain ID in each lookup request, and
  a server ignores the requests for another domain ID.
- [IceDiscovery.Address](../../property-reference/icediscovery-properties#icediscovery.address) and
  [IceDiscovery.Port](../../property-reference/icediscovery-properties#icediscovery.port) set the multicast address and
  port. The clients and servers of an application must use the same values.
- [IceDiscovery.Interface](../../property-reference/icediscovery-properties#icediscovery.interface) restricts the
  plug-in to one network interface. By default, the plug-in uses all interfaces.

For example, to use a different multicast address and port:

```config
IceDiscovery.Address=239.255.0.99
IceDiscovery.Port=8000
```

See [IceDiscovery Properties](../../property-reference/icediscovery-properties) for the complete list.

### Configuring IceDiscovery in Servers

Install the plug-in in your server and, if your application changes the default multicast address, port or domain ID,
set these [properties](#icediscovery-property-overview) in the server as well. Then configure an adapter ID for each
object adapter whose objects clients discover. For example, for an object adapter named `GreeterAdapter`, set its
[AdapterId](../../property-reference/object-adapter-properties#adapter.adapterid) property:

```config
GreeterAdapter.AdapterId=greeterAdapter
```

The adapter ID must be unique among the servers that share the same address and domain settings. The object adapter
registers its endpoints when you activate it.

To replicate an object adapter, also set its
[ReplicaGroupId](../../property-reference/object-adapter-properties#adapter.replicagroupid) property:

```config
GreeterAdapter.AdapterId=greeter-1234
GreeterAdapter.ReplicaGroupId=greeterPool
```

The indirect proxy `greeter@greeter-1234` refers to the object `greeter` in this particular object adapter, whereas
`greeter@greeterPool` refers to the object `greeter` in any of the object adapters of the replica group `greeterPool`.

### Configuring IceDiscovery in Clients

Install the plug-in in your client and, if your application changes the default multicast address, port or domain ID,
set these [properties](#icediscovery-property-overview) in the client as well. The client uses an indirect proxy for the
object, in one of two forms:

- `greeter@greeterAdapter`: an identity with an adapter ID or a replica group ID.
- `greeter`: a [well-known proxy](../../runtime/invocation/proxy-endpoints/well-known-proxy), which holds only the
  identity.

## Discovery Process

When the Ice runtime resolves an indirect proxy for the first time, the client's plug-in sends a lookup request over
multicast and waits for the reply of a server. The plug-in waits for
[IceDiscovery.Timeout](../../property-reference/icediscovery-properties#icediscovery.timeout) milliseconds, and sends
the request again up to
[IceDiscovery.RetryCount](../../property-reference/icediscovery-properties#icediscovery.retrycount) times. For a replica
group, the plug-in also waits for the replies of the other replicas, for a duration derived from the time the first
reply took and
[IceDiscovery.LatencyMultiplier](../../property-reference/icediscovery-properties#icediscovery.latencymultiplier), and
returns the endpoints of all the replicas that replied. For a well-known proxy, a server replies when one of its object
adapters with an adapter ID hosts the object, through a servant in its Active Servant Map, a default servant or a
servant locator; the plug-in then resolves this adapter ID with a second lookup.

The Ice runtime keeps the result in its [locator cache](../../runtime/locators/locator-semantics-for-clients), and the
client communicates directly with the server from then on.

## See Also

- [IceDiscovery.*](../../property-reference/icediscovery-properties)
- [Plug-in Facility](../plug-in-facility)
- [Locators](../../runtime/locators)
- [Well-Known Proxy](../../runtime/invocation/proxy-endpoints/well-known-proxy)
- [IceGrid](../../services/icegrid)
