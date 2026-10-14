---
title: Compression
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

Ice can compress the requests and replies it sends with the bzip2 algorithm, to reduce the bandwidth an application
uses. [Protocol Compression](../../protocol/protocol-compression) describes the compressed messages on the wire; this
page describes when Ice compresses a message and how you enable it.

## When to Use Compression

Compression is likely to improve performance only over lower-speed links, for which bandwidth is the limiting factor.
Over high-speed LAN links, the CPU time spent compressing and uncompressing messages can be longer than the time it
takes to send the uncompressed data.

[Batched invocations](../invocation/invocation-mode/batched-invocations) are likely to compress better than isolated
requests: small messages are unlikely to compress well, whereas a batch gives bzip2 more data to work with.

## Enabling Compression

A client compresses a request, and asks for a compressed reply, when the endpoint it uses for the invocation has the
compression flag set. You set this flag in two ways:

- In a stringified endpoint, the `-z` option sets this flag (see [Endpoint Syntax](../endpoint-syntax)).
- `ice_compress` returns a proxy with this flag set or cleared on all its endpoints. For a fixed proxy, which has no
  endpoints, `ice_compress` sets the compression setting of the proxy itself.

The proxies an object adapter creates carry the compression flag of its
[published endpoints](../dispatch/object-adapter-endpoints). For example, the following configuration gives every proxy
created by this object adapter endpoints with compression enabled:

```config
MyAdapter.Endpoints=tcp -h 192.168.1.17 -p 4061 -z
```

[Ice.Override.Compress](../../property-reference/ice-override-properties#ice.override.compress) overrides this flag for
every invocation a communicator makes: with `1`, the communicator compresses every request and asks for compressed
replies; with `0`, it compresses none.

When you flush the batch requests of a connection or communicator, the `CompressBatch` argument of `flushBatchRequests`
selects whether Ice compresses the batch: `Yes`, `No`, or `BasedOnProxy`, which compresses the batch if at least one of
its requests was made on a proxy with compression enabled.

## How Ice Compresses Messages

When compression is enabled for an invocation, Ice compresses the request message when it is at least 100 bytes long,
header included. It sends a shorter request uncompressed, still asking for a compressed reply.

A server compresses a reply when the request asked for a compressed reply and the reply message is at least 100 bytes
long, header included.

## Compression Support by Language Mapping

Each language mapping obtains its bzip2 implementation differently:

- **C++**, and the language mappings built on Ice for C++ (MATLAB, PHP, Python, Ruby, and Swift), link with the bzip2
  library. Compression is always available.
- **C#** loads the native bzip2 library dynamically at run time. The ZeroC.Ice NuGet package does not bundle this
  library; see the [ZeroC.Ice README](https://www.nuget.org/packages/ZeroC.Ice) for the bzip2 library name on each
  platform and where to get it.
- **Java** uses the bzip2 classes of Apache Commons Compress, loaded reflectively at run time. Add
  `org.apache.commons:commons-compress` to your application's class path to enable compression; see the
  [Ice for Java README](https://github.com/zeroc-ice/ice/blob/3.8/java/README.md) for more information.
- **JavaScript** does not support compression.

A runtime without compression support sends all messages uncompressed and never requests a compressed reply, so its
peers never send it a compressed reply. If it receives a compressed message over a connection, it aborts this
connection; if it receives a compressed datagram, it discards this datagram. In both cases, it logs a warning when
[Ice.Warn.Connections](../../property-reference/ice-warn-properties#ice.warn.connections) is enabled.

{% iflang langs="csharp,java" %}

When bzip2 is not available, setting `Ice.Override.Compress` to `1` has no effect.

{% /iflang %}

## See Also

- [Protocol Compression](../../protocol/protocol-compression)
- [Batched Invocations](../invocation/invocation-mode/batched-invocations)
- [Ice.Override.\*](../../property-reference/ice-override-properties)
