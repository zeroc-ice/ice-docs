---
title: Ice.WS.*
---

## Ice.WS.MaxBufferedAmount

### Synopsis {% id="ice.ws.maxbufferedamount-synopsis" %}

`Ice.WS.MaxBufferedAmount=num` (JavaScript only, in bytes)

### Description {% id="ice.ws.maxbufferedamount-description" %}

This property limits the number of bytes queued for transmission by a WebSocket connection. When `num` is greater than
zero, Ice sends data in chunks of at most `num` bytes and delays a chunk until sending it would keep the WebSocket's
`bufferedAmount` at or below `num`.

Setting `num` to `0` or less disables this limit. The default value is `524288` bytes (512 KiB).
