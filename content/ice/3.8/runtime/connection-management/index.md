---
title: Connection Management
pages:
  - connection-establishment
  - connection-closure
  - bidirectional-connections
---

An Ice communicator establishes connections automatically and transparently as a side effect of using proxies. There are
well-defined rules that determine when a
[new connection is established](runtime/connection-management/connection-establishment) and when
[connections are closed](runtime/connection-management/connection-closure).

Connection management becomes increasingly important as network environments grow more complex. In particular, if you
need to make callbacks from a server to a client through a firewall, you must use a
[bidirectional connection](runtime/connection-management/bidirectional-connections). In most cases, you can use a
[Glacier2 router](services/glacier2) to automatically take advantage of bidirectional connections. However, the Ice API
also provides direct access to connections, allowing you to explicitly control establishment and closure of both
unidirectional and bidirectional connections.

{% callout type="info" %}

The discussion that follows assumes that you are familiar with [proxies](runtime/invocation) and
[endpoints](runtime/invocation/proxy-endpoints).

{% /callout %}

## Topics

- [Connection Establishment](runtime/connection-management/connection-establishment)
- [Connection Closure](runtime/connection-management/connection-closure)
- [Bidirectional Connections](runtime/connection-management/bidirectional-connections)
