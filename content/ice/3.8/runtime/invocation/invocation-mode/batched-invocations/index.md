---
title: Batched Invocations
---

Oneway and datagram invocations are normally sent as individual requests, that is, the Ice runtime sends the oneway or
datagram request to the server immediately, as soon as the client makes the call. If a client sends a number of oneway
or datagram requests in succession, the client-side runtime traps into the OS kernel for each request, which is
expensive. In addition, each request is sent with its own request header, that is, for _N_ messages, the bandwidth for
_N_ request headers is consumed. In situations where a client sends a large number of oneway or datagram requests, the
additional overhead can be considerable.

To avoid the overhead of sending many small requests, you can send oneway and datagram invocations in a batch: instead
of being sent as a separate requests, a batch request is placed into a client-side buffer by the Ice runtime. Successive
batch requests are added to the buffer and accumulated on the client side until they are flushed, either explicitly by
the client or automatically by the Ice runtime.

{% language-section name="lang-1" /%}

# Proxy Methods for Batched Invocations

The `ice_batchOneway` and `ice_batchDatagram` methods create a new proxy configured for batch invocations. Once you
obtain a batch proxy, requests sent via that proxy are buffered by the proxy instead of being sent immediately. Once the
client has invoked one or more operations on a batch proxy, it can call `ice_flushBatchRequests` to explicitly flush the
batched requests. This causes the batched requests to be sent "in bulk", preceded by a single message header. On the
server side, batched requests are dispatched by a single thread, in the order in which they were written into the batch.
This means that requests from a single batch cannot appear to be reordered in the server. Moreover, either all messages
in a batch are delivered or none of them. (This is true even for batched datagrams.)

Batched requests are queued by the proxy on which the operation was invoked (this is true for all proxies except fixed
proxies). It's important to be aware of this behavior for several reasons:

- Batched requests queued on a proxy will be lost if that proxy is deallocated prior to being flushed
- Proxy instances maintain separate queues even if they refer to the same target object

# Automatically Flushing Batched Requests

The default behavior of the Ice runtime, as governed by the configuration property `Ice.BatchAutoFlushSize`,
automatically flushes batched requests as soon as a batched request causes the accumulated message to exceed the
specified limit. When this occurs, the Ice runtime immediately flushes the existing batch of requests and begins a new
batch with this latest request as its first element.

For batched oneway requests, the value of `Ice.BatchAutoFlushSize` specifies the maximum message size in KiB; the
default value is 1 MiB. In the case of batched datagram requests, the maximum message size is the smaller of the
system's maximum size for datagram packets and the value of `Ice.BatchAutoFlushSize`.

{% callout type="warning" %}

The receiver's setting for `Ice.MessageSizeMax` determines the maximum size that the Ice runtime will accept for an
incoming protocol message. The sender's setting for `Ice.BatchAutoFlushSize` must not exceed this limit. Over UDP, the
receiver drops an oversized batch; over the other transports, it rejects the batch with a `MarshalException` and closes
the connection.

{% /callout %}

Automatic flushing is enabled by default as a convenience for clients to ensure a batch never exceeds the configured
limit.

{% language-section name="lang-2" /%}

# Batched Invocations for Fixed Proxies

A _fixed proxy_ is a special form of proxy that an application explicitly creates for use with a specific connection.
Batched requests on a fixed proxy are not queued by the proxy, as is the case for regular proxies, but rather by the
connection associated with the fixed proxy. Automatic flushing continues to work as usual for batched requests on fixed
proxies, and you have three options for manually flushing:

- Calling `ice_flushBatchRequests` on a fixed proxy flushes all batched requests queued by its connection; this includes
  batched requests from other fixed proxies that share the same connection
- Calling `flushBatchRequests` on the connection flushes all batched requests queued by the target connection
- Calling `flushBatchRequests` on the communicator flushes all batched requests on all connections associated with the
  target communicator

{% callout type="info" %}

`flushBatchRequests` on a connection or communicator has no effect on batched requests queued by regular (non-fixed)
proxies.

{% /callout %}

The synchronous versions of `flushBatchRequests` block the calling thread until the batched requests have been
successfully written to the local transport. To avoid the risk of blocking, you must use the asynchronous versions
instead.

Note the following limitations in case a connection error occurs:

- Any requests queued by that connection are lost
- Automatic retries are not attempted
- The proxy method `ice_flushBatchRequests` and `flushBatchRequests` on connection throw exceptions; on the other hand,
  `flushBatchRequests` on communicator ignores all errors

# Considerations for Batched Datagrams

For batched datagram invocations, you need to keep in mind that, if the data for the request in a batch substantially
exceeds the PDU size of the network, it becomes increasingly likely for an individual UDP packet to get lost due to
fragmentation. In turn, loss of even a single packet causes the entire batch to be lost. For this reason, batched
datagram invocations are most suitable for simple interfaces with a number of operations that each set an attribute of
the target object (or interfaces with similar semantics). Batched oneway invocations do not suffer from this risk
because they are sent over connection-oriented transports, so individual packets cannot be lost.

If automatic flushing is enabled, Ice's default behavior uses the smaller of
[Ice.BatchAutoFlushSize](../ice-properties#ice.batchautoflushsize) and [Ice.UDP.SndSize](../ice-udp-properties) to
determine the maximum size for a batch datagram message.

# Compressing Batched Invocations

Batched invocations are more efficient if you also enable compression for the transport: many isolated and small
messages are unlikely to compress well, whereas batched messages are likely to provide better compression because the
compression algorithm has more data to work with.

{% callout type="info" %}

Regardless of whether you used batched messages or not, you should enable compression only on lower-speed links. For
high-speed LAN connections, the CPU time spent doing the compression and decompression is typically longer than the time
it takes to just transmit the uncompressed data.

{% /callout %}
