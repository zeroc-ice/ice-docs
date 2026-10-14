---
title: Configuring IceStorm
---

IceStorm runs as an [IceBox](../../icebox) service. This page covers the properties you set to deploy IceStorm and its
clients; [IceStorm Properties](../../../property-reference/icestorm-properties) describes all of them.

## IceStorm Server Configuration

The first step is configuring IceBox to run the IceStorm service:

```config
IceBox.Service.IceStorm=IceStormService,38:createIceStorm --Ice.Config=config.service
```

The IceStorm service itself is configured by the properties in the `config.service` file, which might look as follows
for a non-replicated service:

```config
IceStorm.LMDB.Path=db
IceStorm.TopicManager.Endpoints=tcp -p 9999
IceStorm.Publish.Endpoints=tcp -p 10000
```

IceStorm keeps its persistent state in an [LMDB](https://www.symas.com/lmdb.php) database, and the first property sets
the directory of this database: `db`, which must exist in the current working directory before the service starts. In
[transient mode](../../../property-reference/icestorm-properties), IceStorm keeps no database and ignores this property.

The last two properties set the endpoints of the two IceStorm object adapters. `IceStorm.TopicManager.Endpoints` sets
the endpoints of the adapter that hosts the topic manager and the topic objects; these endpoints must use a
connection-oriented transport such as TCP or SSL. `IceStorm.Publish.Endpoints` sets the endpoints of the adapter that
hosts the [publisher objects](../using-icestorm/using-an-icestorm-publisher-object). The publisher objects have their
own adapter because, unlike the topic manager, they can accept events over UDP. A publisher that sends events with a
datagram proxy gets the semantics of UDP: an event can be lost, duplicated, or delivered out of order.

To deploy a non-replicated IceStorm service with IceGrid, use the `IceStorm` server or service template in the
`config/templates.xml` file. These templates accept the `instance-name`, `topic-manager-endpoints`, `publish-endpoints`
and `flush-timeout` parameters described [below](#icegrid-deployment), and register the `instance-name/TopicManager`
well-known object with the `IceStorm.TopicManager` adapter.

## Deploying IceStorm Replicas

There are two ways of deploying IceStorm in its [highly available](../highly-available-icestorm) (replicated) mode. In
both cases, adding another replica requires that all active replicas be stopped while their configurations are updated;
it is not possible to add a replica while replication is running.

To remove a replica, stop all replicas and alter the configuration as necessary. You must be careful not to remove a
replica if it has the latest database state. This situation will never occur during normal operation since the database
state of all replicas is identical. However, in the event of a crash it is possible for a coordinator to have later
database state than all replicas. The safest approach is to verify that all replicas are active prior to stopping them.
You can do this using the [icestormadmin](../icestorm-administration) utility by checking that all replicas are in the
`Normal` state.

### IceGrid Deployment

[IceGrid](../../icegrid) is a convenient way of deploying IceStorm replicas, which use IceGrid
[replica groups](../../icegrid/object-adapter-replication) for their adapters. The `config/templates.xml` file in the
Ice distribution provides two `IceStorm-HA` templates for this deployment: a service template that configures one
IceStorm replica, and a server template that creates an IceBox server named `${instance-name}${node-id}` hosting a
single instance of this service. To use them, configure the IceGrid registry with this file as its
[default templates](../../icegrid/icegrid-templates) and import them into your application, or copy them into your
application descriptor. Both templates accept the following parameters:

| Parameter                     | Description                                                                                                                |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `instance-name`               | The IceStorm [instance name](../../../property-reference/icestorm-properties). The default is `${application}.IceStorm`.   |
| `node-id`                     | The replica's [node ID](../../../property-reference/icestorm-properties). Required.                                        |
| `topic-manager-replica-group` | The replica group of the `IceStorm.TopicManager` adapter. Required.                                                        |
| `publish-replica-group`       | The replica group of the `IceStorm.Publish` adapter. Required; an empty value keeps the adapter out of any replica group.  |
| `topic-manager-endpoints`     | The endpoints of the `IceStorm.TopicManager` adapter. The default is `default`.                                            |
| `publish-endpoints`           | The endpoints of the `IceStorm.Publish` adapter. The default is `default`.                                                 |
| `node-endpoints`              | The endpoints of the `IceStorm.Node` adapter, which replicas use to communicate with each other. The default is `default`. |
| `flush-timeout`               | The value of [IceStorm.Flush.Timeout](../../../property-reference/icestorm-properties). The default is `1000`.             |

The application defines the two replica groups: one for the `IceStorm.Publish` adapters of the replicas, and another for
their `IceStorm.TopicManager` adapters. The topic manager replica group declares the well-known object
`instance-name/TopicManager`, which each replica uses to find the other replicas. The following application deploys
three replicas with the default instance name:

```xml
<icegrid>
    <application name="Weather" import-default-templates="true">
        <replica-group id="IceStorm-PublishReplicaGroup">
        </replica-group>

        <replica-group id="IceStorm-TopicManagerReplicaGroup">
            <object identity="Weather.IceStorm/TopicManager"
                    type="::IceStorm::TopicManager"/>
        </replica-group>

        <node name="node1">
            <server-instance template="IceStorm-HA" node-id="1"
                topic-manager-replica-group="IceStorm-TopicManagerReplicaGroup"
                publish-replica-group="IceStorm-PublishReplicaGroup"/>
        </node>
        <node name="node2">
            <server-instance template="IceStorm-HA" node-id="2"
                topic-manager-replica-group="IceStorm-TopicManagerReplicaGroup"
                publish-replica-group="IceStorm-PublishReplicaGroup"/>
        </node>
        <node name="node3">
            <server-instance template="IceStorm-HA" node-id="3"
                topic-manager-replica-group="IceStorm-TopicManagerReplicaGroup"
                publish-replica-group="IceStorm-PublishReplicaGroup"/>
        </node>
    </application>
</icegrid>
```

To rule out [transparent failover](../highly-available-icestorm#publisher-considerations-for-icestorm-replication) when
publishing, keep the `IceStorm.Publish` adapters out of any replica group: remove `IceStorm-PublishReplicaGroup` from
the deployment and set `publish-replica-group` to an empty value. The publisher proxies returned by the topics then
point to a single replica.

IceStorm requires at least three replicas, each with a unique node ID. A node ID can be any non-negative integer, and
the IDs need not be contiguous or start at 0. The node ID is also the replica's priority for
[coordinator elections](../highly-available-icestorm): a replica with a larger node ID has a higher priority.

If you don't use the `IceStorm-HA` templates, give each replica's IceStorm service the same adapters and properties as
the `IceStorm-HA` service template, where `${instance-name}` and `${node-id}` stand for the instance name and the
replica's node ID:

```xml
<adapter name="IceStorm.TopicManager"
    id="${instance-name}${node-id}.TopicManager"
    endpoints="tcp"
    replica-group="IceStorm-TopicManagerReplicaGroup"/>

<adapter name="IceStorm.Publish"
    id="${instance-name}${node-id}.Publish"
    endpoints="tcp"
    replica-group="IceStorm-PublishReplicaGroup"/>

<adapter name="IceStorm.Node"
    id="${instance-name}${node-id}.Node"
    endpoints="tcp"/>

<property name="IceStorm.LMDB.Path" value="${service.data}"/>
<property name="IceStorm.InstanceName" value="${instance-name}"/>
<property name="IceStorm.NodeId" value="${node-id}"/>
```

Build each adapter ID as shown: the instance name, the node ID, then `.TopicManager`, `.Publish` or `.Node`. IceStorm
finds the other replicas through the `instance-name/TopicManager` replica group and reads each replica's node ID from
its adapter ID.

### Manual Deployment

You can also deploy IceStorm replicas without IceGrid, although it requires more manual configuration; an IceGrid
deployment is simpler to maintain.

The first step is defining the set of node proxies using properties of the form
[IceStorm.Nodes._id_](../../../property-reference/icestorm-properties#icestorm.nodes.id). These proxies allow replicas
to contact each other; the object identity of each node has the instance name as its category, and `node` followed by
the node ID as its name, such as `IceStorm/node0`.

The node IDs can be any non-negative integers. Each replica must have a unique node ID, but the IDs need not be
contiguous or start at 0: it is fine to leave gaps, for example after decommissioning a replica. The node ID is also the
replica's priority for [coordinator elections](../highly-available-icestorm): a replica with a larger node ID has a
higher priority.

For example, assuming we have three replicas with the identifiers 0, 1, 2, we can configure the proxies as shown below:

```config
IceStorm.Nodes.0=IceStorm/node0:tcp -p 13000
IceStorm.Nodes.1=IceStorm/node1:tcp -p 13010
IceStorm.Nodes.2=IceStorm/node2:tcp -p 13020
```

These properties must be defined in each replica. Additionally, each replica must define its node ID, as well as the
node's endpoints. For example, we can configure node 0 as follows:

```config
IceStorm.NodeId=0
IceStorm.Node.Endpoints=tcp -p 13000
```

The endpoints for each replica and ID must match the proxies configured in the
[IceStorm.Nodes._id_](../../../property-reference/icestorm-properties#icestorm.nodes.id) properties.

Two additional properties allow you to configure replicated endpoints:

- [IceStorm.ReplicatedTopicManagerEndpoints](../../../property-reference/icestorm-properties) Defines the endpoints
  contained in proxies returned by the topic manager.

- [IceStorm.ReplicatedPublishEndpoints](../../../property-reference/icestorm-properties) Defines the endpoints contained
  in the publisher proxy returned by the topic.

For example, suppose we configure three replicas:

```config
# on host replica0
IceStorm.NodeId=0
IceStorm.TopicManager.Endpoints=tcp -p 10000
IceStorm.Publish.Endpoints=tcp -p 10001

# on host replica1
IceStorm.NodeId=1
IceStorm.TopicManager.Endpoints=tcp -p 10010
IceStorm.Publish.Endpoints=tcp -p 10011

# on host replica2
IceStorm.NodeId=2
IceStorm.TopicManager.Endpoints=tcp -p 10020
IceStorm.Publish.Endpoints=tcp -p 10021
```

Each replica should also define these properties:

```config
IceStorm.ReplicatedPublishEndpoints=tcp -h replica0 -p 10001:tcp -h replica1 -p 10011:tcp -h replica2 -p 10021
IceStorm.ReplicatedTopicManagerEndpoints=tcp -h replica0 -p 10000:tcp -h replica1 -p 10010:tcp -h replica2 -p 10020
```

To rule out [transparent failover](../highly-available-icestorm#publisher-considerations-for-icestorm-replication) when
publishing, leave `IceStorm.ReplicatedPublishEndpoints` unset: the publisher proxies returned by the topics then point
to a single replica.

## IceStorm Client Configuration

A client reaches IceStorm through a proxy for its topic manager. Without IceGrid, this is a direct proxy with an
endpoint of the `IceStorm.TopicManager` adapter, which the client application configures with a property of its own,
such as:

```config
TopicManager.Proxy=IceStorm/TopicManager:tcp -h icestormhost -p 9999
```

The identity of the topic manager is `IceStorm/TopicManager` by default. When you run several IceStorm services, give
each one its own [IceStorm.InstanceName](../../../property-reference/icestorm-properties): this property sets the
category of the topic manager's identity, so a service configured with `IceStorm.InstanceName=Measurement` has the topic
manager `Measurement/TopicManager`, and its clients use this identity in their proxies.

With IceGrid, the topic manager is the well-known object `instance-name/TopicManager`, declared by the `IceStorm`
template or, for replicas, by the topic manager replica group, and a client uses an indirect proxy such as
`Weather.IceStorm/TopicManager`.

IceStorm also hosts an object with the identity `IceStorm/Finder`, described in the next section. This identity does not
depend on `IceStorm.InstanceName`.

## Using the IceStorm `Finder` Interface

IceStorm supports the `IceStorm::Finder` interface:

```slice
module IceStorm
{
    interface Finder
    {
        TopicManager* getTopicManager();
    }
}
```

An object supporting this interface is available with the identity `IceStorm/Finder` on the service's topic manager
endpoint. By knowing the host and port of this endpoint, a client can discover the topic manager's proxy at runtime with
a call to `getTopicManager`:

```cpp
IceStorm::FinderPrx
    finder{communicator, "IceStorm/Finder:tcp -h icestormhost -p 9999"};

auto topicManager = finder->getTopicManager();
```

## See Also

- [IceStorm Properties](../../../property-reference/icestorm-properties)
- [IceBox](../../icebox)
- [IceGrid](../../icegrid)
- [The Ice Threading Model](../../../runtime/threading-model)
- [Object Adapter Replication](../../icegrid/object-adapter-replication)
- [IceStorm Administration](../icestorm-administration)
- [Using an IceStorm Publisher Object](../using-icestorm/using-an-icestorm-publisher-object)
- [Highly Available IceStorm](../highly-available-icestorm)
