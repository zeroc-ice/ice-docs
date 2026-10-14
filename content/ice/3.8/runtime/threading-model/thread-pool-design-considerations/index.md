---
title: Thread Pool Design Considerations
languages:
  - cpp
  - csharp
  - java
  - python
  - swift
---

By default, the client and server thread pools of a communicator have a single thread, so Ice dispatches one request at
a time and processes one reply at a time. To let your application dispatch requests or process replies concurrently, you
increase the maximum size of these thread pools. This page describes what each choice means for your application.

## Single-Threaded Pool

A thread pool with a maximum size of one thread behaves as follows:

{% iflang langs="cpp,java" %}

- **The pool dispatches one request at a time**, which lets you avoid (or postpone) dealing with thread-safety issues in
  your servants.
- **The pool processes one reply at a time.** The AMI callbacks, which run on the same thread, also run one at a time.

{% /iflang %}

{% iflang langs="csharp" %}

- **The pool dispatches one request at a time**, which lets you avoid (or postpone) dealing with thread-safety issues in
  servants with synchronous dispatch methods.
- **The pool processes one reply at a time.**

{% /iflang %}

{% iflang langs="python" %}

- **The pool dispatches one request at a time.**
- **The pool processes one reply at a time.**

{% /iflang %}

{% iflang langs="swift" %}

- **The pool reads one request at a time.** The dispatches themselves run concurrently, each in its own task;
  [Ice.Connection.name.MaxDispatches](../../../property-reference/ice-connection-properties#ice.connection.name.maxdispatches)
  limits the concurrent dispatches on a connection.
- **The pool processes one reply at a time.**

{% /iflang %}

## Multi-Threaded Pool

{% iflang langs="cpp,csharp,java" %}

A thread pool with several threads dispatches requests{% iflang langs="cpp,java" %} and runs AMI callbacks{% /iflang %}
concurrently, so your servants{% iflang langs="cpp,java" %} and callbacks{% /iflang %} must be thread-safe. The right
maximum size depends on your workload: a compute-bound server gains nothing from more threads than cores, while a server
whose dispatches block, on I/O for example, benefits from more threads than cores. Test with a realistic workload to
find this size.

{% /iflang %}

{% iflang langs="python" %}

The Python interpreter executes one thread at a time. With a multi-threaded pool, a dispatch that blocks (on I/O, for
example) lets another dispatch run, but two dispatches never run in parallel. Your servants must still be thread-safe,
since the interpreter can switch from one dispatch to another at any point.

{% /iflang %}

{% iflang langs="swift" %}

Each dispatch runs in its own task, executed by Swift concurrency's global concurrent executor whatever the size of the
Ice thread pool, so dispatches run concurrently and your servants must be safe for concurrent calls. A multi-threaded
pool only reads requests and replies in parallel.

{% /iflang %}

## See Also

- [Thread Pools](../thread-pools)
- [Concurrent Proxy Invocations](../../invocation/concurrent-proxy-invocations)
- [Nested Invocations](../nested-invocations)
- [Connection Establishment](../../connection-management/connection-establishment)
