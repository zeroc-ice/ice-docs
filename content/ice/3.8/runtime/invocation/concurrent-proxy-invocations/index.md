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

[Proxies](..) are thread-safe: several threads can invoke operations on the same proxy concurrently, without additional
synchronization.

When a proxy [caches its connection](../../connection-management/connection-establishment#connection-reuse-and-caching),
the default, Ice sends the invocations made one after the other on this proxy in the order they were made. Invocations
made concurrently from several threads have no defined order. When the proxy does not cache its connection, its
invocations can use different connections, and have no defined order.

The order in which Ice sends requests does not determine the order in which the server dispatches them: the server can
dispatch requests concurrently.

## See Also

- [Proxies](..)
- [Connection Establishment](../../connection-management/connection-establishment)
- [Thread Pool Design Considerations](../../threading-model/thread-pool-design-considerations)
