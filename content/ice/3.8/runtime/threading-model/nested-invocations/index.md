---
title: Nested Invocations
languages:
  - cpp
  - csharp
  - java
  - python
  - swift
---

A _nested invocation_ occurs when the implementation of an Ice operation invokes another operation through a proxy.

## Deadlocks with Nested Invocations

Nested invocations are common, but they can deadlock. To avoid deadlocks, do not hold a shared resource, such as a mutex
or a thread of an [Ice thread pool](../thread-pools), while waiting.

{% iflang langs="cpp,csharp,java,python" %}

A synchronous dispatch holds the thread that executes it, by default a thread of the server thread pool, until it
returns, and a synchronous twoway invocation blocks its thread until the response arrives. A synchronous invocation made
from a synchronous dispatch therefore holds a dispatch thread while it waits. If the invocation depends, directly or
indirectly, on another dispatch from the same thread pool, the two can deadlock:

![The client calls opA on Server A. While dispatching opA, Server A calls opB on Server B. Server A's only dispatch thread waits for opB to return, so Server A cannot dispatch Server B's callback.](/images/ice/3.8/nested-invocations/nested-deadlock.svg)

_Nested invocation deadlock._

In this example, all the calls are synchronous, and both servers use the default server thread pool, which has a single
thread. Server A's thread is blocked waiting for opB to complete, but Server B cannot complete opB until Server A
dispatches its callback. Neither invocation can complete.

A larger server thread pool avoids this deadlock only while fewer nested invocations are pending than the pool has
threads. To avoid exhausting the dispatch threads, release the dispatch thread while the nested invocation is pending:
implement the outer operation with asynchronous dispatch (AMD), make the nested invocation asynchronously, and complete
the dispatch when the nested invocation completes. Making the nested invocation asynchronously and then waiting for its
result in the dispatch thread still holds that thread. With asynchronous dispatch, you can also make the synchronous
invocation from a thread of your own instead of an Ice thread pool thread.

{% callout type="note" %}

A oneway invocation does not wait for a response from the server. However, a synchronous oneway invocation can block
while the Ice runtime establishes a connection or writes the request to the connection. To avoid blocking a dispatch
thread or a thread holding a mutex, make an asynchronous oneway invocation.

{% /callout %}

{% /iflang %}

{% iflang langs="swift" %}

Each dispatch runs in its own task, and proxy invocations are asynchronous. A servant that awaits a nested invocation
suspends its task without holding a thread of the Ice thread pool, so nested invocations do not exhaust the server
thread pool.

{% /iflang %}

## See Also

- [Thread Pools](../thread-pools)
- [Object Adapter Thread Pools](../object-adapter-thread-pools)
- [Thread Pool Design Considerations](../thread-pool-design-considerations)
- [Oneway Invocations](../../invocation/invocation-mode/oneway-invocations)
