---
id: batched-invocation-interceptors
title: Batched Invocation Interceptors
---

Batch invocation interceptors allow you to implement your own auto-flush algorithm or receive notification when an
auto-flush fails.

You install an interceptor by setting the `batchRequestInterceptor` field of the
[InitializationData](https://code.zeroc.com/manual/Ice/InitializationData) object you use to create your communicator.
The communicator invokes the interceptor for each batch request, passing the following arguments:

- `req` - An object representing the batch request being queued
- `count` - The number of requests currently in the queue
- `size` - The number of bytes consumed by the requests currently in the queue

The request represented by `req` is not included in the `count` and `size` figures.

A batch request is not queued until the interceptor calls `enqueue`. The minimal interceptor implementation is
therefore:

{% language-section name="lang-1" /%}

A more sophisticated implementation might use its own logic for automatically flushing queued requests:

{% language-section name="lang-2" /%}

In this example, the implementation consults the existing Ice property `Ice.BatchAutoFlushSize` to determine the limit
that triggers an automatic flush. If a flush is necessary, the interceptor can obtain the relevant proxy by calling
`getProxy` on the `BatchRequest` object.

Specifying your own exception handler when calling `ice_flushBatchRequestsAsync` gives you the ability to take action if
a failure occurs (Ice's default automatic flushing implementation ignores any errors). Aside from logging a message,
your options are somewhat limited because it's not possible for the interceptor to force a retry.

{% callout type="info" %}

For batch datagram proxies, we recommend using a maximum queue size that is smaller than the network MTU to minimize the
risk that datagram fragmentation could cause an entire batch to be lost.

{% /callout %}
