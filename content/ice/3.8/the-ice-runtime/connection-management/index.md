---
title: Connection Management
---

An Ice communicator establishes connections automatically and transparently as a side effect of using proxies. There are
well-defined rules that determine when a [new connection is established](../connection-establishment) and when
[connections are closed](../connection-closure).

Connection management becomes increasingly important as network environments grow more complex. In particular, if you
need to make callbacks from a server to a client through a firewall, you must use a
[bidirectional connection](../bidirectional-connections). In most cases, you can use a [Glacier2 router](../glacier2) to
automatically take advantage of bidirectional connections. However, the Ice API also provides direct access to
connections, allowing you to explicitly control establishment and closure of both unidirectional and bidirectional
connections.

{% callout type="info" %}

The discussion that follows assumes that you are familiar with [proxies](../invocation) and
[endpoints](../proxy-endpoints).

{% /callout %}

### Topics

- [Connection Establishment](../connection-establishment)
- [Connection Closure](../connection-closure)
- [Bidirectional Connections](../bidirectional-connections)
