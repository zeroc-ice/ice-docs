---
title: Proxy Endpoints
sidebarLabel: Endpoints
---

A direct proxy holds one or more endpoints, which tell Ice how to reach the target object. An indirect proxy holds no
endpoint: Ice obtains the endpoints from a [locator](../../locators).

## Direct Proxies

The endpoints of a direct proxy are usually the
[published endpoints](../../dispatch/object-adapter-endpoints#published-object-adapter-endpoints) of the object adapter
that hosts the target object. For example, the target object of this proxy is reachable over TCP on host
`frosty.zeroc.com` and port `4061`:

```text
greeter:tcp -h frosty.zeroc.com -p 4061
```

A proxy can hold several endpoints, separated by colons (`:`):

```text
greeter:tcp -h venus -p 4061:tcp -h mars -p 4061:tcp -h saturn -p 4061
```

These endpoints are several addresses of the object adapter that hosts the target object, or the addresses of the
[replicas](../proxies-to-replicated-objects) of this object. Ice selects which endpoint to connect to according to the
proxy's [endpoint selection](../../../property-reference/proxy-properties#name.endpointselection) type.

### Endpoints with Different Transports

A proxy can combine endpoints with different transports. Ice uses only the endpoints that suit the proxy's
[invocation mode](../invocation-mode#invocation-modes-and-endpoints), and selects among the remaining endpoints
regardless of their transport. For example:

- `tcp -h venus -p 4061:udp -h venus -p 4061`: a proxy with these endpoints supports both twoway invocations, over
  `tcp`, and datagram invocations, over `udp`.
- `ssl -h venus -p 10000:wss -h venus -p 10001`: you distribute the same proxy to web browser clients, which connect
  with `wss` since they can't connect with `ssl`, and to other clients. With the `Ordered` endpoint selection type,
  these other clients try `ssl` first.

A proxy should not combine secure and non-secure endpoints, such as `tcp` and `ssl`: the object adapter that hosts the
target object should listen on secure endpoints or on non-secure endpoints, not both. See
[Endpoint Security Considerations](../../ssl-transport#endpoint-security-considerations).

## Indirect Proxies

An indirect proxy is a proxy with an adapter ID or a well-known proxy. When an invocation on an indirect proxy needs a
connection, Ice asks the locator for the endpoints, and caches the reply as described in
[Locator Semantics for Clients](../../locators/locator-semantics-for-clients).

{% iflang langs="cpp,csharp,java,python,swift" %}

With [collocation optimization](../../collocated-invocation-and-dispatch), enabled by default, Ice first checks whether
an object adapter of the proxy's communicator hosts the target object. If one does, Ice dispatches the invocation to
this object adapter, without a locator.

{% /iflang %}

### Proxy with an Adapter ID

A proxy with an adapter ID refers to an object hosted by the object adapter with this adapter ID, or by the object
adapters of the replica group with this ID:

```text
greeter @ GreeterAdapter
```

Ice asks the locator for the endpoints of `GreeterAdapter`.

### Well-Known Proxy

A well-known proxy holds only an identity, without endpoints or an adapter ID:

```text
greeter
```

Ice asks the locator for the object with this identity, such as an
[IceGrid well-known object](../../../services/icegrid/well-known-objects).

## See Also

- [Terminology](../../../basics/terminology)
- [Syntax for Stringified Proxies](../syntax-for-stringified-proxies)
- [Object Adapter Endpoints](../../dispatch/object-adapter-endpoints)
- [Locators](../../locators)
