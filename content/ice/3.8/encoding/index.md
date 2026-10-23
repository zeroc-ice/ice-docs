---
title: Ice Encoding
pages:
  - basic-data-encoding
  - data-encoding-for-slices
  - data-encoding-for-exceptions
  - data-encoding-for-classes
  - data-encoding-for-proxies
  - data-encoding-for-optional-values
  - data-encoding-for-request-and-reply-payloads
---

The Ice encoding describes the binary representation of Slice data types.

The Ice encoding produces a contiguous stream of bytes, without alignment on word boundaries or padding. Numeric types
are always encoded in little-endian byte order.

There are currently two versions of the Ice encoding (1.0 and 1.1). Modern Ice applications should only use the 1.1
encoding.
