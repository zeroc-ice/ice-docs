---
title: Proxy-Based Load Balancing
sidebarLabel: Load Balancing
---

A proxy with several endpoints, listed in the proxy or returned by a [locator](../../locators), can spread invocations
over several servers. [Locator Semantics for Clients](../../locators/locator-semantics-for-clients) describes load
balancing with a locator.

## Connection Caching

By default, a proxy
[caches its connection](../../connection-management/connection-establishment#connection-reuse-and-caching) and uses the
`Random` [endpoint selection type](../../connection-management/connection-establishment#endpoint-selection). On the
first invocation, Ice reuses an existing connection to any of the proxy's endpoints, including one opened by another
proxy, and otherwise connects to the endpoints in random order. The proxy then sends all its invocations over this
connection until the connection closes, so the proxies of a communicator that hold the same endpoints typically reach
the same server.

With the `Ordered` endpoint selection type, Ice connects to the endpoints in the order they appear in the proxy, and
still reuses an existing connection to any of them first.

## Per-Request Load Balancing

When a proxy does not cache its connection, Ice selects an endpoint for each invocation, and uses an existing connection
to this endpoint or connects to it. With the `Random` endpoint selection type, successive invocations can therefore
reach different servers, though not necessarily in equal numbers:

{% language-section name="mapping" /%}

With the `Ordered` endpoint selection type, each invocation goes to the first endpoint, and to the next ones only when
Ice cannot connect to the first. While the first server is unavailable, each invocation first attempts to connect to it.

With a locator, the [locator cache timeout](../../locators/locator-semantics-for-clients) sets how long Ice uses the
endpoints returned by the locator before it queries the locator again.

## See Also

- [Terminology](../../../basics/terminology)
- [Connection Establishment](../../connection-management/connection-establishment)
- [Ice.Default.*](../../../property-reference/ice-default-properties)
- [Locator Semantics for Clients](../../locators/locator-semantics-for-clients)
- [Load Balancing](../../../services/icegrid/load-balancing)
