---
id: using-ice-and-icerpc-together
title: Using Ice and IceRPC Together
---

[IceRPC](https://docs.icerpc.dev/) is our new cutting-edge RPC framework, with a modular design, support for QUIC, an
improved Slice language, and more.

{% callout type="info" %}

While Ice is available in many languages, IceRPC language support is much more limited.

{% /callout %}

As an Ice user, there are broadly 3 ways you can adopt IceRPC:

1. Port your existing Ice application to IceRPC, and then don’t look back. With this scenario, you can take full
   advantage of the new features provided by IceRPC. Your clients and servers can use the `quic` transport, or the `tcp`
   transport through the `slic` layer. You can also leverage new Slice features such as structs with optional fields,
   enums with fields, and custom types. Such a port requires a significant effort since the IceRPC API is very different
   from the Ice API: while the concepts remain similar, you’ll need to rework your entire communication layer.
2. Port only a portion of your existing Ice application to IceRPC: some components (clients, servers) use Ice while
   others use IceRPC.
3. Extend an existing Ice application with new components (clients, servers) implemented using IceRPC. The existing
   components remain Ice-based.

This page focuses on #2 and #3, where the Ice and IceRPC clients and servers communicate with each other using the Ice
protocol and rely on the original Slice language understood by Ice.

# Terminology

We tried to keep the IceRPC terminology in sync with the Ice terminology, but occasionally we found a better term or the
Ice and IceRPC concepts aren’t an exact match.

| **Ice**           | **IceRPC equivalent**                    |
| ----------------- | ---------------------------------------- |
| Communicator      | Connection cache (roughly)               |
| Proxy             | Proxy in the IceRPC+Ice integration      |
| Stringified proxy | Service address, service address URI     |
| Endpoint          | Server address, server address URI       |
| Connection        | Protocol connection (for advanced users) |
| Transport         | Transport                                |
| Object adapter    | Server and Router (roughly)              |
| Ice object        | Service                                  |
| Servant           | Service                                  |
| Dispatcher        | Dispatcher                               |
| Middleware        | Middleware                               |
| Locator           | (none)                                   |
| Router            | (none)                                   |
| Properties        | (none)                                   |

# Protocol and Transport

IceRPC implements two RPC protocols: `ice` and `icerpc`, while Ice implements a single RPC protocol, the
[Ice Protocol](../the-ice-protocol-in-a-nutshell). `ice` is identical to the Ice Protocol, so in your IceRPC components,
make sure to use the `ice` protocol.

Ice and IceRPC have two transports in common: `tcp` and `ssl`. You can’t use `udp` or `bt` (since they are not supported
by IceRPC), and you can’t use `quic` (since it’s not supported by Ice).

## Missing Protocol Features

IceRPC’s implementation of the Ice Protocol (`ice`) is fairly complete, except it does not include two features:

- batched requests
- protocol compression

An Ice client can’t send batched requests to an IceRPC server (they won’t be received and processed). Likewise, an Ice
client can’t send compressed requests to an IceRPC server.

# Using Ice files with IceRPC

Ice’s Slice compiler for C# (`slice2cs`) generates code for IceRPC when you specify the `--icerpc` option.

More commonly, you’ll take advantage of the `ZeroC.Ice.Slice.Tools` MSBuild integration and set `IceRpc` to `true` in
your project file:

```xml
<!-- Set the default Rpc framework for .ice file compilation to icerpc -->
<ItemDefinitionGroup>
    <SliceCompile>
      <IceRpc>true</IceRpc>
    </SliceCompile>
</ItemDefinitionGroup>
```

The IceRPC + Ice integration, including the C# mapping, is described in
[IceRPC for Ice users](https://docs.icerpc.dev/icerpc-for-ice-users).

# Services

## IceStorm

You can use IceRPC to implement an IceStorm publisher or an IceStorm subscriber. As far as the IceStorm server is
concerned, publishers and subscribers are just regular clients and servers.

## IceGrid

IceRPC provides client-side support for Locators and indirectly IceGrid: an IceRPC application can find objects in
IceGrid-managed servers and send requests to these objects.

However, you cannot implement or reimplement an IceGrid-managed server with IceRPC. IceGrid-managed servers rely heavily
on Ice configuration files and IceRPC doesn’t support Ice configuration or Ice properties.

## Glacier2

IceRPC does not currently provide support for Glacier2 clients. However, you can use IceRPC to implement a server called
by Glacier2.

## Discovery

The discovery plug-ins provided by Ice ([IceDiscovery](../icediscovery) and
[IceLocatorDiscovery](../icelocatordiscovery)) rely on UDP multicast and IceRPC doesn’t provide any support for UDP. As
a result, you can’t discover an IceRPC server using `IceDiscovery`, and an IceRPC client can’t discover an Ice server
that uses `IceDiscovery`.

##### See Also

- [IceRPC for Ice users](https://docs.icerpc.dev/icerpc-for-ice-users) in the IceRPC documentation
