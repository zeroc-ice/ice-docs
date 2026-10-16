---
title: IceStorm Concepts
---

IceStorm distributes messages from publishers to subscribers through named topics: a publisher sends a message to a
topic, and IceStorm forwards it to the topic's subscribers.

## Topics and Messages

A topic is a named channel. An IceStorm service hosts any number of topics, which applications create at run time, and
each topic can have multiple publishers and subscribers.

A message is an invocation of a Slice operation: the operation name identifies the kind of message, and the parameters
carry its data. The publishers and subscribers of a topic agree on a Slice interface for its messages. For example, the
weather application uses the `WeatherStation` interface, and each call to `report` is a message:

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

IceStorm forwards messages without checking their types, so the interface is a contract among the applications: the
topic determines where a message goes, and the interface determines what it contains.

## Publishing and Subscribing

A publisher calls `getPublisher` on the topic to obtain a proxy to the topic's
[publisher object](../using-icestorm/using-an-icestorm-publisher-object), and sends a message by invoking an operation
on this proxy.

A subscriber registers a proxy to an Ice object that implements the topic's interface, by calling
`subscribeAndGetPublisher` on the topic. IceStorm pushes each message to the subscriber as it arrives, and the
subscriber receives it as a regular dispatch of the operation; subscribers cannot poll for messages.

## Message Delivery

A message is unidirectional: its operation returns `void`, has no out-parameters and declares no user exceptions, so a
publisher receives no results from the subscribers.

A publisher can send messages to IceStorm with oneway or twoway invocations. A twoway invocation returns once IceStorm
has accepted the message for forwarding, whether or not the subscribers have received it yet.

IceStorm forwards messages to each subscriber with the invocation mode of the proxy the subscriber registered, as
described in [IceStorm Delivery Modes](../icestorm-delivery-modes).

## Quality of Service and Subscriber Failures

Each subscriber can set [quality of service](../icestorm-quality-of-service) (QoS) parameters that control its delivery,
including message ordering and the handling of delivery failures.

By default, IceStorm removes a subscriber when a delivery fails with an Ice run-time exception, for example when
IceStorm cannot connect to the subscriber's endpoints. The `retryCount` parameter sets how many consecutive transient
failures IceStorm tolerates before it removes the subscriber; a
[hard failure](../icestorm-quality-of-service#hard-failures), such as `Ice::ObjectNotExistException` when the
subscriber's servant is gone, removes the subscriber regardless of `retryCount`. While a failing subscriber is retained,
IceStorm discards the messages for this subscriber until the
[IceStorm.Discard.Interval](../../../property-reference/icestorm-properties#icestorm.discard.interval) period ends:
retries extend the subscription, and each message reaches only the subscribers IceStorm can deliver it to when it
forwards the message.

## Persistence

By default, IceStorm stores its topics, links and subscriptions in a database, so they survive a restart of the service.
IceStorm queues messages in memory only while forwarding them: a subscriber receives only the messages published while
it is subscribed, and IceStorm discards each message once it has forwarded it to the current subscribers.

In transient mode, IceStorm uses no database: its topics, links and subscriptions last only until the service stops, and
replication is unavailable.

## Topic Federation

[Federation](../topic-federation) links topics, so that the messages published on one topic also reach the subscribers
of other topics. A link goes from a source topic to a target topic, and has a cost that can restrict which messages
IceStorm forwards on it.

A topic that receives a message over a link delivers the message to its subscribers but does not forward it on its own
links: messages propagate at most one hop from the originating topic.

The following figure presents an example of topic federation. Topic T1 has links to T2 and T3, as indicated by the
dotted arrows. Solid arrows show publishers sending messages to topics and topics delivering messages to subscribers.
The subscribers S1 and S2 receive all messages published on T2, as well as those published on T1. Subscriber S3 receives
messages only from T1, and S4 receives messages from both T3 and T1.

![Publisher P1 publishes to T2, P2 to T1, and P3 to T3. T1 has dotted links to T2 and T3. Solid arrows show delivery from publishers to topics and from T1 to S3, T2 to S1 and S2, and T3 to S4.](/images/ice/3.8/icestorm-concepts/topic-federation.svg)

A subscriber of both T2 and T3 receives each message published on T1 twice, once through each link.

## Replication

A [replicated](../highly-available-icestorm) IceStorm service keeps topics and subscriptions available when a replica
fails. The replicas share their topics, links and subscriptions, and each replica forwards the messages published to it:
a message that a replica has accepted is lost if this replica fails before forwarding it.

## See Also

- [Using IceStorm](../using-icestorm)
- [IceStorm Delivery Modes](../icestorm-delivery-modes)
- [IceStorm Quality of Service](../icestorm-quality-of-service)
- [Topic Federation](../topic-federation)
- [Configuring IceStorm](../configuring-icestorm)
