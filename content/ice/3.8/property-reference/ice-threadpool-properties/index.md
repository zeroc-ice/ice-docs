---
title: Ice.ThreadPool.*
---

A communicator creates two [thread pools](../the-ice-threading-model):

- the client thread pool is associated with outgoing connections: it reads [Reply](../protocol-messages) messages and
  executes AMI callbacks; it also reads and dispatches Request messages.
- the server thread pool is associated with incoming connections: it reads and dispatches
  [Request](../protocol-messages) messages; it also reads Reply messages and executes AMI callbacks for
  [bidir](../bidirectional-connections) invocations on these connections.

This page describes configuration properties for the client and server thread pools. These thread pools are named
`Client` and `Server`, respectively. In the property descriptions below, replace `name` with `Client` or `Server`.

{% language-section name="lang-1" /%}

# Ice.ThreadPool._name_.Serialize

#### Synopsis

`Ice.ThreadPool.name.Serialize=num`

#### Description

If `num` is a value greater than 0, the `Client` or `Server` [thread pool](../the-ice-threading-model) serializes all
messages from each connection. It is not necessary to enable this feature in a thread pool whose maximum size is 1
thread. When a thread pool dispatches requests implemented with AMD, it serializes the dispatching of requests from each
connection, but it does not wait for a request to complete before it dispatches the next request.

In a multi-threaded pool, enabling serialization allows requests from different connections to be dispatched
concurrently while preserving the order of messages on each connection. Note that serialization can have a significant
impact on latency and throughput. If not defined, the default value is 0.

See also: [Ice.Connection.MaxDispatches](../ice-connection-properties)

# Ice.ThreadPool._name_.Size

#### Synopsis

`Ice.ThreadPool.name.Size=num`

#### Description

[Thread pools](../the-ice-threading-model) in Ice can grow and shrink dynamically, based on an average load factor. A
thread pool always has at least 1 thread and may grow as load increases up to the maximum size specified by
[Ice.ThreadPool._name_.SizeMax](../ice-threadpool-properties#ice.threadpool.name.sizemax). If `SizeMax` is not
specified, Ice uses the value of `num` as the pool's maximum size. The `Client` or `Server` thread pool is initialized
with `num` active threads, but the pool may shrink to only 1 thread during idle periods as determined by
[Ice.ThreadPool._name_.ThreadIdleTime](../ice-threadpool-properties#ice.threadpool.name.threadidletime).

If not specified, the default value is 1 for both properties.

To monitor the thread pool activities of the Ice runtime, enable the [Ice.Trace.ThreadPool](../ice-trace-properties)
property.

# Ice.ThreadPool._name_.SizeMax

#### Synopsis

`Ice.ThreadPool.name.SizeMax=num`

#### Description

`num` is the maximum number of threads for the `Client` or `Server` [thread pool](../the-ice-threading-model). Refer to
the [Ice.ThreadPool._name_.Size](../ice-threadpool-properties#ice.threadpool.name.size) property for more information on
configuring the size of a thread pool.

The default value for `SizeMax` is the value of `Size`, meaning the thread pool can never grow larger than its initial
size.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

Setting `SizeMax` to `-1` uses the number of processors available to the runtime. If this is less than `Size`, Ice uses
`Size` as the maximum.

{% /iflang %}

To monitor the thread pool activities of the Ice runtime, enable the [Ice.Trace.ThreadPool](../ice-trace-properties)
property.

# Ice.ThreadPool._name_.SizeWarn

#### Synopsis

`Ice.ThreadPool.name.SizeWarn=num`

#### Description

Whenever `num` threads are active in the `Client` or `Server` [thread pool](../the-ice-threading-model), a "low on
threads" warning is printed. The default value is 0, which disables the warning.

To monitor the thread pool activities of the Ice runtime, enable the [Ice.Trace.ThreadPool](../ice-trace-properties)
property.

{% language-section name="lang-2" /%}

# Ice.ThreadPool._name_.ThreadIdleTime

#### Synopsis

`Ice.ThreadPool.name.ThreadIdleTime=num`

#### Description

Ice can automatically reap idle threads in the `Client` or `Server` [thread pool](../the-ice-threading-model) to
conserve resources. This property specifies the number of seconds a thread must be idle before it is reaped. If not
specified, the default value is 60 seconds.

{% callout type="tip" %}

The threads in Ice thread pools are assigned jobs at random, and this randomness affects how quickly a thread in an
under-utilized thread pool will get reaped.

{% /callout %}

To disable the reaping of idle threads, set `ThreadIdleTime` to 0. In this situation, the thread pool is initialized
with [Ice.ThreadPool._name_.Size](../ice-threadpool-properties#ice.threadpool.name.size) active threads and may grow to
contain [Ice.ThreadPool._name_.SizeMax](../ice-threadpool-properties#ice.threadpool.name.sizemax) active threads, but
the size of the pool never decreases.

To monitor the thread pool activities of the Ice runtime, enable the [Ice.Trace.ThreadPool](../ice-trace-properties)
property.

{% language-section name="lang-3" /%}
