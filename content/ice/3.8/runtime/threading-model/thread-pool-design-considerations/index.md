---
title: Thread Pool Design Considerations
---

Improper configuration of a [thread pool](../thread-pools) can have a serious impact on the performance of your
application. This page discusses some issues that you should consider when designing and configuring your applications.

## Single-Threaded Pool

There are several implications of using a thread pool with a maximum size of one thread:

{% iflang langs="cpp,java,ruby,php,matlab" %}

- **Only one message can be dispatched at a time.** This can be convenient because it lets you avoid (or postpone)
  dealing with thread-safety issues in your application. However, it also eliminates the possibility of dispatching
  requests concurrently, which can be a bottleneck for applications running on multi-CPU systems or that perform
  blocking operations.
- **Only one AMI reply can be processed at a time.** An application must increase the size of the client thread pool in
  order to process multiple AMI callbacks in parallel.

{% /iflang %}

{% iflang langs="csharp" %}

- **Only one message can be dispatched at a time.** The pool's thread calls one dispatch method at a time, which lets
  you avoid (or postpone) dealing with thread-safety issues in the code that a dispatch method runs before its first
  `await`. The code that follows an `await` runs elsewhere and can run concurrently with other dispatches.
- **Only one reply can be processed at a time.** The code that follows an awaited invocation runs elsewhere and can run
  concurrently with the processing of other replies.

{% /iflang %}

{% iflang langs="python" %}

- **Only one message can be dispatched at a time.** The pool's thread calls one dispatch method at a time. Without an
  event loop adapter, this thread also runs a coroutine dispatch method up to its first `await`. When the communicator
  has an event loop adapter, the adapter runs the whole coroutine on its event loop, even when an executor runs
  dispatches on another thread.
- **Only one reply can be processed at a time.** Without an event loop adapter, the code that follows an awaited
  invocation in a coroutine dispatch method runs on the thread that completes the invocation, and it occupies this
  thread while it runs. When the communicator has an event loop adapter, this code runs on the event loop.

{% /iflang %}

{% iflang langs="swift" %}

- **Only one message can be read at a time.** Each dispatch then runs in its own task, so dispatches can run
  concurrently;
  [Ice.Connection.name.MaxDispatches](../../../property-reference/ice-connection-properties#ice.connection.name.maxdispatches)
  limits the concurrent dispatches on a connection.
- **Only one reply can be processed at a time.** An awaited invocation resumes through a Swift continuation, outside the
  thread pool.

{% /iflang %}

It is important to remember that a communicator's client and server thread pools have a default maximum size of **1
thread**, therefore these limitations also apply to any object adapter that shares the communicator's thread pools.

## Multi-Threaded Pool

Configuring a thread pool to support multiple threads implies that the application is prepared for the Ice runtime to
dispatch operation invocations or AMI callbacks concurrently. Although greater effort is required to design a
thread-safe application, you are rewarded with the ability to improve the application's scalability and throughput.

Choosing an appropriate maximum size for a thread pool requires careful analysis of your application. For example, in
compute-bound applications it is best to limit the number of threads to the number of physical processor cores or
threads on the host machine; adding any more threads only increases context switches and reduces performance. Increasing
the size of the pool beyond the number of cores can improve responsiveness when threads can become blocked while waiting
for the operating system to complete a task, such as a network or file operation. On the other hand, a thread pool
configured with too many threads can have the opposite effect and negatively impact performance. Testing your
application in a realistic environment is the recommended way of determining the optimum size for a thread pool.

## See Also

- [Thread Pools](../thread-pools)
- [Concurrent Proxy Invocations](../../invocation/concurrent-proxy-invocations)
- [Nested Invocations](../nested-invocations)
- [Connection Establishment](../../connection-management/connection-establishment)
