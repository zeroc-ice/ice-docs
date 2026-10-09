---
title: Batched Invocation Interceptors
languages:
  - cpp
  - csharp
  - java
  - python
---

Batch invocation interceptors allow you to flush batched requests with your own algorithm and to take action when such a
flush fails.

You install an interceptor by setting the `batchRequestInterceptor` field of the
[InitializationData](api:Ice/InitializationData) object you use to create your communicator. The communicator invokes
the interceptor for each batch request, passing the following arguments:

- `req` - An object representing the batch request being queued
- `count` - The number of requests currently in the queue
- `size` - The number of bytes of the queued batch message, including its header

The request represented by `req` is not included in the `count` and `size` figures. Its `getSize` method returns the
size of the request in bytes, `getOperation` returns the name of the operation, and `getProxy` returns the proxy that
made the request.

A batch request is not queued until the interceptor calls `enqueue`. The minimal interceptor implementation is
therefore:

{% language-section name="mapping-1" /%}

A more sophisticated implementation might use its own logic for automatically flushing queued requests:

{% language-section name="mapping-2" /%}

In this example, the interceptor flushes the queued requests when adding the new request would make the batch message
larger than 64 KiB.

Ice checks its own automatic flush threshold, set by `Ice.BatchAutoFlushSize`, before it calls the interceptor. An
interceptor that flushes at a lower limit therefore flushes the batch before Ice does.

Specifying your own exception handler when calling `ice_flushBatchRequestsAsync` gives you the ability to take action if
a failure occurs (Ice's default automatic flushing implementation ignores any errors). Aside from logging a message,
your options are somewhat limited because it's not possible for the interceptor to force a retry.

{% callout type="note" %}

For batch datagram proxies, we recommend using a maximum queue size that is smaller than the network MTU to minimize the
risk that datagram fragmentation could cause an entire batch to be lost.

{% /callout %}
