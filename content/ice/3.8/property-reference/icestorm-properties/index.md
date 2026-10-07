---
title: IceStorm.*
---

[IceStorm](../../services/icestorm) is an IceBox service that you can install using any name you like. For example:

```config
IceBox.Service.DataFeed=IceStormService,...
```

Nevertheless, we recommend you use `IceStorm` as service name, as in the example below:

```config
IceBox.Service.IceStorm=IceStormService,...
```

{% callout type="warning" %}

As of Ice 3.8, the properties for IceStorm use the `IceStorm` prefix, as shown on this page. In previous versions of
Ice, the IceStorm properties were prefixed by the service name as specified by the `IceBox.Service.name` property.

{% /callout %}

## IceStorm.Discard.Interval

{% synopsis %}

`IceStorm.Discard.Interval=num`

{% /synopsis %}

{% description %}

When IceStorm fails to deliver an event to a subscriber, it considers this subscriber non-functional and stops delivery
attempts to that subscriber for `num` seconds before trying to forward events to that subscriber again. Events published
during this interval are not queued for this subscriber: IceStorm discards them, and the subscriber never receives them.

This interval applies only when the subscriber's `retryCount` QoS setting allows further retries — a value of `-1`, or a
positive value with retries remaining. With the default `retryCount` of `0`, IceStorm removes the subscriber instead.
See [Retry Count QoS for IceStorm](../../services/icestorm/icestorm-quality-of-service) for a complete description of
how IceStorm handles delivery failures.

The default value of this property is 60 seconds.

{% /description %}

## IceStorm.Election.ElectionTimeout

{% synopsis %}

`IceStorm.Election.ElectionTimeout=num`

{% /synopsis %}

{% description %}

This property is used by a [replicated IceStorm deployment](../../services/icestorm/highly-available-icestorm). It
specifies the interval in seconds at which a coordinator attempts to form larger groups of replicas. If not defined, the
default value is 10.

{% /description %}

## IceStorm.Election.MasterTimeout

{% synopsis %}

`IceStorm.Election.MasterTimeout=num`

{% /synopsis %}

{% description %}

This property is used by a [replicated IceStorm deployment](../../services/icestorm/highly-available-icestorm). It
specifies the interval in seconds at which a slave checks the status of the coordinator. If not defined, the default
value is 10.

{% /description %}

## IceStorm.Election.ResponseTimeout

{% synopsis %}

`IceStorm.Election.ResponseTimeout=num`

{% /synopsis %}

{% description %}

This property is used by a [replicated IceStorm deployment](../../services/icestorm/highly-available-icestorm). It
specifies the interval in seconds that a replica waits for replies to an invitation to form a larger group. Lower
priority replicas wait for intervals inversely proportional to the maximum priority:

```text
ResponseTimeout + ResponseTimeout * (max - pri)
```

If not defined, the default value is 10.

{% /description %}

## IceStorm.Flush.Timeout

{% synopsis %}

`IceStorm.Flush.Timeout=num`

{% /synopsis %}

{% description %}

Defines the interval in milliseconds with which events are sent to
[batch subscribers](../../services/icestorm/icestorm-delivery-modes). The default is 1000ms.

{% /description %}

## IceStorm.InstanceName

{% synopsis %}

`IceStorm.InstanceName=name`

{% /synopsis %}

{% description %}

Specifies the identity category of the [objects](../../services/icestorm/configuring-icestorm) hosted by the IceStorm
object adapters, except the finder object, whose identity is always `IceStorm/Finder`. If not specified, the default
identity category is `IceStorm`.

{% /description %}

## IceStorm.LMDB.MapSize

{% synopsis %}

`IceStorm.LMDB.MapSize=num`

{% /synopsis %}

{% description %}

Specifies the map size for the IceStorm [LMDB](http://www.lmdb.tech/doc/) database environment. The value is specified
in megabytes. If not set, IceStorm uses a system-dependent default: 10 MB on Windows, and 100 MB on other platforms.

{% /description %}

## IceStorm.LMDB.Path

{% synopsis %}

`IceStorm.LMDB.Path=dir`

{% /synopsis %}

{% description %}

Specifies the path to the LMDB database environment of this IceStorm service. If not specified, the default value is
`IceStorm`. This directory must exist when IceStorm starts up unless IceStorm is in [transient mode](./).

{% /description %}

## IceStorm.Node._AdapterProperty_

{% synopsis %}

`IceStorm.Node.AdapterProperty=value`

{% /synopsis %}

{% description %}

In a [replicated deployment](../../services/icestorm/highly-available-icestorm), IceStorm uses the adapter name
`IceStorm.Node` for the replica node's object adapter. Therefore, [adapter properties](../object-adapter-properties) can
be used to configure this adapter.

{% /description %}

## IceStorm.NodeId

{% synopsis %}

`IceStorm.NodeId=value`

{% /synopsis %}

{% description %}

Specifies the node ID of an IceStorm [replica](../../services/icestorm/highly-available-icestorm), where `value` is a
non-negative integer. Node IDs must be unique, but they need not be contiguous or start at 0. The node ID is also used
as the replica's priority, such that a larger value assigns higher priority to the replica. The replica with the highest
priority becomes the coordinator of its group. This property must be defined for each replica. The default value is
`-1`, which disables replication.

A replicated deployment requires at least three replicas.

{% /description %}

## IceStorm.Nodes._id_

{% synopsis %}

`IceStorm.Nodes.id=value`

{% /synopsis %}

{% description %}

This property is used for a manual deployment of
[highly available IceStorm](../../services/icestorm/configuring-icestorm), in which each of the replicas must be
explicitly configured with the proxies of all other replicas. The value is a proxy for the replica with the given node
`id`. A replica's object identity has the form `instance-name/nodeid`, such as `DemoIceStorm/node2`.

{% /description %}

## IceStorm.Publish._AdapterProperty_

{% synopsis %}

`IceStorm.Publish.AdapterProperty=value`

{% /synopsis %}

{% description %}

IceStorm uses the adapter name `IceStorm.Publish` for the object adapter that processes incoming requests from
publishers. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this adapter.

{% /description %}

## IceStorm.ReplicatedPublishEndpoints

{% synopsis %}

`IceStorm.ReplicatedPublishEndpoints=value`

{% /synopsis %}

{% description %}

This property is used for a manual deployment of
[highly available IceStorm](../../services/icestorm/configuring-icestorm). It specifies the set of endpoints returned
for the publisher proxy returned from `IceStorm::Topic::getPublisher`. This property takes effect only when
`IceStorm.TopicManager.AdapterId` is not set.

If this property is not defined, the publisher proxy returned by a topic instance points directly at that replica and,
should the replica become unavailable, publishers will not transparently failover to other replicas.

{% /description %}

## IceStorm.ReplicatedTopicManagerEndpoints

{% synopsis %}

`IceStorm.ReplicatedTopicManagerEndpoints=value`

{% /synopsis %}

{% description %}

This property is used for a manual deployment of
[highly available IceStorm](../../services/icestorm/configuring-icestorm). It specifies the set of endpoints used in
proxies that refer to a replicated topic. This set of endpoints should contain the endpoints of each IceStorm replica.
This property takes effect only when `IceStorm.TopicManager.AdapterId` is not set.

For example, the operation `IceStorm::TopicManager::create` returns a proxy that contains this set of endpoints.

{% /description %}

## IceStorm.Send.Timeout

{% synopsis %}

`IceStorm.Send.Timeout=num`

{% /synopsis %}

{% description %}

Specifies the invocation timeout in milliseconds that IceStorm applies when it forwards events to subscribers. For
oneway and batch subscribers, the timeout covers connecting to the subscriber and sending the event; for twoway
subscribers, it also covers waiting for the reply. When forwarding an event does not complete within `num` milliseconds,
IceStorm handles the timeout according to the subscriber's `retryCount` QoS setting, as described under
[IceStorm.Discard.Interval](#icestorm.discard.interval). The default value is `60000`. `-1` disables the timeout.

{% /description %}

## IceStorm.Send.QueueSizeMax

{% synopsis %}

`IceStorm.Send.QueueSizeMax=num`

{% /synopsis %}

{% description %}

The value of this property determines how many events can be queued for a subscriber by IceStorm. When the maximum size
is reached, IceStorm drops the oldest events or removes the subscriber, as selected by
[IceStorm.Send.QueueSizeMaxPolicy](#icestorm.send.queuesizemaxpolicy). `num` must be a positive value, or `-1` for an
unbounded queue. The default value is `-1`.

{% /description %}

## IceStorm.Send.QueueSizeMaxPolicy

{% synopsis %}

`IceStorm.Send.QueueSizeMaxPolicy=RemoveSubscriber|DropEvents`

{% /synopsis %}

{% description %}

The value of this property specifies how IceStorm will behave if the maximum queue size is reached for a subscriber. If
set to `RemoveSubscriber`, IceStorm will remove the subscriber as soon as the limit is reached. If set to `DropEvents`,
older events will be removed to make room for new events. The default value is `RemoveSubscriber`.

{% /description %}

## IceStorm.TopicManager._AdapterProperty_

{% synopsis %}

`IceStorm.TopicManager.AdapterProperty=value`

{% /synopsis %}

{% description %}

IceStorm uses the adapter name `IceStorm.TopicManager` for the topic manager's object adapter. Therefore,
[adapter properties](../object-adapter-properties) can be used to configure this adapter.

{% /description %}

## IceStorm.Trace.Election

{% synopsis %}

`IceStorm.Trace.Election=num`

{% /synopsis %}

{% description %}

Trace activity related to elections:

| Value | Description                  |
| ----- | ---------------------------- |
| 0     | No election trace (default). |
| 1     | Trace election activity.     |

{% /description %}

## IceStorm.Trace.Replication

{% synopsis %}

`IceStorm.Trace.Replication=num`

{% /synopsis %}

{% description %}

Trace activity related to replication:

| Value | Description                     |
| ----- | ------------------------------- |
| 0     | No replication trace (default). |
| 1     | Trace replication activity.     |

{% /description %}

## IceStorm.Trace.Subscriber

{% synopsis %}

`IceStorm.Trace.Subscriber=num`

{% /synopsis %}

{% description %}

The subscriber trace level:

| Value | Description                                                                                                                                                                              |
| ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | No subscriber trace (default).                                                                                                                                                           |
| 1     | Trace topic diagnostic information on subscription and unsubscription.                                                                                                                   |
| 2     | Like 1, but more verbose, including state transitions for a subscriber (such as going offline after a temporary network failure, and going online again after a successful retry, etc.). |

{% /description %}

## IceStorm.Trace.Topic

{% synopsis %}

`IceStorm.Trace.Topic=num`

{% /synopsis %}

{% description %}

The topic trace level:

| Value | Description                                                                            |
| ----- | -------------------------------------------------------------------------------------- |
| 0     | No topic trace (default).                                                              |
| 1     | Trace topic links, subscription, and unsubscription.                                   |
| 2     | Like 1, but more verbose, including QoS information, and other diagnostic information. |

{% /description %}

## IceStorm.Trace.TopicManager

{% synopsis %}

`IceStorm.Trace.TopicManager=num`

{% /synopsis %}

{% description %}

The topic manager trace level:

| Value | Description                                                      |
| ----- | ---------------------------------------------------------------- |
| 0     | No topic manager trace (default).                                |
| 1     | Trace topic creation, topic loading, and replica initialization. |
| 2     | Like 1, but also trace the endpoints of each subscriber.         |

{% /description %}

## IceStorm.Transient

{% synopsis %}

`IceStorm.Transient=num`

{% /synopsis %}

{% description %}

If `num` is a value greater than zero, IceStorm runs in a fully transient mode in which no database is required.
Replication is not supported in this mode. If not defined, the default value is zero.

{% /description %}
