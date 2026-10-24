---
title: Proxies to Replicated Objects
---

A replicated Ice object is available from several servers, each hosting a servant for the same identity. A client
reaches any of these replicas through a single proxy in one of three ways:

- The proxy lists the endpoints of every replica.
- An endpoint names a host whose DNS record holds the address of each replica.
- An endpoint holds the address and port of a TCP load balancer in front of the replicas.

With [IceGrid](../../../services/icegrid), an indirect proxy reaches the replicas of an
[object adapter replica group](../../../services/icegrid/object-adapter-replication): the locator supplies their
endpoints.

## Listing the Endpoints of Every Replica

A proxy can hold one endpoint for each replica:

```text
hello:tcp -h 10.0.0.1 -p 4061:tcp -h 10.0.0.2 -p 4061
```

When the proxy needs a connection, Ice orders its endpoints with the
[endpoint selection policy](../../connection-management/connection-establishment#endpoint-selection), `Random` by
default, and connects to the first endpoint it can reach. By default, the proxy caches its connection and sends all its
invocations to this replica until the connection closes; [Proxy-Based Load Balancing](../proxy-based-load-balancing)
shows how to spread the invocations across the replicas.

Adding or removing a replica means updating every proxy that lists the endpoints.

## Using a Host Name with an Address for Each Replica

An endpoint can name a host whose DNS record holds the address of each replica:

```text
hello:tcp -h hello.example.com -p 4061
```

{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}

Ice resolves the host name when it establishes a connection, and tries the addresses in the order the DNS resolver
returns them, IPv4 addresses first unless
[Ice.PreferIPv6Address](../../../property-reference/ice-properties#ice.preferipv6address) is set. How the clients spread
across the replicas therefore depends on the order in which the DNS server returns the addresses.

{% /iflang %}

{% iflang langs="js" %}

The JavaScript runtime resolves the host name when Ice connects, and chooses the address.

{% /iflang %}

All the replicas listen on the port of the endpoint. You add or remove a replica by updating the DNS record.

## Using a TCP Load Balancer

An endpoint can hold the address and port of a TCP load balancer that forwards each connection to one of the replicas:

```text
hello:tcp -h lb.example.com -p 4061
```

The load balancer chooses a replica for each connection. Ice keeps a connection open as long as it is in use, so all the
invocations sent over a connection reach the same replica. You add or remove a replica in the configuration of the load
balancer.

## Availability

With a host name or a load balancer, the DNS server or the load balancer becomes part of the availability of the
replicated object: while it is down, clients cannot establish new connections to the replicas. Replicate it as well.

## See Also

- [Proxy Endpoints](../proxy-endpoints)
- [Proxy-Based Load Balancing](../proxy-based-load-balancing)
- [Connection Establishment](../../connection-management/connection-establishment)
- [Object Adapter Replication](../../../services/icegrid/object-adapter-replication)
- [Registry Replication](../../../services/icegrid/registry-replication)
