---
title: Locator Semantics for Clients
---

# Invocations with an Indirect Proxy

On the first use of an indirect proxy in an application, the communicator may issue a remote invocation on the locator
object. This activity is transparent to the application, as shown below:

![The client calls initialOp on an indirect proxy. The Ice runtime queries the locator, then the client sends initialOp to the located target object.](/attachments/3.8/locator-semantics-for-clients/locating-an-object.svg)

_Locating an object._

1. The client invokes the operation `initialOp` on an indirect proxy.
2. The communicator checks an internal cache (called the
   [_locator cache_](../locator-semantics-for-clients#locator-cache)) to determine whether a query has already been
   issued for the symbolic information in the proxy. If so, the cached endpoint is used and an invocation on the locator
   object is avoided. Otherwise, the communicator sends a locate request to the locator.
3. If the object is successfully located, the locator returns its current endpoints. The communicator in the client
   caches this information, [establishes a connection](../connection-establishment) to one of the endpoints, and
   proceeds to send the invocation as usual.
4. If the object's endpoints cannot be determined, the client receives an exception. `NotRegisteredException` is thrown
   when an identity, object adapter identifier or replica group identifier is not known. A client may also receive
   `NoEndpointException` if the location service failed to determine the current endpoints.

As far as the communicator is concerned, the locator simply converts the information in an indirect proxy into usable
endpoints. Whether the locator's implementation is more sophisticated than a simple lookup table is irrelevant to the
communicator. However, the act of performing this conversion may have additional semantics that the application must be
prepared to accept.

For example, when using IceGrid as your location service, the target server may be launched automatically if it is not
currently running, and the locate request does not complete until that server is started and ready to receive requests.
As a result, the initial request on an indirect proxy may incur additional overhead as all of this activity occurs.

# Replication with a Locator

An indirect proxy may substitute a [replica group](../terminology) identifier in place of the object adapter identifier.
In fact, the Ice runtime does not distinguish between these two cases and considers a replica group identifier as
equivalent to an object adapter identifier for the purposes of resolving the proxy. The location service implementation
must be able to distinguish between replica groups and object adapters using only this identifier.

The location service may return multiple endpoints in response to a locate request for an adapter or replica group
identifier. These endpoints might all correspond to a single object adapter that is available at several addresses, or
to multiple object adapters each listening at a single address, or some combination thereof. The communicator attaches
no semantics to the collection of endpoints, but the application can make assumptions based on its knowledge of the
location service's behavior.

When a location service returns more than one endpoint, the communicator behaves exactly as if the proxy had contained
several endpoints. As always, the goal of the communicator is to [establish a connection](../connection-establishment)
to one of the endpoints and deliver the client's request. By default, all requests made via the proxy that initiated the
connection are sent to the same server until that connection is closed.

After the connection is closed, subsequent use of the proxy causes the communicator to obtain another connection.
Whether that connection uses a different endpoint than previous connections depends on a number of factors, but it is
possible for the client to connect to a different server than for previous requests.

# Locator Cache

After successfully resolving an indirect proxy, the location service must return at least one endpoint. How the service
derives the list of endpoints that corresponds to the proxy is entirely implementation dependent. For example, IceGrid's
location service can be configured to respond in a variety of ways; one possibility uses a simple round-robin scheme,
while another selects endpoints based on the system load of the target hosts.

A `locate` request has the potential to significantly increase the latency of the application's invocation with a proxy,
and this is especially true if the locate request triggers additional implicit actions such as starting a new server
process. Fortunately, this overhead is normally incurred only during the application's initial invocation on the proxy,
but this impact is influenced by the communicator's caching behavior.

To minimize the number of `locate` requests, the communicator caches the results of previous requests. By default, the
results are cached indefinitely, so that once the communicator has obtained the endpoints associated with an indirect
proxy, it never issues another `locate` request for that proxy. Furthermore, the default behavior of a proxy is to
[cache its connection](../connection-establishment), that is, once a proxy has obtained a connection, it continues to
use that connection indefinitely.

Taken together, these two caching characteristics represent the Ice runtime's best efforts to optimize an application's
use of a location service: after a proxy is associated with a connection, all future invocations on that proxy are sent
on the same connection without any need for cache lookups, locate requests, or new connections.

If a proxy's connection is closed, the next invocation on the proxy prompts the communicator to consult its locator
cache to obtain the endpoints from the prior `locate` request. Next, the communicator searches for an
[existing connection](../connection-establishment) to any of those endpoints and uses that if possible (assuming the
proxy has [connection caching](../connection-establishment) enabled), otherwise it attempts to establish a new
connection to each of the endpoints until one succeeds. Only if that process fails does the communicator clear the entry
from its cache and issue a new `locate` request with the expectation that a usable endpoint is returned.

The communicator's default behavior is optimized for applications that require minimal interaction with the location
service, but some applications can benefit from more frequent `locate` requests. Normally this is desirable when
implementing a load-balancing strategy, as we discuss in more detail below. In order to increase the frequency of locate
requests, an application must configure a timeout for the locator cache and manipulate the connections of its proxies.

# Locator Cache Timeout

An application can define a timeout to control the lifetime of entries in the locator cache. This timeout can be
specified globally using the [Ice.Default.LocatorCacheTimeout](../ice-default-properties) property and for individual
proxies using the [proxy method](https://code.zeroc.com/manual/Ice/ObjectPrx) `ice_locatorCacheTimeout`. The
communicator's default behavior is equivalent to a timeout value of `-1`, meaning the cache entries never expire. Using
a timeout value greater than zero causes the cache entries to expire after the specified number of seconds. Finally, a
timeout value of zero disables the locator cache altogether.

The previous section explained the circumstances in which the communicator consults its locator cache. Briefly, this
occurs only when the application has invoked an operation on a proxy and the proxy is not currently associated with a
connection. If the timeout is set to zero, the communicator issues a new `locate` request immediately. Otherwise, for a
non-zero timeout, the communicator examines its locator cache to determine whether the endpoints from the previous
`locate` request have expired. If so, the communicator discards them and issues a new `locate` request.

Given this behavior, if your goal is to force a proxy invocation to issue `locate` requests more frequently, you can do
so only when the proxy is not associated with a connection. You can accomplish that in several ways:

- create a new proxy, which is inherently not connected by default
- [explicitly close](../connection-closure) the proxy's existing connection
- disable the proxy's [connection caching](../connection-establishment) behavior

Of these choices, the last one is the most common.

# Load Balancing with a Locator

Ice supports [proxy-based load balancing](../proxy-based-load-balancing) whose behavior is driven solely by a proxy's
configuration settings. A disadvantage of relying solely on this form of load balancing is that the client cannot make
any intelligent decisions based on the status of the servers. If you want to distribute your requests in a more
sophisticated way, you must either modify your clients to query the servers directly, or use a location service that can
transparently direct a client to an appropriate server. For example, the IceGrid location service can monitor the system
load on each server host and use that information when responding to locate requests.

The location service may return only one endpoint, which presumably represents the best server (at that moment) for the
client to use. With only one endpoint available, changing the proxy's endpoint selection type makes no difference.
However, by disabling connection caching and modifying the locator cache timeout, the application can force the
communicator to periodically retrieve an updated endpoint from the location service. For example, an application can set
a locator cache timeout of thirty seconds and communicate with the selected server for that period. After the timeout
has expired, the next invocation prompts the communicator to issue a new locate request, at which point the client might
be directed to a different server.

If the location service returns multiple endpoints, the application must be designed with knowledge of how to interpret
them. For instance, the location service may attach semantics to the order of the endpoints (such as least-loaded to
most-loaded) and intend that the application use the endpoints in the order provided. Alternatively, the client may be
free to select any of the endpoints. As a result, the application and the location service must cooperate to achieve the
desired results.

You can combine the simple form of load balancing described in the previous section with an intelligent location service
to gain even more flexibility. For example, suppose an application expects to receive multiple endpoints from the
location service and has configured its proxy to disable connection caching and set a locator cache timeout. For each
invocation, the communicator selects one of the endpoints provided by the location service. When the timeout expires,
the communicator issues a new `locate` request and obtains a fresh set of endpoints from which to choose.

##### See Also

- [Terminology](../terminology)
- [Connection Establishment](../connection-establishment)
- [Ice.Default.*](../ice-default-properties)
- [Proxy-Based Load Balancing](../proxy-based-load-balancing)
