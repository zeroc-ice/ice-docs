---
id: connection-establishment
title: Connection Establishment
---

Connections are established as a side effect of using proxies. The first invocation on a proxy causes the associated communicator to search for an existing connection to one of the [proxy's endpoints](../proxy-endpoints); only if no suitable connection exists does the communicator establish a new connection to one of the proxy's endpoints.

This page describes how and when Ice establishes a new connection.

# Endpoint Selection for New Connections

A proxy performs a number of operations on its endpoints before it asks its communicator to supply a connection. These operations produce a list of zero or more endpoints that satisfy the proxy's configuration. If the resulting list is empty, the application receives `NoEndpointException` to indicate that no suitable endpoints could be found. For example, this situation can arise when a two-way proxy contains only a UDP endpoint; the UDP endpoint is eliminated from consideration because it cannot be used for two-way invocations.

The proxy performs the following steps to derive its endpoint list:

1. Remove the endpoints of unknown transports.
2. Remove endpoints that are not suitable for the proxy's invocation mode. For example, datagram endpoints are removed for twoway, oneway and batch oneway proxies. Similarly, non-datagram endpoints are removed for datagram and batch datagram proxies.
3. Perform DNS queries to convert host names into IP addresses, if necessary. For a multi-homed host name, the proxy adds a new endpoint for each address returned by the DNS query.
4. Sort the endpoints according to the configured selection type, which is established using the `ice_endpointSelection` proxy method. The default value is `Random`, meaning the endpoints are randomly shuffled. Alternatively, the value `Ordered` maintains the existing order of the endpoints.

If [connection caching](../connection-establishment#connection-caching) is enabled and the communicator [already has a compatible connection](../connection-establishment), it reuses the cached connection. Otherwise, the communicator attempts to connect to each endpoint in the list until it succeeds or exhausts the list; the order in which endpoints are selected for connection attempts depends on the endpoint selection policy. This policy can be set using a default property ([Ice.Default.EndpointSelection](../ice-default-properties)), using a proxy property ([*name*.EndpointSelection](../proxy-properties)), and using the `ice_endpointSelection` [proxy method](https://code.zeroc.com/manual/Ice/ObjectPrx).

# Error Semantics for Failed Connections

If a failure occurs during a connection attempt, the communicator tries to connect to all of the proxy's remaining endpoints until either a connection is successfully established or all attempts have failed. At that point, the communicator may attempt [automatic retries](../automatic-retries) depending on the value of the [Ice.RetryIntervals](../ice-properties) configuration property. The default value of this property is `0`, which causes the communicator to try connecting to all of the endpoints one more time.

{% callout type="success" %}

### Tip

Define the property `Ice.Trace.Retry=2` to monitor these attempts.
{% /callout %}

If no connection can be established on this second attempt, the communicator throws an exception that indicates the reason for the final failed attempt (typically `ConnectFailedException`). Similarly, if a connection was lost during a request and could not be reestablished (assuming the request can be retried), the communicator throws an exception that indicates the reason for the final failed attempt.

# Reusing an Existing Connection

When establishing a connection for a proxy, the communicator reuses an existing connection when all the following conditions are met:

- The proxy has [connection caching](../connection-establishment#connection-caching) enabled.
- The remote endpoint matches one of the proxy's endpoints.
- The connection matches the proxy's configuration. If a proxy configured with a [connection ID](../connection-establishment), the communicator only reuses a connection if it was established by a proxy with the same connection ID.

When a proxy has connection caching disabled, the communicator does not prefer an endpoint with an already established connection over other endpoints. It can select an endpoint without an established connection and create a new connection; or it can select an endpoint with an established connection and reuse that connection.

## Proxy Settings and Connection Reuse

The communicator does not consider [compression](../protocol-compression) settings when searching for existing connections to reuse; proxies whose compression settings differ can share the same connection (assuming all other selection criteria are satisfied).

Likewise, the communicator does not consider the deprecated endpoint timeout (`-t`) setting when searching for existing connections to reuse.

## Influencing Connection Reuse

The default behavior of the communicator, which is to reuse connections whenever possible, is appropriate for many applications because it conserves resources and typically has little or no impact on performance. However, when a server implementation attaches semantics to a connection, the client often must be designed to cooperate, despite the tighter coupling it causes. For example, a server might use a serialized [thread pool](../the-ice-threading-model) to preserve the order of requests received over each connection. If the client wants to execute several requests simultaneously, it must be able to force the communicator to establish new connections at will.

For those situations that require more control over connection reuse, Ice allows you to form arbitrary groups of proxies that share a connection by configuring them with the same connection identifier. The [proxy method](https://code.zeroc.com/manual/Ice/ObjectPrx) `ice_connectionId` returns a new proxy configured with the given connection ID. Once configured, the communicator ensures that the proxy only reuses a connection that was established by a proxy with the same connection ID (assuming all other criteria for connection reuse are also satisfied). A new connection is created if none with a matching ID is found, which means each proxy could conceivably have its own connection if each were assigned a unique connection ID.

As an example, consider the following code fragment:

{% language-section name="lang-1" /%}

A total of three connections are established by this example:

1. The proxy `prx` establishes a new connection. This proxy has the default connection ID (an empty string).
2. The proxy `g1` establishes a new connection because the only existing connection, the one established by `prx`, has a different connection ID.
3. Similarly, the proxy `g2` establishes a new connection because none of the existing connections have a matching connection ID.

The proxy `i1` inherits its connection ID from `g1`, and therefore shares the connection for `group1`; `i2` explicitly configured its connection ID and shares the `group2` connection with proxy `g2`.

# Connection Caching

When we refer to a proxy's connection, we actually mean the connection that the proxy is *currently* using. This connection can change over time, such that a proxy might use several connections during its lifetime. For example, an [inactive connection](../ice-connection-properties) may be closed gracefully and then transparently replaced by a new connection when activity resumes.

After establishing a connection in response to proxy activities, the communicator associated with this proxy adds the connection to an internal pool for subsequent [reuse](../connection-establishment) by other proxies. The communicator manages the lifetime of the connection and eventually [closes](../connection-closure) it. The connection is not affected by the life cycle of the proxies that use it, except that the lack of activity may prompt the communicator to close the connection after a while.

Once a proxy has been associated with a connection, the proxy's default behavior is to continue using that connection for all subsequent requests. In effect, the proxy caches the connection and attempts to use it for as long as possible in order to minimize the overhead of creating new connections. If the connection is later closed and the proxy is used again, the proxy repeats the connection-establishment procedure described [earlier](../connection-establishment).

There are situations in which this default caching behavior is undesirable, such as when a client has a proxy with multiple endpoints and wishes to balance the load among the servers at those endpoints. The client can disable connection caching by passing an argument of `false` to the proxy factory method `ice_connectionCached`. The new proxy returned by this method repeats the connection-establishment procedure before each request, thereby achieving request load balancing at the expense of potentially higher latency. This type of load balancing is performed solely by the client using whatever endpoints are contained in the proxy. More sophisticated forms of load balancing are also possible, such as when using [IceGrid](../icegrid).

Enabling or disabling connection caching on a proxy has two separate effects:

- when caching is enabled, the proxy remembers ("caches") a connection until the connection is closed, while when caching is disabled, the proxy does not remember the connection it previously used.
- when caching is enabled, Ice provides to this proxy an already established connection if possible; when caching is disabled, Ice does not prefer endpoints with established connections over other endpoints when providing a connection to this proxy.

# Connection Establishment Timeout

The default connection establishment timeout is 10 seconds, as determined by the [ConnectTimeout](../ice-connection-properties) property. If a connection cannot be established within the allotted time, Ice throws `ConnectTimeoutException`.

# Source Address for New Connections

You can force Ice to use a specific source address for TCP/IP connections. This can be useful in specific uses cases, such as to overcome the limited number of ephemeral ports. There are two ways to do this:

- Define the [Ice.Default.SourceAddress](../ice-default-properties) property to establish a default source address for all outgoing connections created by a communicator
- Include a [--sourceAddress](../endpoint-syntax) option in proxy endpoints, which overrides any setting for `Ice.Default.SourceAddress`

The value in each case must be an IP address.

##### See Also

- [Proxy Endpoints](../proxy-endpoints)
- [The Ice Threading Model](../the-ice-threading-model)
- [Automatic Retries](../automatic-retries)
- [IceGrid](../icegrid)
- [Ice.Default.*](../ice-default-properties)
- [Miscellaneous Ice.* Properties](../ice-properties)
