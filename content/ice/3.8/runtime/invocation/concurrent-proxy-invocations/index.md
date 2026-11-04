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

A proxy [caches its connection](../../connection-management/connection-establishment#connection-reuse-and-caching) by
default. When a thread makes invocations on this proxy one after the other, Ice sends their requests on the cached
connection in the same order. Invocations made concurrently from several threads have no defined order, and neither do
the invocations on a proxy that does not cache its connection.

The order in which Ice sends requests does not determine the order in which the server dispatches them: the server can
dispatch requests concurrently.

## See Also

- [Proxies](..)
- [Connection Establishment](../../connection-management/connection-establishment)
- [Thread Pool Design Considerations](../../threading-model/thread-pool-design-considerations)
