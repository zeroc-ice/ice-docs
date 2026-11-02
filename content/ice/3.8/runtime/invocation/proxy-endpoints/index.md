---
title: Proxy Endpoints
sidebarLabel: Endpoints
pages:
  - indirect-proxy-with-object-adapter-identifier
  - well-known-proxy
---

The endpoint or endpoints of a proxy correspond to the endpoint(s) of the object adapter(s) that host the target object.

A proxy can have one endpoint, two or more endpoints, or zero endpoints. We explore below the meaning of each of these
configurations.

## Proxy with a Single Endpoint

It is very common for a proxy to have a single endpoint. It’s the address of the server (object adapter) that hosts the
target object.

Here is a single endpoint proxy:

```text
greeter:tcp -h frosty.zeroc.com -p 4061
```

This endpoint states that an object is reachable via TCP on host `frosty.zeroc.com` and the port `4061`.

{% callout type="note" %}

The corresponding object adapter endpoint is typically different. For starters, you should not use DNS names in object
adapter endpoints, while it’s common to use them in proxy endpoints.

A typical object adapter endpoint would be:

```config
GreeterAdapter.Endpoints=tcp -p 4061 # listens on all interfaces
```

{% /callout %}

## Proxy with Two or More Endpoints

A proxy can specify two or more endpoints separated by colons (`:`). For example:

```text
greeter:tcp -h venus -p 4061:tcp -h mars -p 4061:tcp -h saturn -p 4061
```

This list of endpoints means the object is reachable via TCP on the specified hosts.

### Same Transport for All Endpoints

Most often, all the endpoints of a proxy use the same transport. These endpoints are several addresses of the object
adapter that hosts the target object, or the addresses of the [replicas](../proxies-to-replicated-objects) of this
object, and Ice selects which endpoint to connect to.

### Endpoints with Different Transports

A proxy can combine endpoints with different transports. Ice uses only the endpoints that suit the proxy's
[invocation mode](../invocation-mode#invocation-modes-and-endpoints), and selects among the remaining endpoints
regardless of their transport. For example:

- `tcp -h venus -p 4061:udp -h venus -p 4061`: a proxy with these endpoints supports both twoway invocations, over
  `tcp`, and datagram invocations, over `udp`.
- `tcp -h venus -p 4061:ssl -h venus -p 4062`: the client can connect with either `tcp` or `ssl`. An object adapter that
  accepts only secure connections publishes only its `ssl` endpoint.
- `ssl -h venus -p 10000:wss -h venus -p 10001`: you distribute the same proxy to web browser clients, which connect
  with `wss` since they can't connect with `ssl`, and to other clients. With the `Ordered`
  [endpoint selection](../../../property-reference/proxy-properties), these other clients try `ssl` first.

## Proxy with No Endpoint

A proxy with one or more endpoints is called a _direct proxy_, while a proxy with no endpoint is called an _indirect
proxy_.

Indirect because when a proxy has no endpoint, the communicator uses a [locator](../../locators) to retrieve the
endpoint(s) dynamically. One style of indirect proxy contains an
[adapter ID](./indirect-proxy-with-object-adapter-identifier):

```text
greeter @ GreeterAdapter
```

When this proxy requires the endpoints associated with `GreeterAdapter`, it requests them from the locator.

The other style of indirect proxy is a proxy with just an object identity, called a
[well-known proxy](./well-known-proxy):

```text
greeter
```

Just like with the `@` style, the communicator requests endpoint(s) for such a proxy from the locator.

{% iflang langs="cpp,csharp,java,python,swift" %}

{% callout type="note" title="Locator optional" %}

An indirect proxy can also refer to a collocated target object. In this case, you don’t need to configure a locator to
resolve the endpoints of this proxy - Ice doesn’t need any endpoint since it doesn’t establish a network connection to
this local object adapter.

{% /callout %}

{% /iflang %}

## See Also

- [Terminology](../../../basics/terminology)
- [Object Adapter Endpoints](../../dispatch/object-adapter-endpoints)
- [Locators](../../locators)
