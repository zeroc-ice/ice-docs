---
title: Protocol Compression
---

Compression is an optional feature of the Ice protocol: a sender can compress the body of a request, batch request, or
reply message with the [bzip2](https://en.wikipedia.org/wiki/Bzip2) algorithm. Whether a sender compresses a given
message is up to the sender; see [Compression](../../runtime/compression) for how Ice decides.

## Compression Status

The `compressionStatus` field of the [message header](../protocol-messages#message-header) indicates whether a message
is compressed and, in a request, whether the client accepts a compressed reply.

| **Value** | **Applies to**                | **Description**                                                                                                                           |
| --------- | ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `0`       | All messages                  | The message is not compressed, and the sender does not request a compressed reply.                                                        |
| `1`       | Request, Batch Request, Reply | The message is not compressed. In a request, the client requests a compressed reply. A receiver handles a reply with this value like `0`. |
| `2`       | Request, Batch Request, Reply | The message is compressed. In a request, the client requests a compressed reply.                                                          |

Validate connection and close connection messages always carry `0`.

A server may compress a reply only when the corresponding request carried `1` or `2`: a request with `0` indicates that
the client may be unable to read a compressed reply.

## Compressed Message Layout

A compressed request, batch request, or reply message consists of:

- The 14-byte [message header](../protocol-messages#message-header), uncompressed. Its `messageSize` field holds the
  size of the compressed message, including the header.
- The size of the uncompressed message, including its header, as a four-byte integer.
- The message body, compressed with bzip2.

A receiver checks both the size of the compressed message and the size of the uncompressed message against its
[message size limit](../../property-reference/ice-properties#ice.messagesizemax) before it allocates a buffer for the
uncompressed message.

## See Also

- [Compression](../../runtime/compression)
- [Protocol Messages](../protocol-messages)
- [Data Encoding for Proxies](../../encoding/data-encoding-for-proxies)
