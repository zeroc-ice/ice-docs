---
id: proxy-based-load-balancing
title: Proxy-Based Load Balancing
---

Ice supports two types of load balancing:

- Locator-based load balancing
- Proxy-based load balancing

An application can use only one type or combine both to achieve the desired behavior. This page discusses proxy-based load balancing; refer to [Locator Semantics for Clients](../locator-semantics-for-clients) for information on load balancing with a locator.

# Proxy Connection Caching

Before we discuss load balancing, it's important to understand the relationship between proxies and connections.

By default a proxy remembers its connection and uses it for all invocations until that connection is closed. You can prevent a proxy from caching its connection by calling the `ice_connectionCached` proxy method with an argument of false. Once connection caching is disabled, each invocation on a proxy causes the Ice runtime to execute its connection establishment process.

Note that each invocation on such a proxy does not necessarily cause the Ice runtime to establish a new connection. It only means that the Ice runtime does not assume that it can reuse the connection of the proxy's previous invocation. Whether the Ice runtime actually needs to [establish a new connection](../connection-establishment) for the next invocation depends on several factors.

As with any feature, you should only use it when the benefits outweigh the risks. With respect to a proxy's connection caching behavior, there is certainly a small amount of computational overhead associated with executing the connection establishment process for each invocation, as well as the risk of significant overhead each time a new connection is actually created.

# Proxies with Multiple Endpoints

A proxy can contain zero or more endpoints. A proxy with no endpoints typically means it's an indirect proxy that requires a [location service](../locators) to convert the proxy's symbolic information into endpoints at runtime. Otherwise, a direct proxy contains at least one endpoint.

Regardless of whether endpoints are specified directly or indirectly, a proxy having multiple endpoints implies at a minimum that the target object is available via multiple network interfaces, but often also means the object is replicated to improve scalability and reliability. Such a proxy provides a client with several load balancing options even when no location service is involved. The proxy's own configuration drives the run-time behavior, depending on how the client configures the proxy's [endpoint selection type](../connection-establishment) and [connection caching](../proxy-based-load-balancing) settings.

For example, suppose that a proxy contains several endpoints. In its default configuration, a proxy uses the `Random` endpoint selection type and caches its connection. Upon the first invocation, the Ice runtime selects one of the proxy's endpoints at random and uses that connection for all subsequent invocations until the connection is closed. For some applications, this form of load balancing may be sufficient.

Suppose now that we use the `Ordered` endpoint selection type instead. In this case, the Ice runtime always attempts to establish connections using the endpoints in the order they appear in the proxy. Normally an application uses this configuration when there is a preferred order to the servers. Again, once connected, the Ice runtime uses whichever connection was chosen indefinitely.

# Per-Request Load Balancing

When we disable the connection caching behavior of a proxy with multiple endpoints, its semantics undergo a significant change. Using the `Random` [endpoint selection type](../connection-establishment), the Ice runtime selects one of the endpoints at random and [establishes a connection](../connection-establishment) to it if one is not already established, and this process is repeated *prior to each subsequent invocation*. This is called *per-request load balancing* because each request can potentially be directed to a different server.

{% callout type="info" %}
Using the `Ordered` endpoint selection type is not as common in this scenario; its main purpose would be to fall back on a secondary server if the primary server is not available, but it causes the Ice runtime to attempt to contact the primary server during each request.
{% /callout %}

Here's some code that shows how to configure the proxy:

{% language-section name="lang-1" /%}

We create a proxy with two endpoints, then use the factory methods to disable connection caching and set the endpoint selection type. The `Random` setting means that, after we've made a few invocations with the proxy, the Ice runtime will have established connections to both endpoints. After incurring the initial expense of opening the connections, each subsequent invocation will randomly use one of the existing connections.

If you're also using a location service, you may want to modify the proxy's [locator cache timeout](../locator-semantics-for-clients) to force the Ice runtime in the client to query the locator more frequently.

##### See Also

- [Terminology](../terminology)
- [Connection Establishment](../connection-establishment)
- [Ice.Default.*](../ice-default-properties)
- [Locator Semantics for Clients](../locator-semantics-for-clients)
- [Load Balancing](../load-balancing)
