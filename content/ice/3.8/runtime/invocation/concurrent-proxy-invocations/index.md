---
title: Concurrent Proxy Invocations
sidebarLabel: Concurrent Invocations
languages:
  - cpp
  - csharp
  - java
  - matlab
  - php
  - python
  - ruby
  - swift
---

[Proxy objects](..) are fully thread safe, meaning a client can invoke on the same proxy object from multiple threads
concurrently without the need for additional synchronization. However, Ice makes few guarantees about the order in which
it sends proxy invocations over a connection.

To understand the ordering issue, it's important to first understand some fundamental proxy concepts:

- At any point in time, a proxy may or may not be
  [associated with a connection](../../connection-management/connection-establishment).
- A new proxy initially has no connection, and Ice does not attempt to associate it with a connection until its first
  invocation.
- If Ice needs to establish a new connection for a proxy, Ice queues all invocations on that proxy until the connection
  succeeds.
- After a proxy is associated with a connection, the proxy may or may not
  [cache that connection](../../connection-management/connection-establishment) for subsequent invocations.
- Proxies share connections by default, but an application can force proxies to use separate connections.

When a proxy object caches its connection, Ice sends the invocations made one after the other on this proxy object in
the order they were made. Invocations made concurrently from several threads have no defined order.

{% callout type="warning" %}

The order in which the Ice runtime in a client sends invocations over a connection does not necessarily determine the
order in which they will be executed in the server.

{% /callout %}

## See Also

- [Proxies](..)
- [Connection Establishment](../../connection-management/connection-establishment)
- [Thread Pool Design Considerations](../../threading-model/thread-pool-design-considerations)
