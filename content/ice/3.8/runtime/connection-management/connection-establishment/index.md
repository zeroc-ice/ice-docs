---
title: Connection Establishment
---

Ice establishes connections on demand. When an invocation on a proxy needs a connection, Ice reuses an existing
connection if it can, and otherwise establishes a new connection to one of the
[proxy's endpoints](../../invocation/proxy-endpoints).

## Connection Reuse and Caching

Ice reuses connections at two levels:

- By default, a proxy caches the connection it obtains and uses it for its subsequent invocations.
- The communicator keeps the connections it establishes, and other proxies of this communicator share them.

When a proxy with connection caching enabled needs a connection, Ice prefers an endpoint that already has a connection.
It reuses an existing connection that meets the following conditions, and establishes a new connection only when no
existing connection does:

- The connection's remote endpoint matches one of the proxy's endpoints.
- The connection was established for the proxy's [connection ID](#connection-ids).

You disable connection caching with the `ice_connectionCached` [proxy method](api:Ice/ObjectPrx) or the
[_name_.ConnectionCached](../../../property-reference/proxy-properties#name.connectioncached) property. Ice then selects
a connection for each invocation on this proxy: it tries the endpoints in the order set by the
[endpoint selection policy](#endpoint-selection), whether or not an endpoint already has a connection, and reuses an
existing connection to the endpoint it selects. With the default `Random` policy, disabling connection caching spreads a
proxy's invocations across its endpoints, at the cost of potentially higher latency.

The communicator manages the lifetime of its connections independently of the proxies that use them, and
[closes](../connection-closure) a connection, for example after a period of
[inactivity](../../../property-reference/ice-connection-properties#ice.connection.name.inactivitytimeout). When the
connection a proxy caches closes, the proxy obtains a connection again for its next invocation.

## Endpoint Selection

When a proxy needs a connection, Ice derives a list of endpoints from the proxy's endpoints, or, for an
[indirect proxy](../../invocation/proxy-endpoints), from the endpoints its [locator](../../locators) returns:

1. It removes the endpoints of unknown transports.
2. It removes the endpoints that do not suit the proxy's invocation mode: datagram endpoints for twoway, oneway and
   batch oneway proxies, and non-datagram endpoints for datagram and batch datagram proxies.
3. It orders the endpoints according to the endpoint selection policy. `Random`, the default, shuffles the endpoints;
   `Ordered` keeps their order.
4. {% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}It resolves host names into IP addresses. When a
   host name resolves to several addresses, Ice tries them in the order the DNS resolver returns them, with IPv4
   addresses ahead of IPv6 addresses unless
   [Ice.PreferIPv6Address](../../../property-reference/ice-properties#ice.preferipv6address) is
   set.{% iflang langs="cpp,swift" %} On iOS, the system resolves the host names of TCP and SSL endpoints when Ice
   connects.{% /iflang %}{% /iflang %}{% iflang langs="js" %}It leaves host names to the JavaScript runtime, which
   resolves them when Ice connects.{% /iflang %} The endpoint selection policy orders the endpoints, not the addresses
   of a host name.

If no endpoint remains, the invocation fails with
`NoEndpointException`.{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %} For example, a twoway proxy
whose only endpoint is a UDP endpoint has no endpoint left.{% /iflang %}

With connection caching enabled, Ice looks for an existing connection to any endpoint in the list before it tries to
establish one, so the connection it reuses is not necessarily to the first endpoint, even with the `Ordered` policy.

You set the endpoint selection policy with the
[Ice.Default.EndpointSelection](../../../property-reference/ice-default-properties#ice.default.endpointselection)
property, the [_name_.EndpointSelection](../../../property-reference/proxy-properties#name.endpointselection) proxy
property, or the `ice_endpointSelection` [proxy method](api:Ice/ObjectPrx).

## Connection IDs

Each proxy has a connection ID, an empty string by default, and Ice reuses a connection for a proxy only if the
connection was established for the same connection ID. The `ice_connectionId` [proxy method](api:Ice/ObjectPrx) returns
a new proxy with the given connection ID. Proxies with the same connection ID form a group that shares connections, and
Ice establishes a new connection for a group that has none to a suitable endpoint.

The following example establishes three connections:

{% language-section name="mapping" /%}

`prx`, `g1` and `g2` each establish a connection because their connection IDs differ. `i1` inherits its connection ID
from `g1` and shares the `group1` connection; `i2` is configured with `group2` and shares the connection of `g2`.

## Failed Connection Attempts

When a connection attempt fails, Ice tries the next address or endpoint, until it establishes a connection or has tried
them all. A connection attempt that fails with `ConnectTimeoutException` ends this sequence: Ice does not try the
remaining addresses of the endpoint, nor, with connection caching enabled, the remaining endpoints.

When no attempt succeeds, Ice may [retry the invocation](../../invocation/automatic-retries), and a retry selects and
establishes a connection again, with all the endpoints. The invocation fails when Ice does not retry it or has used up
its retries.

{% callout type="tip" %}

Set `Ice.Trace.Network=2` to log each failed connection attempt, and `Ice.Trace.Retry=1` to log the retries.

{% /callout %}

## Connection Establishment Timeout

A connection attempt fails with `ConnectTimeoutException` when it does not complete within the time set by
[Ice.Connection.Client.ConnectTimeout](../../../property-reference/ice-connection-properties#ice.connection.name.connecttimeout),
10 seconds by default.

{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}

## Source Address for New Connections

Ice binds an outgoing connection to the source address of the endpoint it connects to. You set this address with the
[--sourceAddress](../../endpoint-syntax) endpoint option, and Ice gives the address set by
[Ice.Default.SourceAddress](../../../property-reference/ice-default-properties#ice.default.sourceaddress) to the
endpoints it parses without this option, such as those of a stringified proxy. An endpoint that Ice unmarshals, such as
an endpoint returned by a locator, has no source address, and the operating system then selects the source address. Both
settings take a numeric IP address.{% iflang langs="cpp,swift" %} On iOS, Ice does not bind TCP and SSL connections to a
source address.{% /iflang %}

{% /iflang %}

## See Also

- [Proxy Endpoints](../../invocation/proxy-endpoints)
- [The Ice Threading Model](../../threading-model)
- [Automatic Retries](../../invocation/automatic-retries)
- [IceGrid](../../../services/icegrid)
- [Ice.Default.*](../../../property-reference/ice-default-properties)
- [Miscellaneous Ice.* Properties](../../../property-reference/ice-properties)
