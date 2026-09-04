---
id: configuring-icestorm
title: Configuring IceStorm
---

IceStorm is a relatively lightweight service in that it requires very little configuration and is implemented as an
[IceBox](../icebox) service. The configuration properties supported by IceStorm are described in
[IceStorm Properties](../icestorm-properties); some of them control diagnostic output and are not discussed here.

# IceStorm Server Configuration

The first step is configuring IceBox to run the IceStorm service:

```
IceBox.Service.IceStorm=IceStormService,38:createIceStorm --Ice.Config=config.service
```

The IceStorm service itself is configured by the properties in the `config.service` file, which might look as follows
for a non-replicated service:

```
IceStorm.LMDB.Path=db
IceStorm.TopicManager.Endpoints=tcp -p 9999
IceStorm.Publish.Endpoints=tcp -p 10000
```

IceStorm uses [LMDB](https://www.symas.com/mdb) to manage the service's persistent state, therefore the first property
specifies the path name of the LMDB database environment directory for the service. Here the directory `db` is used,
which must already exist in the current working directory. This property can be omitted when the service is running in
[transient mode](../icestorm-properties).

The final two properties specify the endpoints used by the IceStorm object adapters. The `TopicManager` property
specifies the endpoints on which the `TopicManager` and `Topic` objects reside; these endpoints must use a
connection-oriented protocol such as TCP or SSL. The `Publish` property specifies the endpoint(s) used by topic
[publisher objects](../using-an-icestorm-publisher-object); using a datagram endpoint in this property is possible but
carries additional risk.

IceStorm's default [thread pool](../the-ice-threading-model) configuration is sufficient when the service is running on
a single CPU machine. On a host with multiple CPUs, you may be able to improve IceStorm's performance by increasing the
size of its client-side thread pool using the [Ice.ThreadPool.Client.*](../ice-threadpool-properties) properties, but
the optimal number of threads can only be determined with careful benchmarking.

# Deploying IceStorm Replicas

There are two ways of deploying IceStorm in its [highly available](../highly-available-icestorm) (replicated) mode. In
both cases, adding another replica requires that all active replicas be stopped while their configurations are updated;
it is not possible to add a replica while replication is running.

To remove a replica, stop all replicas and alter the configuration as necessary. You must be careful not to remove a
replica if it has the latest database state. This situation will never occur during normal operation since the database
state of all replicas is identical. However, in the event of a crash it is possible for a coordinator to have later
database state than all replicas. The safest approach is to verify that all replicas are active prior to stopping them.
You can do this using the [icestormadmin](../icestorm-administration) utility by checking that all replicas are in the
`Normal` state.

## IceGrid Deployment

[IceGrid](../icegrid) is a convenient way of deploying IceStorm replicas. The term _replica_ is also used in the context
of IceGrid, specifically when referring to groups of object adapters that participate in
[replication](../object-adapter-replication). It is important to be aware of the distinction between IceStorm
replication and object adapter replication; IceStorm replication _uses_ object adapter replication when deployed with
IceGrid, but IceStorm does not _require_ object adapter replication as you will see below.

An IceGrid [deployment](../using-icegrid-deployment) typically uses two adapter replica groups: one for the publisher
proxies, and another for the topics, as shown below:

```xml
<replica-group id="IceStorm-PublishReplicaGroup">
</replica-group>

<replica-group id="IceStorm-TopicManagerReplicaGroup">
    <object identity="IceStorm/TopicManager"
            type="::IceStorm::TopicManager"/>
</replica-group>
```

The object adapters are then configured to use these replica groups:

```xml
<adapter name="${service}.Publish"
    endpoints="tcp"
    replica-group="${instance-name}-PublishReplicaGroup"/>

<adapter name="${service}.TopicManager"
    endpoints="tcp"
    replica-group="${instance-name}-TopicManagerReplicaGroup"/>
```

An application may not want [publisher proxies](../highly-available-icestorm) to contain multiple endpoints. In this
case you should remove `PublishReplicaGroup` from the above deployment.

The next step is defining the endpoints for the adapter `Node`, which is used internally for communication with other
IceStorm replicas and is not part of an adapter replica group:

```xml
<adapter name="${service}.Node" endpoints="tcp"/>
```

Finally, you must define the node ID for each IceStorm replica using the [NodeId](../icestorm-properties) property:

```xml
<property name="${service}.NodeId" value="${index}"/>
```

The node ID can be any non-negative integer. Each replica must have a unique node ID, but the IDs need not be contiguous
or start at 0. The node ID is also the replica's priority for [coordinator elections](../highly-available-icestorm): a
replica with a larger node ID has a higher priority.

In addition, each server's ID must consist of the instance name followed by the replica's node ID, as in
`${instance-name}-${index}`: IceStorm identifies the replicas it discovers through the IceGrid registry by their server
IDs.

## Manual Deployment

You can also deploy IceStorm replicas without IceGrid, although it requires more manual configuration; an IceGrid
deployment is simpler to maintain.

The first step is defining the set of node proxies using properties of the form [Nodes._id_](../icestorm-properties).
These proxies allow replicas to contact each other; their object identities are composed using `instance-name/nodeid`.

The node IDs can be any non-negative integers. Each replica must have a unique node ID, but the IDs need not be
contiguous or start at 0: it is fine to leave gaps, for example after decommissioning a replica. The node ID is also the
replica's priority for [coordinator elections](../highly-available-icestorm): a replica with a larger node ID has a
higher priority.

For example, assuming we have three replicas with the identifiers 0, 1, 2, we can configure the proxies as shown below:

```
IceStorm.Nodes.0=IceStorm/node0:tcp -p 13000
IceStorm.Nodes.1=IceStorm/node1:tcp -p 13010
IceStorm.Nodes.2=IceStorm/node2:tcp -p 13020
```

These properties must be defined in each replica. Additionally, each replica must define its node ID, as well as the
node's endpoints. For example, we can configure node 0 as follows:

```
IceStorm.NodeId=0
IceStorm.Node.Endpoints=tcp -p 13000
```

The endpoints for each replica and ID must match the proxies configured in the `Nodes.id` properties.

Two additional properties allow you to configure replicated endpoints:

- [IceStorm.ReplicatedTopicManagerEndpoints](../icestorm-properties) Defines the endpoints contained in proxies returned
  by the topic manager.

- [IceStorm.ReplicatedPublishEndpoints](../icestorm-properties) Defines the endpoints contained in the publisher proxy
  returned by the topic.

For example, suppose we configure three replicas:

```
# on host replica0
IceStorm.NodeId=0
IceStorm.TopicManager.Endpoints=tcp -p 10000
IceStorm.Publish.Endpoints=tcp -p 10001

# on host replica1
IceStorm.NodeId=1
IceStorm.TopicManager.Endpoints=tcp -p 10010
IceStorm.Publish.Endpoints=tcp -p 10011

# on host replica2
IceStorm.NodeId=2
IceStorm.TopicManager.Endpoints=tcp -p 10020
IceStorm.Publish.Endpoints=tcp -p 10021
```

Each replica should also define these properties:

```
IceStorm.ReplicatedPublishEndpoints=tcp -h replica0 -p 10001:tcp -h replica1 -p 10011:tcp -h replica2 -p 10021
IceStorm.ReplicatedTopicManagerEndpoints=tcp -h replica0 -p 10000:tcp -h replica1 -p 10010:tcp -h replica2 -p 10020
```

An application may not want [publisher proxies](../highly-available-icestorm) to contain multiple endpoints. In this
case you should remove the definition of the `ReplicatedPublishEndpoints` property from the above deployment.

# IceStorm Client Configuration

Clients of the service can define a proxy for the `TopicManager` object as follows:

```
TopicManager.Proxy=IceStorm/TopicManager:tcp -p 9999
```

The name of the property is not relevant, but the endpoint must match that of the `service.TopicManager.Endpoints`
property, and the object identity must use the IceStorm [instance name](../icestorm-properties) as the category and
`TopicManager` as the name.

# IceStorm Object Identities

IceStorm hosts a [well-known object](../well-known-objects) that implements the `IceStorm::TopicManager` interface. The
default identity of this object is `IceStorm/TopicManager`, as seen in the stringified proxy example above. If an
application requires the use of multiple IceStorm services, it's a good idea to assign unique identities to their
well-known objects by configuring the services with different values for the
[IceStorm.InstanceName](../icestorm-properties) property, as shown in the following example:

```
IceStorm.InstanceName=Measurement
```

This property changes the category of the object's identity, which becomes `Measurement/TopicManager`. The client's
configuration must also be changed to reflect the new identity:

```
TopicManager.Proxy=Measurement/TopicManager:tcp -p 9999
```

IceStorm also hosts an object with the identity `IceStorm/Finder`, as described in the next section. This identity is
not affected by changes to `IceStorm.InstanceName`.

# Using the IceStorm `Finder` Interface

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
    finder{communicator, "IceStorm/Finder:tcp -h icestormhost -p 9999};

auto topicManager = finder->getTopicManager();
```

##### See Also

- [IceStorm Properties](../icestorm-properties)
- [IceBox](../icebox)
- [IceGrid](../icegrid)
- [The Ice Threading Model](../the-ice-threading-model)
- [Object Adapter Replication](../object-adapter-replication)
- [IceStorm Administration](../icestorm-administration)
- [Using an IceStorm Publisher Object](../using-an-icestorm-publisher-object)
- [Highly Available IceStorm](../highly-available-icestorm)
