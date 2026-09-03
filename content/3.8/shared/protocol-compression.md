---
id: protocol-compression
title: Protocol Compression
---

# Overview of Protocol Compression

Compression is an optional feature of the Ice protocol; whether it is used for a particular message is determined by several factors:

1. Compression may not be supported on all platforms or in all language mappings.
2. Compression can be used in a request or batch request only if the peer [advertises](../data-encoding-for-proxies) the ability to accept compressed messages.
3. For efficiency reasons, the Ice protocol engine does not compress messages smaller than 100 bytes.

{% callout type="success" %}
Compression is likely to improve performance only over lower-speed links, for which bandwidth is the overall limiting factor. Over high-speed LAN links, the CPU time spent on compressing and uncompressing messages is longer than the time it takes to just send the uncompressed data.
{% /callout %}

# Encoding for Compressed Messages

If compression is used, the entire protocol message excluding the [header](../protocol-messages) is compressed using the [bzip2](https://en.wikipedia.org/wiki/Bzip2) algorithm. The `messageSize` field of the message header therefore reflects the size of the compressed message, including the uncompressed header, plus an additional four bytes.

The `compressionStatus` field of the message header indicates whether a message is compressed and provides additional information, as shown in the table below.

| **Compression status** | **Value** | **Applies to** | **Description** |
| --- | --- | --- | --- |
| Message is uncompressed. Client requests uncompressed reply. | `0` | Request, Batch Request, Reply, Validate Connection, Close Connection | A client that does not support compression always uses this value.A client that supports compression uses this value when the compression flag is not set on the endpoint used for the request invocation.A server uses this value for uncompressed replies. |
| Message is uncompressed. Client requests compressed reply. | `1` | Request, Batch Request | A client that supports compression uses this value when the compression flag is set on the endpoint used for the request invocation, but the client has decided not to use compression for this particular request (presumably because the request is too small, so compression does not provide any saving).A server never uses this value. |
| Message is compressed. Client requests compressed reply. | `2` | Request, Batch Request, Reply | A client that supports compression uses this value when the compression flag is set on the endpoint used for the request invocation, and the client compressed the request message.A server uses this value for compressed replies. |

The message body of a compressed request, batch request, or reply message is encoded by first writing the size of the uncompressed message (including its header) as a four-byte integer, followed by the compressed message body (excluding the header). It follows that the size of a compressed message is 14 bytes for the header, plus four bytes to record the size of the uncompressed message, plus the number of bytes occupied by the compressed message body. Writing the uncompressed message size prior to the body enables the receiver to allocate a buffer that is large enough to accommodate the uncompressed message body.

# Compression Semantics for Clients

A client sends a compressed message if all the following conditions are true:

- The client-side run time supports compression
- The size of the uncompressed message is at least 100 bytes
- The proxy endpoint on which the message will be sent has the compression flag (`-z` for [stringified endpoints](../endpoint-syntax))

Otherwise, the client sends an uncompressed message.

The client uses the message header's `compressionStatus` field as described in the table above.

# Compression Semantics for Servers

A server only receives a compressed message when the client's proxy endpoint has the compression flag (`-z` for [stringified endpoints](../endpoint-syntax)) and additional conditions are met (see above).

Such a proxy can be constructed in a client from a string or configuration property. It can also be created by an object adapter and then sent to a client. In this case, the compression flag needs to be set on the [object adapter endpoints](../object-adapter-endpoints) as shown in the example below:

```
MyAdapter.Endpoints=tcp -h 192.168.1.17 -p 2500 -z
```

Specifying the flag here causes every proxy created by the object adapter to advertise compression-capable endpoints.

A server examines the `compressionStatus` field of an incoming message header not only to determine whether the message itself is compressed but also to figure out whether the client requested a compressed reply. A server sends a compressed reply if all the following conditions are true:

- The server-side run time supports compression
- The size of the uncompressed reply is at least 100 bytes
- The `compressionStatus` field of the corresponding request message has a value of 1 or 2

Otherwise, the server sends an uncompressed reply.

##### See Also

- [Data Encoding for Proxies](../data-encoding-for-proxies)
- [Protocol Messages](../protocol-messages)
