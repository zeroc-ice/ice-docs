---
title: Object Adapter Thread Pools
languages:
  - cpp
  - csharp
  - java
  - python
  - swift
---

An [object adapter](../../dispatch) uses a [thread pool](../thread-pools) to accept connections and to read and dispatch
the requests that arrive on them. By default, it uses the server thread pool of its communicator, which is sufficient
for most applications. An object adapter with its own thread pool is useful in three situations:

- The object adapter hosts servants that are not thread-safe, and you want all the dispatches to these servants, from
  any connection, to run one at a time: a dedicated thread pool with `Size` and `SizeMax` set to 1 does this.
- The opposite: the communicator's server thread pool has a single thread, the default, and you want this object adapter
  to dispatch requests concurrently.
- You want to insulate this object adapter from the exhaustion of the communicator's server thread pool by the
  dispatches of other object adapters.

An object adapter creates its own thread pool when any
[_adapter_.ThreadPool.\*](../../../property-reference/object-adapter-properties) property is set. These properties have
the same meaning and defaults as the [Ice.ThreadPool.\*](../../../property-reference/ice-threadpool-properties)
properties of the communicator's thread pools. For example, the properties shown below configure a thread pool for the
object adapter named `PrinterAdapter`:

```config
PrinterAdapter.ThreadPool.Size=3
PrinterAdapter.ThreadPool.SizeMax=15
PrinterAdapter.ThreadPool.SizeWarn=14
```

## See Also

- [Thread Pools](../thread-pools)
- [Object Adapters](../../dispatch)
- [Object Adapter Properties](../../../property-reference/object-adapter-properties)
