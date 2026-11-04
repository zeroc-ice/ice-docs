---
title: Batched Invocations
sidebarLabel: Batched
---

A batch oneway or batch datagram invocation queues its request on the client side instead of sending it. Flushing the
queue sends all its requests in a single message, which saves the per-request overhead when a client sends many small
requests.

`ice_batchOneway` and `ice_batchDatagram` return a batch proxy, and `ice_flushBatchRequests` flushes its queue:

{% language-section name="proxy-methods-for-batched-invocations" /%}

A batch travels as a single message, so the object adapter receives either all of its requests or none of them. Ice
dispatches the requests of a batch one after the other, in the order in which they were written into the batch: it
starts each dispatch once the previous dispatch returns, so a dispatch implemented asynchronously can complete after the
next one starts. Dispatching a batch is not transactional: a request that fails does not undo the requests dispatched
before it.

Each batch proxy has its own queue, even when several proxies refer to the same Ice object, and the requests it queued
are lost if the application releases the proxy before flushing them. Ice does not [retry](../../automatic-retries) a
batch: if the connection fails, the requests of the batch are lost.

## Automatic Flushing

Ice flushes a batch automatically when a new request makes it reach the size set by
[Ice.BatchAutoFlushSize](../../../../property-reference/ice-properties#ice.batchautoflushsize), in KiB: Ice sends the
requests queued before this one and starts a new batch with it. The default is 1024 KiB (1 MiB), and `0` disables
automatic flushing. Keep this size at or below the receiver's `Ice.MessageSizeMax`, the largest message the receiver
accepts.

{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}

When automatic flushing is enabled, Ice also caps this size for batch datagram invocations at
[Ice.UDP.SndSize](../../../../property-reference/ice-udp-properties#ice.udp.sndsize) bytes, or 65,507 bytes when that
property is not set. A larger batch datagram is more likely to be fragmented, and the loss of one fragment loses the
whole batch.

{% /iflang %}

{% iflang langs="cpp,csharp,java,python" %}

To flush with your own policy, install a [batch invocation interceptor](../batched-invocation-interceptors).

{% /iflang %}

## Batched Invocations for Fixed Proxies

A batch [fixed proxy](../../creating-proxies#creating-a-proxy-from-a-connection) queues its requests on its connection
rather than on the proxy, so `ice_flushBatchRequests` on a fixed proxy also flushes the requests of the other fixed
proxies of this connection. `flushBatchRequests` on a connection flushes the queue of this connection, and on a
communicator flushes the queues of all its connections; neither flushes the queue of a regular proxy.

When a flush fails, `ice_flushBatchRequests` and `flushBatchRequests` on a connection report the failure, while
`flushBatchRequests` on a communicator ignores it.
