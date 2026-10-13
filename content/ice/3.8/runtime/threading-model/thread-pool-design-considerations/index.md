---
title: Thread Pool Design Considerations
languages:
  - cpp
  - csharp
  - java
  - python
  - swift
---

Improper configuration of a [thread pool](../thread-pools) can have a serious impact on the performance of your
application. This page discusses some issues that you should consider when designing and configuring your applications.

## Single-Threaded Pool

There are several implications of using a thread pool with a maximum size of one thread:

{% iflang langs="cpp,java" %}

- **Only one request is dispatched at a time.** This can be convenient because it lets you avoid (or postpone) dealing
  with thread-safety issues in your servants. However, it also eliminates the possibility of dispatching requests
  concurrently, which can be a bottleneck when dispatches perform blocking operations.
- **Only one reply is processed at a time.** An application must increase the size of the client thread pool to process
  several replies and run several AMI callbacks in parallel.

{% /iflang %}

{% iflang langs="csharp" %}

- **Only one dispatch method is called at a time.** A larger pool lets dispatches that block run concurrently. An async
  dispatch method returns its thread to the pool at its first `await` of an incomplete task, and the code that follows
  this `await` runs outside the thread pool, concurrently with the next dispatches: an async servant must be thread-safe
  whatever the size of the pool.
- **Only one reply is processed at a time.** An application must increase the size of the client thread pool to process
  several replies in parallel.

{% /iflang %}

{% iflang langs="python" %}

- **Only one dispatch method is called at a time.** For synchronous dispatch methods, a larger pool lets several
  dispatches be in progress, but the Python interpreter executes only one of them at a time: more threads help only when
  dispatches block, for example on I/O. A coroutine dispatch method returns its thread to the pool when it awaits an
  incomplete future, or runs on the event loop when the communicator has an event loop adapter, so several coroutine
  dispatches can be in progress with a single thread.
- **Only one reply is processed at a time.** The same applies to the callbacks of Ice futures.

{% /iflang %}

{% iflang langs="swift" %}

- **Only one request is read at a time.** Each dispatch then runs in its own task, so dispatches can run concurrently;
  [Ice.Connection.name.MaxDispatches](../../../property-reference/ice-connection-properties#ice.connection.name.maxdispatches)
  limits the concurrent dispatches on a connection.
- **Only one reply is processed at a time.** An application must increase the size of the client thread pool to process
  several replies in parallel.

{% /iflang %}

It is important to remember that a communicator's client and server thread pools have a default maximum size of **1
thread**, therefore these limitations also apply to any object adapter that shares the communicator's thread pools.

## Multi-Threaded Pool

{% iflang langs="cpp,csharp,java" %}

A thread pool with several threads dispatches requests{% iflang langs="cpp,java" %} and runs AMI callbacks{% /iflang %}
concurrently, so your servants{% iflang langs="cpp,java" %} and callbacks{% /iflang %} must be thread-safe. The right
maximum size depends on your workload: a compute-bound server gains nothing from more threads than cores, while a server
whose dispatches block, on I/O for example, benefits from more threads than cores. Test with a realistic workload to
find this size.

{% /iflang %}

{% iflang langs="python" %}

The Python interpreter executes one thread at a time: a multi-threaded pool lets a dispatch block, on I/O for example,
while another one runs, but never runs two dispatches in parallel. Your servants must still be thread-safe, since the
interpreter switches threads between dispatches at any point.

{% /iflang %}

{% iflang langs="swift" %}

Each dispatch runs in its own task whatever the size of the pool, and dispatches run concurrently, so your servants must
be safe for concurrent calls. A multi-threaded pool only reads requests and replies in parallel;
`Ice.Connection.name.MaxDispatches` is what bounds the concurrent dispatches on a connection.

{% /iflang %}

## See Also

- [Thread Pools](../thread-pools)
- [Concurrent Proxy Invocations](../../invocation/concurrent-proxy-invocations)
- [Nested Invocations](../nested-invocations)
- [Connection Establishment](../../connection-management/connection-establishment)
