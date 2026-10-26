---
title: IceDiscovery
---

## IceDiscovery Overview

IceDiscovery provides a location service using UDP multicast that allows Ice applications to discover objects and object
adapters.

IceDiscovery is an [Ice plug-in](../plug-in-facility) that you install in both clients and servers. It installs a
[locator](../../runtime/locators) in the communicator. In a server, an object adapter with an adapter ID registers its
endpoints with this locator. In a client, this locator resolves an
[indirect proxy](../../basics/terminology#indirect-proxies), such as `greeter@greeterAdapter` or `greeter`, by sending a
lookup request over multicast to the servers; the server that hosts the object adapter or the object replies with its
endpoints. The client does not need to configure the endpoints of the objects it uses.

IceDiscovery and [IceGrid](../../services/icegrid) both provide a location service. Use IceDiscovery when your
application needs a lightweight, transient location service. IceGrid's location service is backed by a persistent
database and is one of several IceGrid features, along with remote administration and on-demand server activation. If
you need a location service but aren't yet ready to use IceGrid, start with IceDiscovery; migrating to IceGrid later
won't be difficult. To discover an IceGrid registry with multicast, use [IceLocatorDiscovery](../icelocatordiscovery)
instead.

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

In addition to [installing the plug-in](#installing-icediscovery) and optionally
[configuring its addressing information](#icediscovery-property-overview), configure an adapter ID for each object
adapter whose objects clients discover. For example, for an object adapter named `GreeterAdapter`, set its
[AdapterId](../../property-reference/object-adapter-properties#adapter.adapterid) property:

```config
GreeterAdapter.AdapterId=greeterAdapter
```

The adapter ID must be unique among the servers that share the same address and domain settings. The object adapter
registers its endpoints when you activate it. It must use the locator installed by IceDiscovery; an explicit
`GreeterAdapter.Locator` property overrides the communicator's default locator.

To replicate an object adapter, also set its
[ReplicaGroupId](../../property-reference/object-adapter-properties#adapter.replicagroupid) property:

```config
GreeterAdapter.AdapterId=greeter-1234
GreeterAdapter.ReplicaGroupId=greeterPool
```

The indirect proxy `greeter@greeter-1234` refers to the object `greeter` in this particular object adapter, whereas
`greeter@greeterPool` refers to the object `greeter` in any of the object adapters of the replica group `greeterPool`.
The application is responsible for keeping any persistent state consistent between the servers that host replicated
object adapters.

### Configuring IceDiscovery in Clients

An IceDiscovery client needs no configuration beyond [installing the plug-in](#installing-icediscovery) and, optionally,
[configuring its addressing information](#icediscovery-property-overview). It uses an indirect proxy for the object, in
one of two forms:

- `greeter@greeterAdapter`, an identity with an adapter ID or a replica group ID.
- `greeter`, a [well-known proxy](../../runtime/invocation/proxy-endpoints/well-known-proxy), which holds only the
  identity.

## Discovery Process

When a client uses an indirect proxy with an adapter ID for the first time:

- The Ice runtime asks the locator installed by IceDiscovery for the endpoints of the adapter ID.
- The client's IceDiscovery plug-in sends a `findAdapterById` request over multicast. This lookup request includes the
  adapter ID and a proxy that the server's IceDiscovery plug-in uses to reply to the client's plug-in.
- Every server that installs the plug-in and uses the same address and port receives the lookup request; only a server
  with the same domain ID that hosts this object adapter, or an object adapter of this replica group, replies.
- The client plug-in waits for a reply for a
  [configurable timeout period](../../property-reference/icediscovery-properties); if it doesn't receive a reply, it
  sends the request again a [configurable number of times](../../property-reference/icediscovery-properties) before
  giving up.
- The server's IceDiscovery plug-in replies with a proxy that holds the endpoints of the object adapter, and whether the
  adapter ID names a replica group.
- If the adapter ID names an individual object adapter, the client's plug-in returns these endpoints to the Ice runtime.
  If it names a replica group, the client's plug-in waits for replies from other servers, for a duration based on the
  time it took to receive the first reply and a configurable
  [latency multiplier](../../property-reference/icediscovery-properties), and returns the endpoints of all the replies.
- The Ice runtime caches the endpoints, and the client communicates directly with the target object using these
  endpoints.

When the client uses a well-known proxy for the first time, an additional step comes first:

- The Ice runtime asks the locator installed by IceDiscovery for the object with this identity.
- The client's IceDiscovery plug-in sends a `findObjectById` request over multicast, which includes the identity and a
  proxy for the reply, and retries it like a `findAdapterById` request.
- The IceDiscovery plug-in of each server that receives this request pings the object through the replica group IDs of
  the object adapters that registered with it, and then, if none of these pings succeeds, through their adapter IDs. As
  the ping is an ordinary dispatch, the object can be incarnated by a servant in the Active Servant Map, a default
  servant, or a servant returned by a servant locator. A server that reaches the object replies with an indirect proxy
  for it, with one of these replica group IDs or adapter IDs.
- The Ice runtime caches this indirect proxy, and resolves it as described above.

The Ice runtime reuses the information in its [locator cache](../../runtime/locators/locator-semantics-for-clients)
according to the proxy's locator cache timeout, and performs another lookup when this information expires or becomes
unusable. The server plug-in replies to the client plug-in with UDP unicast by default. All subsequent communication
between the client and the target object proceeds directly, without IceDiscovery.

## IceDiscovery Design Decisions

Incorporating IceDiscovery into your application requires answering the following questions:

- Which objects should clients discover? Applications typically don't need to make _every_ object available for
  discovery. Designs often make only "bootstrap" or "factory" objects available for discovery; clients obtain proxies
  for the other objects by invoking operations on these initial objects.

- How should clients refer to these objects? An indirect proxy is either an identity by itself, such as `factory`, or an
  identity with an adapter ID, such as `factory@AccountAdapter`. A proxy with only an identity doesn't depend on which
  object adapter hosts the object.

- Can unrelated applications share the same multicast address and port? If so, give each application its own
  [IceDiscovery.DomainId](../../property-reference/icediscovery-properties#icediscovery.domainid).

- Do you need replicated objects? Replicated object adapters improve the fault tolerance of your application by letting
  independent server processes implement the same logical objects. Configure your servers as described
  [above](#configuring-icediscovery-in-servers), and use the replica group IDs in your clients' indirect proxies.

If you need additional functionality, consider using IceGrid.

## See Also

- [IceDiscovery.*](../../property-reference/icediscovery-properties)
- [Plug-in Facility](../plug-in-facility)
- [Locators](../../runtime/locators)
- [Well-Known Proxy](../../runtime/invocation/proxy-endpoints/well-known-proxy)
- [IceGrid](../../services/icegrid)
