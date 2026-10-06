---
title: Protocol Compression
---

## Overview of Protocol Compression

Compression is an optional feature of the Ice protocol; whether it is used for a particular message is determined by
several factors:

1. Compression is not supported by all language mappings (see [below](#compression-support-by-language-mapping)).
2. A client compresses a request or batch request only when compression is enabled for the invocation. The proxy's
   compression setting enables it: the compression flag of the endpoint used for the invocation (`-z` for
   [stringified endpoints](../../runtime/endpoint-syntax)), which `ice_compress` sets on all the proxy's endpoints, or
   the `ice_compress` setting of a fixed proxy.
   [Ice.Override.Compress](../../property-reference/ice-override-properties#ice.override.compress) replaces this setting
   for all proxies (Ice for JavaScript does not support this property). When the application flushes the batch requests
   of a connection, its `CompressBatch` argument can also enable or disable compression for this batch.
3. For efficiency reasons, the Ice protocol engine does not compress messages smaller than 100 bytes.
4. Ice for C# and Ice for Java check the result of the compression, and send the message uncompressed when compression
   does not save enough space.

{% callout type="tip" %}

Compression is likely to improve performance only over lower-speed links, for which bandwidth is the overall limiting
factor. Over high-speed LAN links, the CPU time spent on compressing and uncompressing messages can be longer than the
time it takes to just send the uncompressed data. Measure with representative messages before enabling compression.

{% /callout %}

## Encoding for Compressed Messages

If compression is used, the entire protocol message excluding the [header](../protocol-messages#message-header) is
compressed using the [bzip2](https://en.wikipedia.org/wiki/Bzip2) algorithm.

The `compressionStatus` field of the message header indicates whether a message is compressed and provides additional
information, as shown in the table below.

| **Value** | **Applies to**                | **Description**                                                                                                                           |
| --------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `0`       | All messages                  | The message is not compressed, and the sender does not request a compressed reply.                                                        |
| `1`       | Request, Batch Request, Reply | The message is not compressed. In a request, the client requests a compressed reply. A receiver handles a reply with this value like `0`. |
| `2`       | Request, Batch Request, Reply | The message is compressed. In a request, the client requests a compressed reply.                                                          |

A compressed request, batch request, or reply message consists of:

- The 14-byte [message header](../protocol-messages#message-header), uncompressed. Its `messageSize` field holds the
  size of the compressed message, including the header.
- The size of the uncompressed message, including its header, as a four-byte integer. The receiver uses it to allocate a
  buffer for the uncompressed message.
- The message body, compressed with bzip2.

A receiver that supports compression checks both the size of the compressed message and the size of the uncompressed
message against its [message size limit](../../property-reference/ice-properties#ice.messagesizemax).

## Compression Semantics for Clients

A client attempts to compress a message if all the following conditions are true:

- The client-side runtime supports compression
- The size of the uncompressed message is at least 100 bytes
- Compression is enabled for the invocation (see [above](#overview-of-protocol-compression))

Otherwise, the client sends an uncompressed message.

A client that compresses a message sets its compression status to 2. When compression is enabled for the invocation but
the client does not compress the message, it sets 1; otherwise it sets 0. A client without compression support always
sets 0.

## Compression Semantics for Servers

A server only receives a compressed message when compression is enabled for the client's invocation and additional
conditions are met (see above).

A proxy whose endpoints have the compression flag can be constructed in a client from a string or configuration
property. It can also be created by an object adapter and then sent to a client. In this case, the compression flag
needs to be set on the endpoints that the object adapter publishes in its direct proxies. For an object adapter without
a router or [published endpoints](../../property-reference/object-adapter-properties#adapter.publishedendpoints), these
are the [object adapter endpoints](../../runtime/dispatch/object-adapter-endpoints), as shown in the example below:

```config
MyAdapter.Endpoints=tcp -h 192.168.1.17 -p 2500 -z
```

Specifying the flag here causes every direct proxy created by the object adapter to advertise compression-capable
endpoints. When [Ice.Override.Compress](../../property-reference/ice-override-properties#ice.override.compress) is set,
the override replaces the compression flag of the object adapter endpoints.

A server examines the `compressionStatus` field of an incoming message header not only to determine whether the message
itself is compressed but also to figure out whether the client requested a compressed reply. A server attempts to
compress a reply if all the following conditions are true:

- The server-side runtime supports compression
- The size of the uncompressed reply is at least 100 bytes
- The `compressionStatus` field of the corresponding request message has a value of 1 or 2
- With Ice for C++, a synchronous dispatch did not throw an exception; with Ice for Java, the dispatch did not throw or
  complete with an exception

Otherwise, the server sends an uncompressed reply. A server sets the compression status of a compressed reply to 2, and
of an uncompressed reply to 0 or 1.

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

A runtime without compression support sends all messages uncompressed. If it receives a compressed message over a
connection-oriented transport, it aborts the connection; if it receives a compressed datagram, it discards this
datagram. In both cases, it logs a warning when
[Ice.Warn.Connections](../../property-reference/ice-warn-properties#ice.warn.connections) is enabled.

## See Also

- [Data Encoding for Proxies](../../encoding/data-encoding-for-proxies)
- [Protocol Messages](../protocol-messages)
