---
title: Object Adapter Thread Pools
languages:
  - cpp
  - csharp
  - java
  - python
  - swift
---

An [object adapter](../../dispatch) uses a [thread pool](../thread-pools) to process its incoming connections: by
default, the server thread pool of its communicator, which is sufficient for many applications. An object adapter with
its own thread pool is useful in the following situations:

- When the concurrency requirements of an object adapter do not match those of its communicator. In a server with
  multiple object adapters, the communicator's server thread pool may suit some object adapters, while another needs a
  thread pool of a different size.

- To give an object adapter threads of its own, so that the dispatches of other object adapters cannot exhaust them.

An object adapter's thread pool supports all of the properties described in [Configuring Thread Pools](../thread-pools).
For configuration purposes, the name of an adapter's thread pool is `adapter.ThreadPool`, where `adapter` is the name of
the adapter.

An adapter creates its own thread pool when any
[_adapter_.ThreadPool.\*](../../../property-reference/object-adapter-properties) property is set; otherwise, it uses the
communicator's server thread pool. These properties have the same semantics and default values as those described
earlier.

As an example, the properties shown below configure a thread pool for the object adapter named `PrinterAdapter`:

```config
PrinterAdapter.ThreadPool.Size=3
PrinterAdapter.ThreadPool.SizeMax=15
PrinterAdapter.ThreadPool.SizeWarn=14
```

## See Also

- [Thread Pools](../thread-pools)
- [Object Adapters](../../dispatch)
- [Object Adapter Properties](../../../property-reference/object-adapter-properties)
