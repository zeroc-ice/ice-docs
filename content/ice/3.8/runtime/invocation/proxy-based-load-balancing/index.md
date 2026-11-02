---
title: Proxy-Based Load Balancing
sidebarLabel: Load Balancing
---

Ice supports two types of load balancing:

- Locator-based load balancing
- Proxy-based load balancing

An application can use only one type or combine both to achieve the desired behavior. This page discusses proxy-based
load balancing; refer to [Locator Semantics for Clients](../../locators/locator-semantics-for-clients) for information
on load balancing with a locator.

## Proxies with Multiple Endpoints

A proxy can contain zero or more endpoints. A proxy with no endpoints typically means it's an indirect proxy that
requires a [location service](../../locators) to convert the proxy's symbolic information into endpoints at runtime.
Otherwise, a direct proxy contains at least one endpoint.

Regardless of whether endpoints are specified directly or indirectly, a proxy having multiple endpoints implies at a
minimum that the target object is available via multiple network interfaces, but often also means the object is
replicated to improve scalability and reliability. Such a proxy provides a client with several load balancing options
even when no location service is involved. The proxy's own configuration drives the runtime behavior, depending on how
the client configures the proxy's
[endpoint selection type](../../connection-management/connection-establishment#endpoint-selection) and
[connection caching](../../connection-management/connection-establishment#connection-reuse-and-caching) settings.

For example, suppose that a proxy contains several endpoints. In its default configuration, a proxy uses the `Random`
endpoint selection type and caches its connection. Upon the first invocation, Ice reuses an existing connection to one
of the proxy's endpoints, including a connection opened by another proxy of the same communicator, and connects to an
endpoint selected at random only when no such connection exists. The proxy then uses this connection for all its
invocations until the connection closes, so the proxies of a communicator that hold the same endpoints typically send
all their invocations to the same server.

With the `Ordered` endpoint selection type, Ice also reuses an existing connection to any of the proxy's endpoints
first, and otherwise connects to the endpoints in the order they appear in the proxy. Normally an application uses this
configuration when there is a preferred order to the servers.

## Per-Request Load Balancing

When a proxy with multiple endpoints does not cache its connection, Ice selects an endpoint for each invocation. With
the `Random` endpoint selection type, each invocation can therefore reach a different server. This is called
_per-request load balancing_.

{% callout type="note" %}

Using the `Ordered` endpoint selection type is not as common in this scenario: it sends each invocation to the primary
server, and falls back on a secondary server only for the invocations it cannot send to the primary server. While the
primary server is unavailable, each invocation first attempts to connect to it.

{% /callout %}

Here's some code that shows how to configure the proxy:

{% language-section name="mapping" /%}

We create a proxy with two endpoints, then use the factory methods to disable connection caching and set the endpoint
selection type. With the `Random` setting, Ice selects an endpoint at random for each invocation and reuses the
connection to this endpoint once it exists, so successive invocations can reach different servers, though not
necessarily in equal numbers.

If you're also using a location service, you may want to modify the proxy's
[locator cache timeout](../../locators/locator-semantics-for-clients) to force the Ice runtime in the client to query
the locator more frequently.

## See Also

- [Terminology](../../../basics/terminology)
- [Connection Establishment](../../connection-management/connection-establishment)
- [Ice.Default.*](../../../property-reference/ice-default-properties)
- [Locator Semantics for Clients](../../locators/locator-semantics-for-clients)
- [Load Balancing](../../../services/icegrid/load-balancing)
