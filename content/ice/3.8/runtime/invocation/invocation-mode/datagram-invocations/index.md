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

A datagram invocation is a [oneway invocation](../oneway-invocations) over UDP: it sends its request without waiting for
a reply, and completes as soon as the client's local transport accepts the request.

UDP does not guarantee delivery: a datagram request can be lost, duplicated, or delivered out of order, so the server
can dispatch a request more than once, or not at all, and in any order. Design your application to tolerate lost,
duplicated, and reordered requests.

A datagram request, including its Ice message header, cannot exceed 65,507 bytes, the largest UDP payload, and must also
fit in the [UDP send buffer](../../../../property-reference/ice-udp-properties#ice.udp.sndsize) of the client and the
[UDP receive buffer](../../../../property-reference/ice-udp-properties#ice.udp.rcvsize) of the object adapter.

## UDP Multicast

A datagram invocation can reach any number of servers with IP multicast: set the host of the UDP endpoint to an IPv4 or
IPv6 multicast address. For example:

```config
# Object adapter endpoint:
Discover.Endpoints=udp -h 239.255.1.1 -p 10000

# Corresponding proxy endpoint:
Discover.Proxy=discover:udp -h 239.255.1.1 -p 10000
```

The `--interface` option of a UDP endpoint selects the network interface for multicast.

The [IceDiscovery](../../../../plugins/icediscovery) plug-in uses UDP multicast to locate object adapters and well-known
objects.
