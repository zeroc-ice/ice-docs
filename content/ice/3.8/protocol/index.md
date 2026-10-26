---
title: Ice Protocol
pages:
  - protocol-messages
  - protocol-compression
---

The Ice protocol is an
[application-layer protocol](https://en.wikipedia.org/wiki/Internet_protocol_suite#Application_layer) that defines a
number of message types exchanged between two peers, together with rules as to what message is to be sent under what
circumstances.

The protocol pages name each role after the layer it belongs to:

- A connection has two sides: the side that opened the connection and the side that accepted it.
- A request has a client and a server, as defined in [Terminology](../basics/terminology#clients-and-servers): the
  client sends the request and the server sends the reply.
- A message has a sender and a receiver. Rules that apply to every message, such as compression and the message size
  limit, use these terms.

On an ordinary connection, the side that opened the connection is the client of every request. On a
[bidirectional connection](../runtime/connection-management/bidirectional-connections), the side that accepted the
connection also sends requests, and is the client of these requests.

Some of these messages carry a data payload encoded using the [Ice encoding](../encoding).

There is only one version of the Ice protocol, version 1.0.
