---
title: Collocated Invocation and Dispatch
---

## Overview

The Ice runtime is _location transparent_: the client does not need to know where the implementation of an Ice object
resides; an invocation on an object is automatically directed to the correct target, whether the object is implemented
in the local address space, in another address space on the same machine, or in another address space on a remote
machine. Location transparency is important because it allows us to change the location of an object implementation
without breaking client programs and, by using a location service such as [IceDiscovery](../icediscovery) or
[IceGrid](../icegrid), addressing information such as host names and port numbers can be externalized so they do not
appear in stringified proxies.

## Collocated Invocations

For invocations that cross address space boundaries (or more accurately, cross communicator boundaries), the Ice runtime
dispatches requests via the appropriate transport. However, for a proxy invocation in which the proxy and the servant
that processes the invocation share the same communicator (so-called _collocated_ invocations), the Ice runtime, by
default, does not send the invocation via the transport specified in the proxy. Instead, collocated invocations take a
short-cut inside the Ice runtime and are dispatched more efficiently.

{% callout type="info" %}

Note that if the proxy and the servant do not use the same communicator, the invocation is _not_ collocated, even though
caller and callee are in the same address space.

{% /callout %}

The reason for this is if collocated invocations were sent via TCP/IP, for example, invocations would still be sent via
the operating system kernel and would incur the full cost of creating TCP/IP connections, trapping in and out of the
kernel, and so on. By optimizing collocated requests, much of this overhead can be avoided.

For efficiency reasons, collocated invocations are not completely location transparent, that is, a collocated call has
semantics that differ in some ways from calls that cross address-space boundaries. Specifically, collocated invocations
differ from ordinary invocations in the following respects:

- Most collocated invocations are dispatched in the server-side thread pool just like regular invocations; the only
  exceptions are synchronous twoway collocated invocations with no invocation timeout, which are dispatched in the
  calling thread.
- The object adapter holding state is ignored: collocated invocations proceed normally even if the target object's
  adapter is in the holding state.
- AMI callbacks for asynchronous collocated invocations are dispatched from the servant's calling thread and not from
  the client-side thread pool unless AMD is used for the servant dispatch. In this case, the AMI callback is called from
  the client-side thread pool.

In practice, these differences rarely matter.

The Ice runtime uses the following semantics to determine whether a proxy is eligible for the collocated optimization:

- For an indirect proxy, collocation optimization is used if the proxy's adapter ID matches the adapter ID or replica
  group ID of an object adapter in the same communicator.
- For a [well-known proxy](../well-known-proxy), the Ice runtime queries each object adapter Active Servant Map to
  determine if the servant is local.
- For a direct proxy, the Ice runtime performs an endpoint search using the proxy's endpoints.

When an endpoint search is required, the Ice runtime compares each of the proxy's endpoints against the endpoints of the
communicator's object adapters. Only the transport, address and port are considered; other attributes of an endpoint are
not considered during this search.

{% callout type="info" %}

Datagram (UDP) endpoints are excluded from this search since Ice 3.8.

{% /callout %}

If a match is found, the invocation is dispatched using collocation optimization. Normally this search is executed only
once, during the proxy's first invocation, although the proxy's [connection caching](../connection-establishment)
setting influences this behavior.

Collocation optimization is enabled by default, but you can disable it for all proxies by setting the property
[Ice.Default.CollocationOptimized=0](../ice-default-properties). You can also disable the optimization for an individual
proxy using the factory method `ice_collocationOptimized(false)`. Finally, for proxies
[created from a property](../creating-proxies) using `propertyToProxy`, the property
[_name_.CollocationOptimized](../proxy-properties) configures the default setting for the proxy.

## Creating an Object Adapter for Collocated Invocations

An object adapter requires no endpoints if its only purpose is to dispatch collocated requests. You can create a
"collocated-only" object adapter by calling `createObjectAdapter` with an empty name.

Normally Ice requires an object adapter to either have endpoints or be configured with a router, but Ice relaxes this
restriction when the name is empty. Note however that this means collocated-only object adapters cannot be configured
using properties.

Proxies created by a collocated-only object adapter contain no endpoints, which essentially makes them well-known
proxies. When the program makes its initial invocation on such a proxy, Ice searches every local object adapter for a
servant with an identity matching that of the proxy. For Ice to successfully find the collocated servant, it must be
present in the object adapter's [active servant map](../active-servant-map). Default servants and servant locators are
not queried in this situation.

## See Also

- [IceDiscovery](../icediscovery)
- [IceGrid](../icegrid)
- [Connection Establishment](../connection-establishment)
- [Obtaining Proxies](../creating-proxies)
