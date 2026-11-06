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

These endpoints are typically the addresses of the [replicas](../proxies-to-replicated-objects) of the target object.
Ice selects which endpoint to connect to according to the proxy's
[endpoint selection](../../../property-reference/proxy-properties#name.endpointselection) type.

### Endpoints with Different Transports

Ice accepts a proxy whose endpoints use different transports, and uses only the endpoints that suit the proxy's
[invocation mode](../invocation-mode). Such proxies are discouraged: do not combine `udp` endpoints with endpoints of
other transports, or secure endpoints with non-secure ones such as `ssl` with `tcp`. The object adapter that hosts the
target object should listen on secure endpoints or on non-secure endpoints, not both; see
[Endpoint Security Considerations](../../ssl-transport#endpoint-security-considerations).

## Indirect Proxies

An indirect proxy is a proxy with an adapter ID or a well-known proxy. When an invocation on an indirect proxy needs a
connection, Ice asks the locator for the endpoints, and caches the reply as described in
[Locator Semantics for Clients](../../locators/locator-semantics-for-clients).

{% iflang langs="cpp,csharp,java,python,swift" %}

With [collocation optimization](../../collocated-invocation-and-dispatch), enabled by default, Ice first checks whether
the proxy refers to an object adapter of its communicator. If it does, Ice dispatches the invocation to this object
adapter without contacting the locator.

{% /iflang %}

### Proxy with an Adapter ID

A proxy with an adapter ID refers to an object hosted by the object adapter with this adapter ID, or by the object
adapters of the replica group with this ID:

```text
greeter @ GreeterAdapter
```

### Well-Known Proxy

A well-known proxy holds only an identity, without endpoints or an adapter ID:

```text
greeter
```

## See Also

- [Terminology](../../../basics/terminology)
- [Syntax for Stringified Proxies](../syntax-for-stringified-proxies)
- [Object Adapter Endpoints](../../dispatch/object-adapter-endpoints)
- [Locators](../../locators)
