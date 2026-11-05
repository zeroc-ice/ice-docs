---
title: Using Multiple Object Adapters
sidebarLabel: Multiple Object Adapters
languages:
  - cpp
  - csharp
  - java
  - python
  - swift
---

Most servers need a single object adapter. Use several object adapters when you need:

- different endpoints for different sets of Ice objects, for example a secure endpoint for administrative objects and a
  non-secure endpoint for the other objects;
- an object adapter that accepts connections from clients, and another object adapter that dispatches the requests
  received over outgoing connections (see
  [Bidirectional Connections](../../connection-management/bidirectional-connections));
- separate [thread pools](../../threading-model/object-adapter-thread-pools) for different sets of Ice objects.

## See Also

- [Object Adapter Thread Pools](../../threading-model/object-adapter-thread-pools)
