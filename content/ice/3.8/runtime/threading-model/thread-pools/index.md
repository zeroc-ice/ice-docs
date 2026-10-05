---
title: Thread Pools
---

A thread pool is a collection of threads that the Ice runtime draws upon to perform specific tasks.

## Introduction to Thread Pools

Each communicator creates two thread pools:

- The _client thread pool_ services outgoing connections, which primarily involves handling the replies to outgoing
  requests{% iflang langs="cpp,java" %} and includes executing AMI callbacks{% /iflang %}{% iflang langs="python" %} and
  includes executing the callbacks of Ice futures; when the communicator has an event loop adapter, such as the asyncio
  event loop passed to `Ice.Communicator`, an awaited invocation resumes on this event loop
  instead{% /iflang %}{% iflang langs="csharp" %}; Ice completes the task of an asynchronous invocation with
  `RunContinuationsAsynchronously`, so the code that follows an awaited invocation runs on a .NET thread pool thread by
  default{% /iflang %}{% iflang langs="swift" %}; an awaited invocation resumes through a Swift continuation, outside
  the thread pool{% /iflang %}. If a connection is used in [bidirectional mode](../../connection-management/bidirectional-connections), the
  client thread pool also dispatches incoming requests.
- The _server thread pool_ services incoming connections. It dispatches incoming requests and, for bidirectional
  connections, processes replies to outgoing requests.{% iflang langs="python" %} When the communicator has an event
  loop adapter, a coroutine dispatch method runs on this event loop.{% /iflang %}{% iflang langs="swift" %} Each Swift
  dispatch runs in a new task, so the size of a thread pool does not limit concurrent Swift dispatches; use
  [Ice.Connection.name.MaxDispatches](../../../property-reference/ice-connection-properties) to limit the concurrent dispatches on a
  connection.{% /iflang %}

By default, these two thread pools are shared by all of the communicator's [object adapters](../../dispatch). If
necessary, you can configure individual object adapters to use a [private thread pool](../object-adapter-thread-pools)
instead.

If a thread pool is exhausted because all threads are currently dispatching a request, additional incoming requests are
transparently delayed until a request completes and relinquishes its thread; that thread is then used to dispatch the
next pending request. Ice minimizes thread context switches in a thread pool by using a leader-follower implementation
[\[1\]](#references).

{% callout type="warning" %}

While Ice tolerates a transient thread pool exhaustion, you should avoid thread exhaustion and not use thread pool
exhaustion for flow-control.

Use instead [Ice.Connection.name.MaxDispatches](../../../property-reference/ice-connection-properties) and
[adapter.MaxConnections](../../../property-reference/object-adapter-properties).

{% /callout %}

## Configuring Thread Pools

Each thread pool has a unique name that serves as the prefix for its configuration properties:
[*name.*Size](../../../property-reference/ice-threadpool-properties), `name.SizeMax`, `name.SizeWarn`, etc.

For configuration purposes, the names of the client and server thread pools are `Ice.ThreadPool.Client` and
`Ice.ThreadPool.Server`, respectively. As an example, the following properties establish the initial and maximum sizes
for these thread pools:

```config
Ice.ThreadPool.Client.Size=1
Ice.ThreadPool.Client.SizeMax=10
Ice.ThreadPool.Server.Size=1
Ice.ThreadPool.Server.SizeMax=10
```

To monitor the thread pool activities of a communicator, you can enable the
[Ice.Trace.ThreadPool](../../../property-reference/ice-trace-properties) property. Setting this property to a non-zero
value causes the communicator to log a message when it creates a thread pool, as well as each time the size of a thread
pool increases or decreases.

## Dynamic Thread Pools

A _dynamic_ thread pool can grow and shrink when necessary in response to changes in an application's work load. All
thread pools have at least one thread, but a dynamic thread pool can grow as the demand for threads increases, up to the
pool's maximum size. Threads may also be terminated automatically when they have been idle for some time.

The dynamic nature of a thread pool is determined by the configuration properties `name.Size`, `name.SizeMax`, and
`name.ThreadIdleTime`. A thread pool is not dynamic in its default configuration because `name.Size` and `name.SizeMax`
are both set to 1, meaning the pool can never grow to contain more than a single thread. To configure a dynamic thread
pool, you must set at least one of `name.Size` or `name.SizeMax` to a value greater than 1. We can use several
configuration scenarios to explore the semantics of dynamic thread pools in greater detail:

```config
name.SizeMax=5
```

This thread pool initially contains a single thread because `name.Size` has a default value of 1, and Ice can grow the
pool up to the maximum of 5 threads. During periods of inactivity, idle threads terminate after 60 seconds (the default
value for `name.ThreadIdleTime`) until the pool contains just 1 thread again.

```config
name.Size=3
name.SizeMax=5
```

This thread pool starts with 3 active threads but otherwise behaves the same as in the previous configuration. The pool
can still shrink to a size of 1 as threads become idle.

```config
name.Size=3
name.ThreadIdleTime=10
```

This thread pool starts with 3 active threads and shrinks quickly to 1 thread during periods of inactivity. As demand
increases again, the thread pool can return to its maximum size of 3 threads (`name.SizeMax` defaults to the value of
`name.Size`).

```config
name.SizeMax=5
name.ThreadIdleTime=0
```

This thread pool can grow from its initial size of 1 thread to contain up to 5 threads, but it will never shrink because
`name.ThreadIdleTime` is set to 0.

```config
name.Size=5
name.ThreadIdleTime=0
```

This thread pool starts with 5 threads and can neither grow nor shrink.

To summarize, the value of `name.ThreadIdleTime` determines whether (and how quickly) a thread pool can shrink to a size
of 1. A thread pool that shrinks can also grow to its maximum size. Finally, setting `name.SizeMax` to a value larger
than `name.Size` allows a thread pool to grow beyond its initial capacity.

## Serializing the Messages of Each Connection

A multi-threaded pool can dispatch several requests received over the same connection concurrently. Setting
[_name_.Serialize](../../../property-reference/ice-threadpool-properties) to a value greater than 0 makes the pool process the messages of each
connection one at a time, in the order received, while it still dispatches requests from different connections
concurrently. This property has an effect only on a pool whose maximum size is greater than 1.

{% iflang langs="cpp,csharp,java,python" %}

## Executing Dispatches and Callbacks with Your Own Executor

By default, a thread pool thread executes the dispatches and the asynchronous invocation callbacks of its connections.
The `executor` field of `InitializationData` lets the application choose this thread: the communicator calls the
executor with each dispatch or callback to execute, and with the connection associated with this call, which can be
null. The executor must eventually execute the call, for example by queuing it to a UI thread so that dispatches and
callbacks can update UI objects directly. The executor, rather than the size of the thread pool, then determines which
of the calls it receives run concurrently.

The `threadStart` and `threadStop` fields of `InitializationData` are functions that the communicator calls when it
starts a new thread and when this thread is about to terminate.

{% /iflang %}

## See Also

- [Thread Pool Design Considerations](../thread-pool-design-considerations)
- [Bidirectional Connections](../../connection-management/bidirectional-connections)
- [Object Adapters](../../dispatch)
- [Object Adapter Thread Pools](../object-adapter-thread-pools)
- [Ice.ThreadPool.*](../../../property-reference/ice-threadpool-properties)

## References

1. Schmidt, D. C. et al. 2000.
   ["Leader/Followers: A Design Pattern for Efficient Multi-Threaded Event Demultiplexing and Dispatching"](https://www.cs.wm.edu/~dcschmidt/PDF/lf.pdf).
   In _Proceedings of the 7th Pattern Languages of Programs Conference_, WUCS-00-29, Seattle, WA: University of
   Washington.
