---
title: IceStorm Quality of Service
sidebarLabel: Quality of Service
---

An IceStorm subscriber specifies Quality of Service (QoS) parameters at the time of subscription. Parameter names are
case-sensitive, and IceStorm ignores unknown parameters. The sections below describe how IceStorm handles a failed
delivery, then the supported QoS parameters.

## Delivery Failures

IceStorm treats a failure to deliver an event to a subscriber as either hard or transient. A hard failure means that the
subscriber is permanently unusable, and IceStorm removes the subscriber immediately:

- `Ice::ObjectNotExistException` — the subscriber is no longer registered in the target object adapter.
- `Ice::NotRegisteredException` — the subscriber's proxy is an indirect proxy that the configured locator can no longer
  resolve.
- `IceStorm::SendQueueSizeMaxReachedException` — the number of events queued for the subscriber reached
  [IceStorm.Send.QueueSizeMax](../../../property-reference/icestorm-properties#icestorm.send.queuesizemax) and
  [IceStorm.Send.QueueSizeMaxPolicy](../../../property-reference/icestorm-properties#icestorm.send.queuesizemaxpolicy)
  is set to `RemoveSubscriber` (the default).

Any other failure is transient, such as a connection failure or a timeout.

## Reliability QoS for IceStorm

The QoS parameter `reliability` affects event delivery. The only legal values at this point are `ordered` and the empty
string. If not specified, the default value is the empty string (meaning not ordered).

The `ordered` reliability QoS requires a twoway subscriber proxy. If you specify this reliability QoS, IceStorm will
forward events in the order they are received but doesn't forward them immediately. Instead, IceStorm waits for the
reply from the forwarding of an event before forwarding the next event. This guarantees that the subscriber will process
the events in the same order as they were received even if its
[thread pool](../../../runtime/threading-model/thread-pool-design-considerations) doesn't serialize incoming requests.

## Retry Count QoS for IceStorm

The QoS parameter `retryCount` determines how many _consecutive_ transient failures IceStorm tolerates before it removes
a subscriber:

| Value         | Description                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `-1`          | IceStorm never removes the subscriber for a transient failure. IceStorm always uses this value for a link to another topic. |
| `0` (default) | IceStorm removes the subscriber on its first transient failure.                                                             |
| Positive      | IceStorm removes the subscriber when its consecutive transient failures exceed this value.                                  |

A successful delivery resets the count. A delivery to a twoway or ordered subscriber, or to a linked topic, succeeds
when IceStorm receives the reply; a delivery to a oneway or datagram subscriber succeeds when IceStorm sends the event,
and a delivery to a batch subscriber when IceStorm flushes the batch. For example, with a `retryCount` of `3`, a
subscriber that experiences occasional, isolated transient failures is never removed, while a subscriber that remains
unreachable for four consecutive delivery attempts is removed.

A retry count of `-1` adds some resiliency to your IceStorm application by ignoring transient failures such as
`ConnectionRefusedException`. The risk is that a subscription whose subscriber is gone for good, for example a
subscriber process that terminated without unsubscribing, is never removed as long as its failures stay transient.

To use a retry count of `-1` successfully, the subscriber can either register with an endpoint whose port number you
chose, or use [IceGrid](../../icegrid) to take advantage of indirect proxies and automatic activation.

### Events Discarded After a Transient Failure

When a transient failure occurs while delivering to a subscriber and the subscriber's `retryCount` tolerates it,
IceStorm discards all events currently queued for this subscriber, increments the subscriber's failure count, and places
the subscriber offline for the number of seconds specified by the
[IceStorm.Discard.Interval](../../../property-reference/icestorm-properties#icestorm.discard.interval) property (60
seconds by default). While the subscriber is offline, IceStorm discards any new events published on the topic instead of
queueing them for this subscriber. Once the interval has elapsed, the next published event puts the subscriber back
online and delivery resumes, starting with that event.

As a result, a subscriber does not receive the events that were queued or published between the failure and the end of
the discard interval. You can observe these subscriber state transitions by setting
[IceStorm.Trace.Subscriber](../../../property-reference/icestorm-properties#icestorm.trace.subscriber) to `2`.

## Connection Caching QoS for IceStorm

The QoS parameter `connectionCached` affects the
[connection caching](../../../runtime/connection-management/connection-establishment) setting of the subscriber proxy
used for event delivery. Defining this QoS parameter is equivalent to invoking the `ice_connectionCached` proxy method.
The value is an integer: a positive value enables connection caching and `0` disables it.

## Locator Cache Timeout QoS for IceStorm

The QoS parameter `locatorCacheTimeout` affects the
[locator cache timeout](../../../runtime/locators/locator-semantics-for-clients) setting of the subscriber proxy used
for event delivery. Defining this QoS parameter is equivalent to invoking the `ice_locatorCacheTimeout` proxy method.
The value is an integer number of seconds: `0` disables locator caching, and a negative value caches endpoints
indefinitely.

## IceStorm QoS Example

The Slice type `IceStorm::QoS` is defined as a `dictionary` whose key and value types are both `string`, therefore the
QoS parameter name and value are both represented as strings. The code we presented in our earlier
[subscriber example](../using-icestorm/implementing-an-icestorm-subscriber) used an empty dictionary for the QoS
argument, meaning default values are used. The C++ and Java examples shown below illustrate how to set the `reliability`
parameter to `ordered`.

Here is the C++ example:

```cpp
IceStorm::QoS qos;
qos["reliability"] = "ordered";
topic->subscribeAndGetPublisher(qos, proxy->ice_twoway());
```

Here is the Java example:

```java
java.util.Map<String, String> qos = new java.util.HashMap<>();
qos.put("reliability", "ordered");
topic.subscribeAndGetPublisher(qos, proxy.ice_twoway());
```

## See Also

- [IceGrid](../../icegrid)
- [Implementing an IceStorm Subscriber](../using-icestorm/implementing-an-icestorm-subscriber)
- [IceStorm Delivery Modes](../icestorm-delivery-modes)
- [Object Identity](../../../runtime/object-identity)
