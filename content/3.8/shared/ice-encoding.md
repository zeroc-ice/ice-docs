---
id: ice-encoding
title: Ice Encoding
---

The Ice encoding describes the binary representation of Slice data types.

The key goals of the Ice encoding are simplicity and efficiency. In keeping with these principles, the encoding does not
align primitive types on word boundaries and therefore eliminates the wasted space and additional complexity that
alignment requires. The Ice encoding simply produces a stream of contiguous bytes; data contains no padding bytes and
need not be aligned on word boundaries.

Data is always encoded using little-endian byte order for numeric types. (Most machines use a little-endian byte order,
so the Slice data encoding is "right" more often than not.) Ice does not use a "receiver makes it right" scheme because
of the additional complexity this would introduce.

Ice requires clients and servers that run on big-endian machines to incur the extra cost of byte swapping data into
little-endian layout, but that cost is insignificant compared to the overall cost of sending or receiving a request.

There are currently two versions of the Ice encoding (1.0 and 1.1). Modern Ice applications should only use the 1.1
encoding.
