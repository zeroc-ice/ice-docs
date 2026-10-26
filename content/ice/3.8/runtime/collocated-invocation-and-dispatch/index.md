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

An invocation is _collocated_ when the proxy and the object adapter that holds the target servant were created with the
same communicator. By default, Ice dispatches a collocated invocation directly to that object adapter instead of sending
it over a connection. This is the _collocation optimization_: it skips the transport, and nothing else. Ice marshals the
arguments and unmarshals the results of a collocated invocation, and unmarshals the arguments and marshals the results
of the dispatch, exactly as for an invocation over a connection. An invocation between two communicators is not
collocated, even when both communicators are in the same process.

## When Ice Uses Collocation Optimization

Ice decides whether a proxy's invocations are collocated based on the kind of proxy:

- For an [indirect proxy](../invocation/proxy-endpoints#proxy-with-no-endpoint) with an adapter ID, Ice uses collocation
  optimization if the proxy's adapter ID matches the adapter ID or replica group ID of an object adapter in the same
  communicator.
- For a [well-known proxy](../invocation/proxy-endpoints/well-known-proxy), Ice checks the Active Servant Map of each
  object adapter to determine whether the servant is local; it does not consult default servants and servant locators.
- For a [direct proxy](../invocation/proxy-endpoints#proxy-with-no-endpoint), Ice performs an endpoint search using the
  proxy's endpoints.

During an endpoint search, Ice compares each of the proxy's endpoints with the
[published endpoints](../dispatch/object-adapter-endpoints#published-object-adapter-endpoints) of the communicator's
object adapters. Two endpoints match when they have the same transport, host and port; other attributes of an endpoint
are not considered. Ice compares hosts as strings, without resolving them: a proxy with the endpoint
`tcp -h localhost -p 4061` does not match an object adapter that publishes `tcp -h server.example.com -p 4061`. Ice
excludes datagram (UDP) endpoints from this search.

With [connection caching](../connection-management/connection-establishment) enabled, the default, Ice makes this
decision during the proxy's first invocation and keeps it for the following invocations. With connection caching
disabled, Ice makes it for each invocation.

## Disabling Collocation Optimization

Collocation optimization is enabled by default. You rarely need to disable it: the usual reasons are a servant that
needs the connection of the request, which a collocated dispatch does not have, and a test that must exercise the
transport within a single process. You can disable it for all proxies by setting
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
- A collocated dispatch has no connection: the servant sees a null `con` in `Current`.

{% iflang langs="java" %}

- When the servant does not use AMD, the callbacks attached to the future of an asynchronous collocated invocation run
  in the thread that dispatched the request.

{% /iflang %}

## Creating an Object Adapter for Collocated Invocations

An object adapter needs no endpoints if its only purpose is to dispatch collocated requests. You can create one by
calling `createObjectAdapter` with an empty name. Ice reads no properties for an object adapter created this way, so you
cannot configure it with properties.

Proxies created by such an object adapter contain no endpoints: they are well-known proxies, and Ice finds their servant
in the Active Servant Map of an object adapter, as described above.

## See Also

- [Connection Establishment](../connection-management/connection-establishment)
- [Obtaining Proxies](../invocation/creating-proxies)
