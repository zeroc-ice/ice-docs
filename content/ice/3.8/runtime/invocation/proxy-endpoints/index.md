---
title: Proxy Endpoints
pages:
  - indirect-proxy-with-object-adapter-identifier
  - well-known-proxy
---

The endpoint or endpoints of a proxy correspond to the endpoint(s) of the object adapter(s) that hosts the target
object.

{% callout type="tip" %}

Endpoint is an overloaded term - many things are “endpoints”. Think of an Ice endpoint as a “server address”. Not so
coincidentally, that’s the term we’ve adopted for IceRPC.

{% /callout %}

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

{% callout type="info" %}

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

The most common situation is when all the endpoints of the proxy use the same transport. It means the target object is
replicated and the client selects which replica to connect to. The replicas are largely equivalent, in particular, they
listen with the same transport.

### Endpoints with Different Transports

Ice accepts proxies that combine endpoints with different transports - it’s syntactically ok. But it’s rarely
meaningful. If you’re using such proxies, have a second look, and make sure you understand why you’re combining these
diverse endpoints.

Let’s take a few examples:

| **Proxy Endpoint List**                       | **Analysis**                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `udp -h venus -p 4061:tcp -h mars -p 4061`    | **Not recommended** Never combine a `udp`endpoint with any other transport in the same proxy.                                                                                                                                                                                                                                                                                                        |
| `tcp -h venus -p 4061:ssl -h venus -p 4062`   | **Not recommended** Never combine secure and non-secure endpoints in the same proxy. The server should decide whether it accepts only secure or only non-secure connections.                                                                                                                                                                                                                         |
| `ssl -h venus -p 10000:wss -h venus -p 10001` | **Unusual. Could be ok.**Possible use-case: you distribute the same proxies to various clients and you want web browser clients to use the `wss` endpoint (since they can’t connect with `ssl`); and you want other `ssl`-capable clients to use `ssl`. You would use this proxy endpoint list in conjunction with the `Ordered` [endpoint selection](../../../property-reference/proxy-properties). |

## Proxy with No Endpoint

A proxy with one or more endpoints is called a _direct proxy_, while a proxy with no endpoint is called an _indirect
proxy_.

Indirect because when a proxy has no endpoint, the communicator uses a [locator](../../locators) to retrieve the
endpoint(s) dynamically. One style of indirect proxy contains an
[adapter identifier](./indirect-proxy-with-object-adapter-identifier):

```text
MyObject @ MyAdapter
```

When this proxy requires the endpoints associated with `MyAdapter`, it requests them from the locator.

The other style of indirect proxy is a proxy with just an object identity, called a
[well-known proxy](./well-known-proxy):

```text
MyObject
```

Just like with the `@` style, the communicator requests endpoint(s) for such a proxy from the locator.

{% iflang langs="cpp,csharp,java,python,swift" %}

{% callout type="info" title="Locator optional" %}

An indirect proxy can also refer to a collocated target object. In this case, you don’t need to configure a locator to
resolve the endpoints of this proxy - Ice doesn’t need any endpoint since it doesn’t establish a network connection to
this local object adapter.

{% /callout %}

{% /iflang %}

## See Also

- [Terminology](../../../basics/terminology)
- [Object Adapter Endpoints](../../dispatch/object-adapter-endpoints)
- [Locators](../../locators)
