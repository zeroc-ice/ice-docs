---
id: icestorm-properties
title: IceStorm.*
---

[IceStorm](../icestorm) is an IceBox service that you can install using any name you like. For example:

```
IceBox.Service.DataFeed=IceStormService,...
```

Nevertheless, we recommend you use `IceStorm` as service name, as in the example below:

```
IceBox.Service.IceStorm=IceStormService,...
```

{% callout type="warning" %}

As of Ice 3.8, the properties for IceStorm use the `IceStorm` prefix, as shown on this page. In previous versions of
Ice, the IceStorm properties were prefixed by the service name as specified by the `IceBox.Service.name` property.

{% /callout %}

# IceStorm.Discard.Interval

#### Synopsis

`IceStorm.Discard.Interval=num`

#### Description

When IceStorm fails to deliver an event to a subscriber, it considers this subscriber non-functional and stops delivery
attempts to that subscriber for `num` seconds before trying to forward events to that subscriber again. Events published
during this interval are not queued for this subscriber: IceStorm discards them, and the subscriber never receives them.

This interval applies only when the subscriber's `retryCount` QoS setting allows further retries — a value of `-1`, or a
positive value with retries remaining. With the default `retryCount` of `0`, IceStorm removes the subscriber instead.
See [Retry Count QoS for IceStorm](../icestorm-quality-of-service) for a complete description of how IceStorm handles
delivery failures.

The default value of this property is 60 seconds.

# IceStorm.Election.ElectionTimeout

#### Synopsis

`IceStorm.Election.ElectionTimeout=num`

#### Description

This property is used by a [replicated IceStorm deployment](../highly-available-icestorm). It specifies the interval in
seconds at which a coordinator attempts to form larger groups of replicas. If not defined, the default value is 10.

# IceStorm.Election.MasterTimeout

#### Synopsis

`IceStorm.Election.MasterTimeout=num`

#### Description

This property is used by a [replicated IceStorm deployment](../highly-available-icestorm). It specifies the interval in
seconds at which a slave checks the status of the coordinator. If not defined, the default value is 10.

# IceStorm.Election.ResponseTimeout

#### Synopsis

`IceStorm.Election.ResponseTimeout=num`

#### Description

This property is used by a [replicated IceStorm deployment](../highly-available-icestorm). It specifies the interval in
seconds that a replica waits for replies to an invitation to form a larger group. Lower priority replicas wait for
intervals inversely proportional to the maximum priority:

```
ResponseTimeout + ResponseTimeout * (max - pri)
```

If not defined, the default value is 10.

# IceStorm.Flush.Timeout

#### Synopsis

`IceStorm.Flush.Timeout=num`

#### Description

Defines the interval in milliseconds with which events are sent to [batch subscribers](../icestorm-delivery-modes). The
default is 1000ms.

# IceStorm.InstanceName

#### Synopsis

`IceStorm.InstanceName=name`

#### Description

Specifies an alternate identity category for all [objects](../configuring-icestorm) hosted by the IceStorm object
adapters. If not specified, the default identity category is `IceStorm`.

# IceStorm.LMDB.MapSize

#### Synopsis

`IceStorm.LMDB.MapSize=num`

#### Description

Specifies the map size for the IceStorm [LMDB](http://www.lmdb.tech/doc/) database environment. The value is specified
in megabytes. If not specified or set to 0, IceStorm uses a system-dependent default: 10 MB on Windows, and 100 MB on
other platforms.

# IceStorm.LMDB.Path

#### Synopsis

`IceStorm.LMDB.Path=dir`

#### Description

Specifies the path to the LMDB database environment of this IceStorm service. If not specified, the default value is
`IceStorm`. This directory must exist when IceStorm starts up unless IceStorm is in
[transient mode](../icestorm-properties).

# IceStorm.Node._AdapterProperty_

#### Synopsis

`IceStorm.Node.AdapterProperty=value`

#### Description

In a [replicated deployment](../highly-available-icestorm), IceStorm uses the adapter name `IceStorm.Node` for the
replica node's object adapter. Therefore, [adapter properties](../object-adapter-properties) can be used to configure
this adapter.

# IceStorm.NodeId

#### Synopsis

`IceStorm.NodeId=value`

#### Description

Specifies the node ID of an IceStorm [replica](../highly-available-icestorm), where `value` is a non-negative integer.
Node IDs must be unique, but they need not be contiguous or start at 0. The node ID is also used as the replica's
priority, such that a larger value assigns higher priority to the replica. The replica with the highest priority becomes
the coordinator of its group. This property must be defined for each replica.

# IceStorm.Nodes._id_

#### Synopsis

`IceStorm.Nodes.id=value`

#### Description

This property is used for a manual deployment of [highly available IceStorm](../configuring-icestorm), in which each of
the replicas must be explicitly configured with the proxies of all other replicas. The value is a proxy for the replica
with the given node `id`. A replica's object identity has the form `instance-name/nodeid`, such as `DemoIceStorm/node2`.

# IceStorm.Publish._AdapterProperty_

#### Synopsis

`IceStorm.Publish.AdapterProperty=value`

#### Description

IceStorm uses the adapter name `IceStorm.Publish` for the object adapter that processes incoming requests from
publishers. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this adapter.

# IceStorm.ReplicatedPublishEndpoints

#### Synopsis

`IceStorm.ReplicatedPublishEndpoints=value`

#### Description

This property is used for a manual deployment of [highly available IceStorm](../configuring-icestorm). It specifies the
set of endpoints returned for the publisher proxy returned from `IceStorm::Topic::getPublisher`.

If this property is not defined, the publisher proxy returned by a topic instance points directly at that replica and,
should the replica become unavailable, publishers will not transparently failover to other replicas.

# IceStorm.ReplicatedTopicManagerEndpoints

#### Synopsis

`IceStorm.ReplicatedTopicManagerEndpoints=value`

#### Description

This property is used for a manual deployment of [highly available IceStorm](../configuring-icestorm). It specifies the
set of endpoints used in proxies that refer to a replicated topic. This set of endpoints should contain the endpoints of
each IceStorm replica.

For example, the operation `IceStorm::TopicManager::create` returns a proxy that contains this set of endpoints.

# IceStorm.Send.Timeout

#### Synopsis

`IceStorm.Send.Timeout=num`

#### Description

IceStorm applies a send timeout when it forwards events to subscribers. The value of this property determines how long
IceStorm will wait for forwarding of an event to complete. If an event cannot be forwarded within `num` milliseconds,
the subscriber is considered dead and its subscription is cancelled. The default value is 60 seconds. Setting this
property to a negative value disables timeouts.

# IceStorm.Send.QueueSizeMax

#### Synopsis

`IceStorm.Send.QueueSizeMax=num`

#### Description

The value of this property determines how many events can be queued for a subscriber by IceStorm. When the maximum size
is reached, the old events will either be dropped or the subscriber will be removed. Setting this property to a negative
value specifies an infinite queue size. The default value is -1.

# IceStorm.Send.QueueSizeMaxPolicy

#### Synopsis

`IceStorm.Send.QueueSizePolicy=RemoveSubscriber|DropEvents`

#### Description

The value of this property specifies how IceStorm will behave if the maximum queue size is reached for a subscriber. If
set to `RemoveSubscriber`, IceStorm will remove the subscriber as soon as the limit is reached. If set to `DropEvents`,
older events will be removed to make room for new events. The default value is `RemoveSubscriber`.

# IceStorm.TopicManager._AdapterProperty_

#### Synopsis

`IceStorm.TopicManager.AdapterProperty=value`

#### Description

IceStorm uses the adapter name `IceStorm.TopicManager` for the topic manager's object adapter. Therefore,
[adapter properties](../object-adapter-properties) can be used to configure this adapter.

# IceStorm.Trace.Election

#### Synopsis

`IceStorm.Trace.Election=num`

#### Description

Trace activity related to elections:

| 0   | No election trace (default). |
| --- | ---------------------------- |
| 1   | Trace election activity.     |

# IceStorm.Trace.Replication

#### Synopsis

`IceStorm.Trace.Replication=num`

#### Description

Trace activity related to replication:

| 0   | No replication trace (default). |
| --- | ------------------------------- |
| 1   | Trace replication activity.     |

# IceStorm.Trace.Subscriber

#### Synopsis

`IceStorm.Trace.Subscriber=num`

#### Description

The subscriber trace level:

| 0   | No subscriber trace (default).                                                                                                                                                           |
| --- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Trace topic diagnostic information on subscription and unsubscription.                                                                                                                   |
| 2   | Like 1, but more verbose, including state transitions for a subscriber (such as going offline after a temporary network failure, and going online again after a successful retry, etc.). |

# IceStorm.Trace.Topic

#### Synopsis

`IceStorm.Trace.Topic=num`

#### Description

The topic trace level:

| 0   | No topic trace (default).                                                              |
| --- | -------------------------------------------------------------------------------------- |
| 1   | Trace topic links, subscription, and unsubscription.                                   |
| 2   | Like 1, but more verbose, including QoS information, and other diagnostic information. |

# IceStorm.Trace.TopicManager

#### Synopsis

`IceStorm.Trace.TopicManager=num`

#### Description

The topic manager trace level:

| 0   | No topic manager trace (default). |
| --- | --------------------------------- |
| 1   | Trace topic creation.             |

# IceStorm.Transient

#### Synopsis

`IceStorm.Transient=num`

#### Description

If `num` is a value greater than zero, IceStorm runs in a fully transient mode in which no database is required.
Replication is not supported in this mode. If not defined, the default value is zero.
