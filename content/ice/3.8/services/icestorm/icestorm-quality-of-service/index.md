---
title: IceStorm Quality of Service
---

An IceStorm subscriber specifies Quality of Service (QoS) parameters at the time of subscription. The supported QoS
parameters are described in the sections below

## Reliability QoS for IceStorm

The QoS parameter `reliability` affects message delivery. The only legal values at this point are `ordered` and the
empty string. If not specified, the default value is the empty string (meaning not ordered).

The `ordered` reliability QoS requires a twoway subscriber proxy. If you specify this reliability QoS, IceStorm will
forward events in the order they are received but doesn't forward them immediately. Instead, IceStorm waits for the
reply from the forwarding of an event before forwarding the next event. This guarantees that the subscriber will process
the events in the same order as they were received even if its [thread pool](../thread-pool-design-considerations)
doesn't serialize incoming requests.

## Retry Count QoS for IceStorm

The QoS parameter `retryCount` determines how many _consecutive_ delivery failures IceStorm tolerates before it removes
a subscriber. A value of `-1` means IceStorm retries forever and never automatically removes a subscriber unless a hard
failure occurs (see Hard Failures below). A value of `0` means IceStorm never retries and immediately removes the
subscriber upon any failure. For positive values, IceStorm increments the subscriber's failure count on each failed
delivery attempt and removes the subscriber once this count exceeds `retryCount`. Linked topics always have a configured
retry count of `-1`. The default value of the `retryCount` parameter is `0`.

The failure count is not cumulative over the lifetime of the subscription: IceStorm resets it to zero after each
successful delivery to the subscriber. A subscriber is therefore removed only when `retryCount + 1` consecutive delivery
attempts fail with no successful delivery in between. For example, with a `retryCount` of `3`, a subscriber that
experiences occasional, isolated network failures is never removed, while a subscriber that remains unreachable for four
consecutive delivery attempts is removed.

A retry count of `-1` adds some resiliency to your IceStorm application by ignoring intermittent network failures such
as `ConnectionRefusedException`. However, there is also some risk inherent in using a retry count of `-1` because an
improperly configured subscriber may never be removed. For example, consider what happens when a subscriber registers
using a transient endpoint: if that subscriber happens to terminate and resubscribe with a different endpoint, IceStorm
will continue trying to deliver events to the subscriber at its old endpoint. IceStorm can only remove the subscriber if
it receives a hard error, and that is only possible when the subscriber is reachable.

To use a retry count of `-1` successfully, the subscriber can either register with a fixed endpoint, or use
[IceGrid](../icegrid) to take advantage of indirect proxies and automatic activation.

### Delivery Failures and Retries

When delivery to a subscriber fails with a transient error (such as a connection failure or a timeout) and the
subscriber's `retryCount` allows another attempt, IceStorm discards all events currently queued for this subscriber,
increments the subscriber's failure count, and places the subscriber offline for the number of seconds specified by the
[IceStorm.Discard.Interval](../icestorm-properties) property (60 seconds by default). While the subscriber is offline,
IceStorm discards any new events published on the topic instead of queueing them for this subscriber. Once the interval
has elapsed, the next published event puts the subscriber back online and delivery resumes, starting with that event.

As a result, a subscriber does not receive the events that were queued or published between the failure and the end of
the discard interval: a non-zero `retryCount` extends the lifetime of the subscription, but does not provide reliable
delivery. You can observe these subscriber state transitions by setting
[IceStorm.Trace.Subscriber](../icestorm-properties) to `2`.

### Hard Failures

Some failures indicate that the subscriber is permanently unusable. IceStorm removes the subscriber immediately when
they occur, regardless of the subscriber's `retryCount` setting:

- `Ice::ObjectNotExistException` — the subscriber is no longer registered in the target object adapter.
- `Ice::NotRegisteredException` — the subscriber's proxy is an indirect proxy that the configured locator can no longer
  resolve.
- `IceStorm::SendQueueSizeMaxReachedException` — the number of events queued for the subscriber reached
  [IceStorm.Send.QueueSizeMax](../icestorm-properties) and [IceStorm.Send.QueueSizeMaxPolicy](../icestorm-properties) is
  set to `RemoveSubscriber` (the default).

## Connection Caching QoS for IceStorm

The QoS parameter `connectionCached` affects the [connection caching](../connection-establishment) setting of the
subscriber proxy used for message delivery. Defining this QoS parameter is equivalent to invoking the
`ice_connectionCached` proxy method.

## Locator Cache Timeout QoS for IceStorm

The QoS parameter `locatorCacheTimeout` affects the [locator cache timeout](../locator-semantics-for-clients) setting of
the subscriber proxy used for message delivery. Defining this QoS parameter is equivalent to invoking the
`ice_locatorCacheTimeout` proxy method.

## IceStorm QoS Example

The Slice type `IceStorm::QoS` is defined as a `dictionary` whose key and value types are both `string`, therefore the
QoS parameter name and value are both represented as strings. The code we presented in our earlier
[subscriber example](../implementing-an-icestorm-subscriber) used an empty dictionary for the QoS argument, meaning
default values are used. The C++ and Java examples shown below illustrate how to set the `reliability` parameter to
`ordered`.

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

- [IceGrid](../icegrid)
- [Implementing an IceStorm Subscriber](../implementing-an-icestorm-subscriber)
- [IceStorm Delivery Modes](../icestorm-delivery-modes)
- [Object Identity](../object-identity)
