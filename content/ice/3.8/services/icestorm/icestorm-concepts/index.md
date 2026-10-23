---
title: IceStorm Concepts
sidebarLabel: Concepts
---

IceStorm distributes events from publishers to subscribers through named topics: a publisher publishes an event on a
topic, and IceStorm forwards it to the topic's subscribers.

## Topics and Events

A topic is a named channel. An IceStorm service hosts any number of topics, and each topic can have multiple publishers
and subscribers.

An event is a call to an operation of a Slice interface that the publishers and subscribers of a topic agree on: the
publisher makes the call once, and IceStorm makes the same call on each subscriber. For example, the sensors of the
weather application publish their readings by calling `report` on the `WeatherStation` interface, and each weather
station receives the same `report` call:

```slice
module ClearSky
{
    class AtmosphericConditions
    {
        double temperature;
        double humidity;
    }

    interface WeatherStation
    {
        void report(string sensorId, string timeStamp, AtmosphericConditions reading);
    }
}
```

## Publishing and Subscribing

A publisher calls `getPublisher` on the topic to obtain a proxy to the topic's
[publisher object](../using-icestorm/using-an-icestorm-publisher-object), and publishes an event by invoking an
operation on this proxy.

A subscriber is an Ice object that implements the topic's interface. An application, often the server that hosts this
object, subscribes it to the topic by calling `subscribeAndGetPublisher` with a proxy to the object. IceStorm then makes
each event's call on the subscriber.

## Event Delivery

An event is unidirectional: its operation returns `void`, has no out-parameters and declares no user exceptions, so a
publisher receives no results from the subscribers.

A publisher can publish events with oneway or twoway invocations. A twoway invocation returns once IceStorm has accepted
the event for forwarding.

## Quality of Service and Subscriber Failures

Each subscriber can set [quality of service](../icestorm-quality-of-service) (QoS) parameters that control the delivery
of its events, including their ordering and what happens when a delivery fails.

By default, IceStorm removes a subscriber when a delivery to it fails. The `retryCount` parameter keeps the subscription
through a number of consecutive transient failures; the subscriber does not receive the events published while it is
unreachable. See [Retry Count QoS for IceStorm](../icestorm-quality-of-service#retry-count-qos-for-icestorm).

## Persistence

By default, IceStorm stores its topics, links and subscriptions in a database, so they survive a restart of the service.
IceStorm queues events in memory only while forwarding them: a subscriber receives only the events published while it is
subscribed, and IceStorm discards each event once it has forwarded it to the current subscribers.

In transient mode, IceStorm uses no database: its topics, links and subscriptions last only until the service stops, and
replication is unavailable.

## Topic Federation

[Federation](../topic-federation) links topics, so that the events published on one topic also reach the subscribers of
other topics. A link goes from a source topic to a target topic, and has a cost that can restrict which events IceStorm
forwards on it.

A topic that receives an event over a link delivers the event to its subscribers but does not forward it on its own
links: events propagate at most one hop from the originating topic.

The following figure presents an example of topic federation. Topic T1 has links to T2 and T3, as indicated by the
dotted arrows. Solid arrows show publishers publishing events on topics and topics delivering events to subscribers. The
subscribers S1 and S2 receive all events published on T2, as well as those published on T1. Subscriber S3 receives
events only from T1, and S4 receives events from both T3 and T1.

![Publisher P1 publishes to T2, P2 to T1, and P3 to T3. T1 has dotted links to T2 and T3. Solid arrows show delivery from publishers to topics and from T1 to S3, T2 to S1 and S2, and T3 to S4.](/images/ice/3.8/icestorm-concepts/topic-federation.svg)

A subscriber of both T2 and T3 receives each event published on T1 twice, once through each link.

## Replication

A [replicated](../highly-available-icestorm) IceStorm service keeps topics and subscriptions available when a replica
fails. The replicas share their topics, links and subscriptions, and each replica forwards the events published to it:
an event that a replica has accepted is lost if this replica fails before forwarding it.

## See Also

- [Using IceStorm](../using-icestorm)
- [IceStorm Delivery Modes](../icestorm-delivery-modes)
- [IceStorm Quality of Service](../icestorm-quality-of-service)
- [Topic Federation](../topic-federation)
- [Configuring IceStorm](../configuring-icestorm)
