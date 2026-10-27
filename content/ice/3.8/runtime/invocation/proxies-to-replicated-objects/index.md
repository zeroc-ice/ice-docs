---
title: Proxies to Replicated Objects
---

A _replicated_ Ice object is hosted by several servers, the replicas, each with a servant for the object's identity. A
client reaches any of these replicas with a proxy written in one of three ways:

- The proxy lists the endpoints of all the replicas.
- The proxy has a single endpoint that points to a TCP load balancer in front of the replicas.
- The proxy has a single endpoint with a host name that resolves to the address of each replica.

With [IceGrid](../../../services/icegrid), the replicas are the object adapters of a
[replica group](../../../services/icegrid/object-adapter-replication), and the client uses an indirect proxy with the
replica group ID, such as `hello@HelloGroup`: the locator supplies the endpoints of the replicas.

## Listing the Endpoints of Every Replica

A proxy can hold one endpoint for each replica:

```text
hello:tcp -h 10.0.0.1 -p 4061:tcp -h 10.0.0.2 -p 4061
```

Ice picks one of these endpoints and connects to it, as described in
[Connection Establishment](../../connection-management/connection-establishment). By default, the proxy then uses this
connection, and therefore this replica, for all its invocations until the connection closes.
[Proxy-Based Load Balancing](../proxy-based-load-balancing) shows how to spread the invocations across the replicas.

Adding or removing a replica means updating every proxy that lists the endpoints.

## Using a TCP Load Balancer

An endpoint can point to a TCP load balancer that forwards each connection to one of the replicas:

```text
hello:tcp -h lb.example.com -p 4061
```

The load balancer chooses a replica for each connection. Ice keeps a connection open as long as it is in use, so all the
invocations sent over a connection reach the same replica. You add or remove a replica in the configuration of the load
balancer.

## Using a Host Name with an Address for Each Replica

An endpoint can name a host whose DNS record holds the address of each replica:

```text
hello:tcp -h hello.example.com -p 4061
```

When Ice establishes a connection, it connects to one of the addresses of this host name, as described in
[Connection Establishment](../../connection-management/connection-establishment).

With this configuration, all the replicas must use the same port. You add or remove a replica by updating the DNS
record. A replica that is down stays in the record until you remove it, and a connection attempt that reaches its
address fails or times out before Ice tries the next address.

## See Also

- [Proxy Endpoints](../proxy-endpoints)
- [Proxy-Based Load Balancing](../proxy-based-load-balancing)
- [Connection Establishment](../../connection-management/connection-establishment)
- [Object Adapter Replication](../../../services/icegrid/object-adapter-replication)
- [Registry Replication](../../../services/icegrid/registry-replication)
