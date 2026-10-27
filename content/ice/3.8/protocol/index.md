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

These pages use the following terms:

- The side that opened a connection and the side that accepted it.
- The client, which sends a request message, and the server, which dispatches the request and sends the reply message:
  the roles [Terminology](../basics/terminology#clients-and-servers) defines.
- The sender and the receiver of a message, for the rules that apply to every message, such as compression and the
  message size limit.

On an ordinary connection, the side that opened the connection is the client of every request. On a
[bidirectional connection](../runtime/connection-management/bidirectional-connections), the side that accepted the
connection also sends requests, and is the client of these requests.

Some of these messages carry a data payload encoded using the [Ice encoding](../encoding).

There is only one version of the Ice protocol, version 1.0.
