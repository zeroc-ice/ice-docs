---
title: Batched Invocations
sidebarLabel: Batched
---

A batched invocation is an invocation made with a batch proxy, a proxy whose [invocation mode](..) is batch
oneway{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %} or batch datagram{% /iflang %}. It queues the
request on the client side instead of sending it. Flushing the queue sends all the queued requests in a single message,
which saves the per-request overhead when a client sends many small requests.

You get a batch proxy from `ice_batchOneway`{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %} or
`ice_batchDatagram`{% /iflang %}, and `ice_flushBatchRequests` flushes its queue:

{% language-section name="proxy-methods-for-batched-invocations" /%}

A batch travels as a single message, so the object adapter receives either all the requests of the batch or none. Ice
dispatches the requests of a batch one after the other, in the order in which they were written into the batch: it
starts each dispatch once the previous dispatch returns, so a dispatch implemented asynchronously can complete after the
next one starts.

Each batch proxy has its own queue, even when several proxies refer to the same Ice object, and the requests it queued
are lost if the application releases the proxy before flushing them. Ice does not [retry](../../automatic-retries) a
flush: if the connection fails while Ice sends the batch, its requests are lost.

## Automatic Flushing

Ice flushes a batch automatically when a new request makes it reach the size set by
[Ice.BatchAutoFlushSize](../../../../property-reference/ice-properties#ice.batchautoflushsize), in KiB: Ice sends the
requests queued before this one and starts a new batch with it. The default is 1024 KiB (1 MiB), and `0` disables
automatic flushing for batch oneway invocations. Keep this size at or below the receiver's `Ice.MessageSizeMax`, the
largest message the receiver accepts.

{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}

For batch datagram invocations, Ice caps this size at
[Ice.UDP.SndSize](../../../../property-reference/ice-udp-properties#ice.udp.sndsize) bytes, or 65,507 bytes when that
property is not set, including when `Ice.BatchAutoFlushSize` is `0`.

{% /iflang %}

{% iflang langs="cpp,csharp,java,python" %}

To flush with your own policy, install a [batch invocation interceptor](../batched-invocation-interceptors).

{% /iflang %}

## Batched Invocations for Fixed Proxies

A batch [fixed proxy](../../creating-proxies#creating-a-proxy-from-a-connection) queues its requests in the queue of its
connection, which all the batch fixed proxies that use this connection share. `ice_flushBatchRequests` on a fixed proxy
flushes this queue, as does `flushBatchRequests` on the connection; `flushBatchRequests` on a communicator flushes the
queues of all its connections. None of these flush the queue of a regular proxy. This holds for both batch modes: a
batch datagram fixed proxy uses a UDP connection, and a batch oneway fixed proxy uses a connection of another transport.
