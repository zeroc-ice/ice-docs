---
id: datagram-invocations
title: Datagram Invocations
---

# Design Considerations for Datagram Invocations

Datagram invocations are the equivalent of oneway invocations for datagram transports. As for oneway invocations, datagram invocations can be sent only for operations that have a `void` return type and do not have out-parameters or an exception specification. Attempts to use a datagram invocation with an operation that does not meet these criteria result in a `TwowayOnlyException`. In addition, datagram invocations can only be used if the proxy's endpoints include at least one UDP transport; otherwise, the Ice runtime throws a `NoEndpointException`.

The semantics of datagram invocations are similar to oneway invocations: no return traffic flows from the server to the client and proceed asynchronously with respect to the client; a datagram invocation completes as soon as the client's transport has accepted the invocation into its buffers. However, datagram invocations differ in one respect from oneway invocations in that datagram invocations optionally support multicast semantics. Furthermore, datagram invocations have additional error semantics:

- Individual requests may be lost or received out of order.

  On the wire, datagram requests are sent as true datagrams, that is, individual datagrams may be lost, or arrive at the server out of order. As a result, not only may requests be dispatched out of order, an individual request out of a series of requests may be lost. (This cannot happen for oneway requests because, if a connection fails, *all* requests are lost once the connection breaks down.)

- UDP packets may be duplicated by the transport.

  Because of the nature of UDP routing, it is possible for datagrams to arrive in duplicate at the server. This means that, for datagram invocations, Ice does *not* guarantee at-most once semantics: if UDP datagrams are duplicated, the same request may be dispatched more than once in the server.

- UDP packets are limited in size.

  The maximum size of an IP datagram is 65,535 bytes. Of that, the IP header consumes 20 bytes, and the UDP header consumes 8 bytes, leaving 65,507 bytes as the maximum payload. If the marshaled form of request, including the Ice header, exceeds that size, the request is lost. (Exceeding the size limit for a UDP datagram is indicated to the application by a `DatagramLimitException`.)

Because of their unreliable nature, datagram invocations are best suited to simple update messages that are otherwise stateless. In addition, due to the high probability of loss of datagram requests over wide area networks, you should restrict use of datagram requests to local area networks, where they are less likely to be lost. (Of course, regardless of the probability of loss, you must design your application such that it can tolerate lost or duplicated messages.)

# Using UDP Multicast

The UDP transport provided by Ice supports IP multicast. Assuming it's enabled on your host, using IP multicast in your application can be as simple as changing the host in the UDP endpoint to an IPv4 or IPv6 address in the multicast range:

```
# Object Adapter endpoint:
Discover.Endpoints=udp -h 239.255.1.1 -p 10000
 
# Corresponding proxy endpoint:
Discover.Proxy=discover:udp -h 239.255.1.1 -p 10000
```

You can optionally select the network interface to use for multicast endpoints by including the `interface` option.

In one respect, using multicast in Ice is no different than using regular datagram invocations; all of the design considerations mentioned above still apply. However, the fact that there could be any number of listeners (or none at all) adds new possibilities for your application design.

{% callout type="success" %}
Consider using the IceDiscovery plug-in if your objective in using multicast is the discovery of available servers.
{% /callout %}
