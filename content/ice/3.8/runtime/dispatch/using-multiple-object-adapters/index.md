---
title: Using Multiple Object Adapters
---

A typical server rarely needs to use more than one object adapter. If you are considering using multiple object
adapters, we suggest that you check whether any of the considerations in the list below apply to your situation:

- You need fine-grained control over which objects are accessible. For example, you could have an object adapter with a
  secure endpoint to restrict access to some administrative objects, and another object adapter with a non-secure
  endpoint for other objects.
- You need a regular object adapter that accepts incoming connections from clients, and you need a separate object
  adapter to dispatch requests received over outgoing connections (see
  [Bidirectional Connections](../../connection-management/bidirectional-connections)).
- You need control over the number of threads in the pools for different sets of objects in your application.

If none of the preceding items apply, chances are that you do not need more than one object adapter.

## See Also

- [Object Adapter Thread Pools](../../threading-model/object-adapter-thread-pools)
