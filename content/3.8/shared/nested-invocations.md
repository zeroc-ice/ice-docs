---
id: nested-invocations
title: Nested Invocations
---

A _nested invocation_ is one that is made within the context of another Ice operation. For instance, the implementation
of an operation in a servant might want to invoke an operation another object (using a proxy).

# Deadlocks with Nested Invocations

Making a nested invocation is legitimate, even common, however you need be careful to avoid deadlocks.

The general rule to avoid deadlocks is **do not hold onto any shared resource while waiting.**

If you make a synchronous two-way invocation, you’re waiting: your thread is blocked until it gets the response from the
target Ice object. And if you make this synchronous invocation within a synchronous dispatch, you’re holding onto a
shared resource: the dispatch thread (current thread) from an [Ice thread pool](../thread-pools).

![nested-deadlock.gif](/attachments/3.8/nested-invocations/nested-deadlock.gif)

In this diagram, we assume all calls are synchronous and both Server A and Server B use the default configuration, with
a single thread in their respective server thread pools. We get a deadlock because Server A’s thread pool is exhausted
(its only thread is waiting for the opB invocation to complete).

Making the shared resource more abundant (e.g., by configuring more threads in your Ice thread pool) can work for a
while, but is brittle. The correct solution is to follow the shared resource rule (see above) and make an asynchronous
invocation instead of a synchronous one from the dispatch thread. Or alternatively, dispatch asynchronously (with AMD)
and make the synchronous invocation from a separate thread - not an Ice thread pool thread.

{% callout type="info" %}

When you make a **oneway** invocation, you generally don’t wait, or at least you don’t think you may wait.

In reality, a _synchronous_ oneway invocation may block for a while: the Ice runtime can establish a connection to the
server as part of this invocation (if it’s the first call), or it can take some time to write a large message to the
network connection.

As a result, you may want to perform an asynchronous oneway invocation to avoid any waiting in a thread that holds onto
a shared resource (such as a mutex, or itself when the thread in question is a dispatch thread).

{% /callout %}

##### See Also

- [Thread Pools](../thread-pools)
- [Object Adapter Thread Pools](../object-adapter-thread-pools)
- [Thread Pool Design Considerations](../thread-pool-design-considerations)
- [Oneway Invocations](../oneway-invocations)
