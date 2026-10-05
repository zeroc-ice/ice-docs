---
title: Configuring IceStorm
---

IceStorm is a relatively lightweight service in that it requires very little configuration and is implemented as an
[IceBox](../../icebox) service. The configuration properties supported by IceStorm are described in
[IceStorm Properties](../../../property-reference/icestorm-properties); some of them control diagnostic output and are
not discussed here.

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

IceStorm uses [LMDB](https://www.symas.com/mdb) to manage the service's persistent state, therefore the first property
specifies the path name of the LMDB database environment directory for the service. Here the directory `db` is used,
which must already exist in the current working directory. This property can be omitted when the service is running in
[transient mode](../../../property-reference/icestorm-properties).

The final two properties specify the endpoints used by the IceStorm object adapters. The `TopicManager` property
specifies the endpoints on which the `TopicManager` and `Topic` objects reside; these endpoints must use a
connection-oriented protocol such as TCP or SSL. The `Publish` property specifies the endpoint(s) used by topic
[publisher objects](../using-icestorm/using-an-icestorm-publisher-object); using a datagram endpoint in this property is
possible but carries additional risk.

IceStorm's default [thread pool](../../../runtime/threading-model) configuration is sufficient when the service is
running on a single CPU machine. On a host with multiple CPUs, you may be able to improve IceStorm's performance by
increasing the size of its client-side thread pool using the
[Ice.ThreadPool.Client.*](../../../property-reference/ice-threadpool-properties) properties, but the optimal number of
threads can only be determined with careful benchmarking.

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

[IceGrid](../../icegrid) is a convenient way of deploying IceStorm replicas. The term _replica_ is also used in the
context of IceGrid, specifically when referring to groups of object adapters that participate in
[replication](../../icegrid/object-adapter-replication). It is important to be aware of the distinction between IceStorm
replication and object adapter replication; IceStorm replication _uses_ object adapter replication when deployed with
IceGrid, but IceStorm does not _require_ object adapter replication as you will see below.

The `config/templates.xml` file in the Ice distribution provides two `IceStorm-HA` templates for this deployment: a
service template that configures one IceStorm replica, and a server template that creates an IceBox server named
`${instance-name}${node-id}` hosting a single instance of this service. To use them, configure the IceGrid registry with
this file as its [default templates](../../icegrid/icegrid-templates) and import them into your application, or copy
them into your application descriptor. Both templates accept the following parameters:

| Parameter                     | Description                                                                                                                                                   |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `instance-name`               | The IceStorm [instance name](../../../property-reference/icestorm-properties), which also prefixes the adapter IDs. The default is `${application}.IceStorm`. |
| `node-id`                     | The replica's [node ID](../../../property-reference/icestorm-properties). Required.                                                                           |
| `topic-manager-replica-group` | The replica group of the `IceStorm.TopicManager` adapter. Required.                                                                                           |
| `publish-replica-group`       | The replica group of the `IceStorm.Publish` adapter. Required; an empty value keeps the adapter out of any replica group.                                     |
| `topic-manager-endpoints`     | The endpoints of the `IceStorm.TopicManager` adapter. The default is `default`.                                                                               |
| `publish-endpoints`           | The endpoints of the `IceStorm.Publish` adapter. The default is `default`.                                                                                    |
| `node-endpoints`              | The endpoints of the `IceStorm.Node` adapter, which replicas use to communicate with each other. The default is `default`.                                    |
| `flush-timeout`               | The value of [IceStorm.Flush.Timeout](../../../property-reference/icestorm-properties). The default is `1000`.                                                |

The application defines the two replica groups: one for the publisher proxies, and another for the topics. The topic
manager replica group must register the well-known object `instance-name/TopicManager`, because each replica finds the
other replicas through this object. The following application deploys three replicas with the default instance name:

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

An application may not want [publisher proxies](../highly-available-icestorm) to contain multiple endpoints. In this
case, remove `IceStorm-PublishReplicaGroup` from the above deployment and set `publish-replica-group` to an empty value.

The node ID can be any non-negative integer. Each replica must have a unique node ID, but the IDs need not be contiguous
or start at 0. The node ID is also the replica's priority for [coordinator elections](../highly-available-icestorm): a
replica with a larger node ID has a higher priority.

If you write the descriptors yourself, configure each replica's IceStorm service with the adapters and properties that
the `IceStorm-HA` service template defines, as in this excerpt of a service template with `instance-name` and `node-id`
parameters:

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

The adapter and property names are fixed: IceStorm uses them regardless of the name of the IceBox service. IceStorm
replicas communicate with each other through the `IceStorm.Node` adapter, which does not belong to an adapter replica
group.

IceStorm derives the node ID of each replica from its adapter IDs, which the template builds as
`${instance-name}${node-id}.TopicManager` and `${instance-name}${node-id}.Node`. At startup, a replica asks the IceGrid
registry for the adapters of the replica group that hosts `instance-name/TopicManager`. The adapter ID of each of these
`IceStorm.TopicManager` adapters must start with the instance name and contain `.TopicManager`; IceStorm takes the first
sequence of digits after the instance name as the node ID, and reaches that replica's node through the adapter ID with
`.Node` in place of `.TopicManager`. The replica's own `IceStorm.Node` adapter ID must likewise equal its
`IceStorm.TopicManager` adapter ID with `.Node` in place of `.TopicManager`. The IceStorm service fails to start if an
adapter ID does not follow these rules, if the replicas it finds have fewer than three distinct node IDs, or if its own
`IceStorm.NodeId` is not one of them.

### Manual Deployment

You can also deploy IceStorm replicas without IceGrid, although it requires more manual configuration; an IceGrid
deployment is simpler to maintain.

The first step is defining the set of node proxies using properties of the form
[Nodes._id_](../../../property-reference/icestorm-properties). These proxies allow replicas to contact each other; the
object identity of each node has the instance name as its category, and `node` followed by the node ID as its name, such
as `IceStorm/node0`.

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

The endpoints for each replica and ID must match the proxies configured in the `Nodes.id` properties.

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

An application may not want [publisher proxies](../highly-available-icestorm) to contain multiple endpoints. In this
case you should remove the definition of the `ReplicatedPublishEndpoints` property from the above deployment.

## IceStorm Client Configuration

Clients of the service can define a proxy for the `TopicManager` object as follows:

```config
TopicManager.Proxy=IceStorm/TopicManager:tcp -p 9999
```

The name of the property is not relevant, but the endpoint must match that of the `IceStorm.TopicManager.Endpoints`
property, and the object identity must use the IceStorm [instance name](../../../property-reference/icestorm-properties)
as the category and `TopicManager` as the name.

## IceStorm Object Identities

IceStorm hosts a [well-known object](../../icegrid/well-known-objects) that implements the `IceStorm::TopicManager`
interface. The default identity of this object is `IceStorm/TopicManager`, as seen in the stringified proxy example
above. If an application requires the use of multiple IceStorm services, it's a good idea to assign unique identities to
their well-known objects by configuring the services with different values for the
[IceStorm.InstanceName](../../../property-reference/icestorm-properties) property, as shown in the following example:

```config
IceStorm.InstanceName=Measurement
```

This property changes the category of the object's identity, which becomes `Measurement/TopicManager`. The client's
configuration must also be changed to reflect the new identity:

```config
TopicManager.Proxy=Measurement/TopicManager:tcp -p 9999
```

IceStorm also hosts an object with the identity `IceStorm/Finder`, as described in the next section. This identity is
not affected by changes to `IceStorm.InstanceName`.

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
