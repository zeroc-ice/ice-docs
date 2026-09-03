---
id: ice-ws-properties
title: Ice.WS.*
---

# Ice.WS.MaxBufferedAmount

#### Synopsis

`Ice.WS.MaxBufferedAmount=num`

#### Description

This property controls the maximum number of bytes that can be queued by a WebSocket connection. Once the WebSocket `bufferedAmount` reaches this limit, sending additional data is delayed until it drops below the threshold.
