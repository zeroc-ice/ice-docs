---
title: Datagram Invocations
sidebarLabel: Datagram
languages:
  - cpp
  - csharp
  - java
  - matlab
  - php
  - python
  - ruby
  - swift
---

## Design Considerations for Datagram Invocations

Datagram invocations are the equivalent of oneway invocations for datagram transports. As for oneway invocations,
datagram invocations can be sent only for operations that have a `void` return type and do not have out-parameters or an
exception specification. In addition, datagram invocations require a proxy with at least one `udp` endpoint.

The semantics of datagram invocations are similar to oneway invocations: no return traffic flows from the server to the
client, and a datagram invocation completes as soon as the client's transport has accepted the invocation into its
buffers. However, datagram invocations differ in one respect from oneway invocations in that datagram invocations
optionally support multicast semantics. Furthermore, datagram invocations have additional error semantics:

- Individual requests may be lost or received out of order.

  On the wire, datagram requests are sent as true datagrams, that is, individual datagrams may be lost, or arrive at the
  server out of order. As a result, not only may requests be dispatched out of order, an individual request out of a
  series of requests may be lost. In contrast, oneway requests sent over one connection arrive in order and without
  gaps.

- UDP packets may be duplicated by the transport.

  Because of the nature of UDP routing, it is possible for datagrams to arrive in duplicate at the server. This means
  that, for datagram invocations, Ice does _not_ guarantee at-most once semantics: if UDP datagrams are duplicated, the
  same request may be dispatched more than once in the server.

- UDP packets are limited in size.

  A datagram request, including its Ice message header, must fit in the smaller of 65,507 bytes and the
  [UDP send buffer size](../../../../property-reference/ice-udp-properties#ice.udp.sndsize) minus 28 bytes. An object
  adapter receives datagram requests up to the smaller of 65,507 bytes and the
  [UDP receive buffer size](../../../../property-reference/ice-udp-properties#ice.udp.rcvsize) minus 28 bytes.

Because of their unreliable nature, datagram invocations are best suited to simple update messages that are otherwise
stateless. Design your application to tolerate lost, duplicated, and reordered requests.

## Using UDP Multicast

The UDP transport provided by Ice supports IP multicast. Assuming it's enabled on your host, using IP multicast in your
application can be as simple as changing the host in the UDP endpoint to an IPv4 or IPv6 address in the multicast range:

```config
# Object Adapter endpoint:
Discover.Endpoints=udp -h 239.255.1.1 -p 10000

# Corresponding proxy endpoint:
Discover.Proxy=discover:udp -h 239.255.1.1 -p 10000
```

You can optionally select the network interface to use for multicast endpoints by including the `--interface` option.

In one respect, using multicast in Ice is no different than using regular datagram invocations; all of the design
considerations mentioned above still apply. However, the fact that there could be any number of listeners (or none at
all) adds new possibilities for your application design.

{% callout type="tip" %}

Consider using the IceDiscovery plug-in if your objective in using multicast is the discovery of available servers.

{% /callout %}
