---
title: Protocol Compression
---

Compression is an optional feature of the Ice protocol: a sender can compress a request, batch request, or reply message
with the [bzip2](https://en.wikipedia.org/wiki/Bzip2) algorithm; only the 14-byte message header stays uncompressed.
Whether a sender compresses a given message is up to the sender; see [Compression](../../runtime/compression) for how
Ice decides.

## Compression Status

The `compressionStatus` byte of the [message header](../protocol-messages#message-header) answers two questions: whether
the message is compressed and, in a request, whether the client accepts a compressed reply.

| **Value** | **Message**    | **Client accepts a compressed reply** |
| --------- | -------------- | ------------------------------------- |
| `0`       | Not compressed | No                                    |
| `1`       | Not compressed | Yes                                   |
| `2`       | Compressed     | Yes                                   |

The third column applies to requests; in any other message, the value only says whether the message is compressed.
Validate connection and close connection messages always carry `0`.

A server may compress a reply only when the request carried `1` or `2`: a request with `0` indicates that the client may
be unable to read a compressed reply.

## Compressed Message Layout

A compressed request, batch request, or reply message consists of:

- The 14-byte [message header](../protocol-messages#message-header), uncompressed. Its `compressionStatus` field is `2`,
  and its `messageSize` field holds the size of the compressed message, including the header.
- The size of the uncompressed message, including its header, as a four-byte integer.
- Everything that follows the header in the uncompressed message, compressed with bzip2.

A receiver checks both the size of the compressed message and the size of the uncompressed message against its
[message size limit](../../property-reference/ice-properties#ice.messagesizemax) before it allocates a buffer for the
uncompressed message.

## See Also

- [Compression](../../runtime/compression)
- [Protocol Messages](../protocol-messages)
- [Data Encoding for Proxies](../../encoding/data-encoding-for-proxies)
