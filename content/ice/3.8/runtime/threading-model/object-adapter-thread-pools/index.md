---
title: Object Adapter Thread Pools
---

The default behavior of an [object adapter](../../dispatch) is to share the [thread pool](../thread-pools) of its
communicator and, for many applications, this behavior is entirely sufficient. However, the ability to configure an
object adapter with its own thread pool is useful in certain situations:

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

An adapter's thread pool processes only the incoming connections of this adapter. An outgoing connection always uses the
communicator's client thread pool, even when the object adapter associated with it for
[bidirectional dispatches](../../connection-management/bidirectional-connections) has its own thread pool.

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
