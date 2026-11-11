---
title: Batched Invocation Interceptors
sidebarLabel: Batch Interceptors
languages:
  - cpp
  - csharp
  - java
  - python
---

A batch invocation interceptor lets you flush batched requests with your own policy, and handle a failed flush.

You install an interceptor by setting the `batchRequestInterceptor` field of the
[InitializationData](api:Ice/InitializationData) object you use to create your communicator. The communicator invokes
the interceptor for each batch request, passing the following arguments:

- `req`: an object representing the batch request being queued
- `count`: the number of requests already in the queue
- `size`: the number of bytes of the queued batch message, including its header

The request represented by `req` is not included in `count` and `size`, and is queued only when the interceptor calls
`enqueue` on it.

The following interceptor flushes the queued requests when adding the new request would make the batch message larger
than 64 KiB:

{% language-section name="mapping-2" /%}

Installing an interceptor does not turn off [automatic flushing](../batched-invocations#automatic-flushing).
