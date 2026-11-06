---
title: Proxy-Based Load Balancing
sidebarLabel: Load Balancing
---

A proxy to a [replicated object](../proxies-to-replicated-objects) can distribute its invocations over the replicas: a
direct proxy holds the endpoints of the replicas, and an indirect proxy gets them from the [locator](../../locators).
[Locator Semantics for Clients](../../locators/locator-semantics-for-clients) describes load balancing with a locator.

## Load Balancing with Connection Caching

By default, a proxy
[caches its connection](../../connection-management/connection-establishment#connection-reuse-and-caching) and uses the
`Random` [endpoint selection type](../../connection-management/connection-establishment#endpoint-selection). On the
first invocation, Ice reuses an existing connection to any of the proxy's endpoints, including one opened by another
proxy; otherwise, it tries the endpoints in random order until it establishes a connection to one of them. The proxy
then sends all its invocations over this connection until the connection closes, so the proxies of a communicator that
hold the same endpoints typically reach the same server.

With the `Ordered` endpoint selection type, Ice tries the endpoints in the order they appear in the proxy, and still
reuses an existing connection to any of them first.

## Per-Request Load Balancing

When a proxy does not cache its connection, Ice selects an endpoint for each invocation, and uses an existing connection
to this endpoint or connects to it. With the `Random` endpoint selection type, successive invocations can therefore
reach different servers, though not necessarily in equal numbers:

{% language-section name="mapping" /%}

With the `Ordered` endpoint selection type, each invocation goes to the first endpoint, and to the next ones only when
Ice cannot connect to the first. Ice does not remember a failed connection attempt: while the first server is
unavailable, every invocation starts with an attempt to connect to it.

## See Also

- [Terminology](../../../basics/terminology)
- [Connection Establishment](../../connection-management/connection-establishment)
- [Ice.Default.*](../../../property-reference/ice-default-properties)
- [Locator Semantics for Clients](../../locators/locator-semantics-for-clients)
- [Load Balancing](../../../services/icegrid/load-balancing)
