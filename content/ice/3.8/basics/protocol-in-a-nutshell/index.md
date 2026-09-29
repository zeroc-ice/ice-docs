---
title: The Ice Protocol in a Nutshell
---

Ice provides an [RPC protocol](../protocol), called the _Ice protocol_, that can use a variety of underlying transports.
The most common example is TCP, but Ice also supports [WebSocket](https://en.wikipedia.org/wiki/WebSocket),
[Bluetooth](../icebt), and Apple's [iAP](../iceiap). In addition, Ice allows you to use [SSL](../ssl-transport) as a
transport, so all communication between client and server is encrypted.

The Ice protocol defines:

- a number of message types, such as request and reply message types,
- a protocol state machine that determines in what sequence different message types are exchanged by client and server,
  together with the associated connection establishment and tear-down semantics for TCP/IP,
- a header for each message type that contains details such as the message type, the message size, and the protocol and
  encoding version in use.

Ice also supports compression on the wire: by setting a configuration parameter, you can arrange for all network traffic
to be compressed to conserve bandwidth. This is useful if your application exchanges large amounts of data between
client and server.

The Ice protocol is suitable for building highly-efficient event forwarding mechanisms because it permits forwarding of
a message without knowledge of the details of the information inside a message. This means that messaging switches need
not do any unmarshaling and remarshaling of messages — they can forward a message by simply treating it as an opaque
buffer of bytes.

The Ice protocol also supports [bidirectional operation](../bidirectional-connections): if a server wants to send a
message to an object provided by the client, the callback can be made over the connection that was originally created by
the client. This feature is especially important when the client is behind a firewall that permits outgoing connections,
but not incoming connections.

##### See Also

- [Ice Protocol and Encoding](../protocol)
- [IceSSL](../ssl-transport)
- [Bidirectional Connections](../bidirectional-connections)
