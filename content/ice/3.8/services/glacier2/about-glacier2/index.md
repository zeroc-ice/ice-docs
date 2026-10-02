---
title: About Glacier2
---

Glacier2, the router-firewall for Ice applications, addresses
[common firewall traversal issues](../common-firewall-traversal-issues) with minimal impact on clients or servers (or
firewall administrators). In the illustration below, Glacier2 becomes the server firewall for Ice applications. What is
not obvious in the diagram, however, is how Glacier2 eliminates much of the complexity of firewall traversal.

![Clients A and B use bidirectional connections through their firewall to Glacier2. Glacier2 forwards requests to servers A and B, which send callbacks to Glacier2 over separate connections.](/images/ice/3.8/about-glacier2/multiple-clients-and-servers.svg)

Complex network environments are a fact of life. Unfortunately, the cost of securing an enterprise's network is
increased application complexity and administrative overhead. Glacier2 helps to minimize these costs by providing a
low-impact, efficient and secure router for Ice applications.

Glacier2 has the following advantages and limitations.

## Advantages

- Clients often require only minimal changes to use Glacier2.
- Only one front-end port is necessary to support any number of servers, allowing a Glacier2 router to easily receive
  connections from a port-forwarding firewall.
- The number of connections to back-end servers is reduced. Glacier2 effectively acts as a connection concentrator,
  establishing a single connection to each back-end server to forward requests from any number of clients. Similarly,
  connections from back-end servers to Glacier2 for the purposes of sending callbacks are also concentrated.
- Servers are unaware of Glacier2's presence, and require no modifications whatsoever to use Glacier2. From a server's
  perspective, Glacier2 is just another local client, therefore servers are no longer required to advertise "public"
  endpoints in the proxies they create. Furthermore, back-end services such as [IceGrid](../icegrid) can continue to be
  used transparently via a Glacier2 router.
- [Callbacks through Glacier2](../callbacks-through-glacier2) are supported without requiring new connections from
  servers to clients. In other words, a callback from a server to a client is sent over an existing connection from the
  client to the server, thereby eliminating the administrative requirements associated with supporting callbacks in the
  client firewall.
- Glacier2 requires no knowledge of the application's Slice definitions and therefore is very efficient: it routes
  request and reply messages without unmarshalling the message contents.
- In addition to its primary responsibility of forwarding Ice requests, Glacier2 offers support for
  [user-defined session management and authentication](../glacier2-session-management).

## Limitations

- Datagram transports, namely UDP, are not supported.
- [Callback objects](../callbacks-through-glacier2) in a client must use a Glacier2-supplied category in their
  identities.

## See Also

- [How Glacier2 Works](../how-glacier2-works)
- [Common Firewall Traversal Issues](../common-firewall-traversal-issues)
- [Callbacks Through Glacier2](../callbacks-through-glacier2)
- [IceGrid](../icegrid)
