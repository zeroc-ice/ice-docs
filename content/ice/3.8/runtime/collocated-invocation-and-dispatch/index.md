---
title: Collocated Invocation and Dispatch
sidebarLabel: Collocation
languages:
  - cpp
  - csharp
  - java
  - python
  - swift
---

An invocation is _collocated_ when the proxy and the object adapter that holds the target servant belong to the same
communicator. By default, Ice dispatches a collocated invocation directly to that object adapter instead of sending it
over a connection, which avoids the cost of the transport. This is the _collocation optimization_. An invocation between
two communicators is not collocated, even when both communicators are in the same process.

## When Ice Uses Collocation Optimization

Ice decides whether a proxy's invocations are collocated based on the kind of proxy:

- For an [indirect proxy](../../basics/terminology#indirect-proxies) with an adapter ID, Ice uses collocation
  optimization if the proxy's adapter ID matches the adapter ID or replica group ID of an object adapter in the same
  communicator.
- For a [well-known proxy](../invocation/proxy-endpoints/well-known-proxy), Ice checks the Active Servant Map of each
  object adapter to determine whether the servant is local.
- For a [direct proxy](../../basics/terminology#direct-proxies), Ice performs an endpoint search using the proxy's
  endpoints.

During an endpoint search, Ice compares each of the proxy's endpoints with the
[published endpoints](../dispatch/object-adapter-endpoints#published-object-adapter-endpoints) of the communicator's
object adapters. Two endpoints match when they have the same transport, host and port; other attributes of an endpoint
are not considered. Ice compares hosts as strings, without resolving them: a proxy with the endpoint
`tcp -h localhost -p 4061` does not match an object adapter that publishes `tcp -h server.example.com -p 4061`. Ice
excludes datagram (UDP) endpoints from this search.

Ice normally makes this decision once, during the proxy's first invocation, although the proxy's
[connection caching](../connection-management/connection-establishment) setting influences this behavior.

## Disabling Collocation Optimization

Collocation optimization is enabled by default. You can disable it for all proxies by setting
[Ice.Default.CollocationOptimized=0](../../property-reference/ice-default-properties), or for an individual proxy with
the factory method `ice_collocationOptimized(false)`. For proxies
[created from a property](../invocation/creating-proxies) using `propertyToProxy`, the property
[_name_.CollocationOptimized](../../property-reference/proxy-properties#name.collocationoptimized) configures the
default setting for the proxy.

## Differences from Invocations over a Connection

A collocated invocation differs from an invocation sent over a connection in the following respects:

- Ice dispatches most collocated invocations in the server-side thread pool, like invocations received over a
  connection. The exception is a synchronous twoway collocated invocation with no invocation timeout, which Ice
  dispatches in the calling thread.
- Ice ignores the holding state of the object adapter: a collocated invocation proceeds normally even if the target
  object's adapter is in the holding state.
- Ice calls the AMI callback of an asynchronous collocated invocation from the thread that dispatches the servant, not
  from the client-side thread pool, unless the servant uses AMD. In that case, Ice calls the AMI callback from the
  client-side thread pool.

## Creating an Object Adapter for Collocated Invocations

An object adapter needs no endpoints if its only purpose is to dispatch collocated requests. You can create one by
calling `createObjectAdapter` with an empty name. Ice reads no properties for an object adapter created this way, so you
cannot configure it with properties.

Proxies created by such an object adapter contain no endpoints, which essentially makes them well-known proxies. When
the program makes its initial invocation on such a proxy, Ice searches every local object adapter for a servant with an
identity matching that of the proxy. For Ice to successfully find the collocated servant, it must be present in the
object adapter's [active servant map](../dispatch/active-servant-map). Default servants and servant locators are not
queried in this situation.

## See Also

- [Connection Establishment](../connection-management/connection-establishment)
- [Obtaining Proxies](../invocation/creating-proxies)
