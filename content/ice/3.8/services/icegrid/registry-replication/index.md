---
title: Registry Replication
---

IceGrid replicates its registry so that clients and nodes keep working when a registry or its host fails. A replicated
registry consists of one master replica and any number of slave replicas. Every replica answers locate requests and can
activate servers; changes to the registry's state, such as deploying an application, and client sessions require the
master replica. Clients configured with several replicas fail over from one replica to another on their own.

When the master replica fails, the slave replicas keep providing their services, and no slave replica becomes the master
on its own. To restore the services that require the master replica, you restart the master replica or
[promote a slave replica](../icegrid-server-reference/promoting-a-registry-slave) by restarting it as the master.

Registry replication covers the registry only. A client already connected to a server keeps using that connection
without the registry, and it reaches another server when that server fails only if the server's object adapter is
[replicated](../object-adapter-replication).

## Registry Replication Architecture

Each replica has a unique name. The name `Master` is reserved for the master replica; a slave replica can use any name
that can legally appear in an object identity.

The figure below shows a master replica and a slave replica, each running on a host with a node:

![Host Server 1 runs the master registry and Node1, and host Server 2 runs the slave registry and Node2. In step 1 the registries synchronize, in step 2 both nodes contact the master, in step 3 both nodes contact the slave, in step 4 the client contacts the master, and in step 5 the client fails over to the slave.](/images/ice/3.8/registry-replication/registry-replication.svg)

1. The slave replica registers with the master replica at startup and copies the master's database: the deployed
   applications, the object adapter endpoints and the well-known objects. The master replica sends every later change to
   all active slave replicas.
2. The nodes register with the master replica at startup.
3. The master replica gives the nodes its list of slave replicas, and the nodes register with each of them. A replica
   can activate the servers of the nodes registered with it.
4. The client's configuration determines which replica it contacts first. In this example, it contacts the master
   replica.
5. When the master replica fails, the client fails over to the slave replica. The failure of the host Server 1 also
   takes down `Node1` and its servers; the client reaches a server on `Node2` only if that server's object adapter is
   [replicated](../object-adapter-replication).

A slave replica receives database updates only from the master replica.

## Capabilities of a Registry Replica

A slave replica provides the following services whether or not the master replica is running. The services that require
the master replica are unavailable until a master replica runs again.

| Service                                                  | Master replica | Slave replica                      |
| -------------------------------------------------------- | -------------- | ---------------------------------- |
| Locate requests                                          | Yes            | Yes                                |
| Server activation                                        | Yes            | Yes                                |
| Queries for well-known objects                           | Yes            | Yes                                |
| Client sessions and resource allocation                  | Yes            | No                                 |
| Dynamic registration of object adapters                  | Yes            | Only while connected to the master |
| Changes to applications, adapters and well-known objects | Yes            | No                                 |
| Other administrative operations                          | Yes            | Yes                                |
| Administrative sessions                                  | Yes            | Yes                                |

### Locate Requests

Every replica answers locate requests. A slave replica resolves object identities, object adapter IDs and replica group
IDs into endpoints using its copy of the master's database.

### Server Activation

A node registers with every active replica, so any replica can activate one of the node's servers on behalf of a client.

### Queries

Each replica hosts an object that implements the `IceGrid::Query` interface used to
[query well-known objects](../well-known-objects). A client that resolves the `IceGrid/Query` identity receives the
endpoints of the replicas, and any of them can execute the client's requests.

### Client Sessions and Allocation

Only the master replica creates client sessions: a slave replica rejects `IceGrid::Registry::createSession` and
`createSessionFromSecureConnection` with `PermissionDeniedException`. A client therefore needs the master replica to
[allocate objects and servers](../resource-allocation-using-icegrid-sessions).

### Dynamic Registration

When
[IceGrid.Registry.DynamicRegistration](../../../property-reference/icegrid-properties#icegrid.registry.dynamicregistration)
is enabled, a server can register an object adapter that no deployed application describes. A slave replica forwards
such a registration to the master replica and rejects it when it has no session with the master replica.

### Administration

You administer an IceGrid registry through the `IceGrid::Admin` interface, directly or, more commonly, with an
[administrative tool](../icegridadmin-command-line-tool) that uses this interface. Only the master replica accepts
changes to the registry's state: adding, updating and removing applications, adapters and well-known objects. A slave
replica rejects these operations with `DeploymentException` and accepts the other administrative operations, such as
starting and stopping servers. The administrative tools let you select the replica to contact.

For programmatic access to a replica's administrative interface, the `IceGrid/Registry` identity corresponds to the
master replica and the identity `IceGrid/Registry-name` corresponds to the slave replica with the given name.

The registry's locator object also implements
[`IceGrid::Locator`](https://code.zeroc.com/ice/3.8/api/slice/interfaceIceGrid_1_1Locator.html), which extends
`Ice::Locator` with two operations: `getLocalRegistry` returns the `Registry` object of the replica your locator proxy
is connected to, and `getLocalQuery` its `Query` object.

### Glacier2 Support

The registry implements the session manager interfaces required for
[integration with a Glacier2 router](../glacier2-integration-with-icegrid). A replica provides these session managers
when you configure their endpoints with `IceGrid.Registry.SessionManager.Endpoints` and
`IceGrid.Registry.AdminSessionManager.Endpoints`. The master replica provides the client session managers
`IceGrid/SessionManager` and `IceGrid/SSLSessionManager`, and the administrative session managers
`IceGrid/AdminSessionManager` and `IceGrid/AdminSSLSessionManager`. A slave replica provides only administrative session
managers, with the identities `IceGrid/AdminSessionManager-name` and `IceGrid/AdminSSLSessionManager-name`.

## Configuring Registry Replication

You configure registry replication with IceGrid properties on the replicas, and with `Ice.Default.Locator` on the slave
replicas, the clients and the nodes.

Configure [Ice.Default.Locator](../../../property-reference/ice-default-properties#ice.default.locator) with the
endpoints of all the replicas. A process that uses this locator then reaches the registry as long as one of the replicas
it lists is running. The master replica ignores `Ice.Default.Locator`, so all the replicas, the clients and the nodes
can share the same definition. The following sections describe what each of them uses this property for.

Instead of defining `Ice.Default.Locator`, you can configure the
[IceLocatorDiscovery](../../../plugins/icelocatordiscovery) plug-in in the slave replicas, the clients and the nodes,
which then find the replicas at runtime. In a slave replica or a node, also set
[IceLocatorDiscovery.InstanceName](../../../property-reference/icelocatordiscovery-properties#icelocatordiscovery.instancename)
or [IceGrid.InstanceName](../../../property-reference/icegrid-properties#icegrid.instancename) to the instance name of
the deployment: otherwise, the slave replica or the node derives its instance name from the plug-in's locator, whose
identity category is a generated UUID.

### Replicas

Each replica sets its name with
[IceGrid.Registry.ReplicaName](../../../property-reference/icegrid-properties#icegrid.registry.replicaname). The default
value of this property is `Master`, so the master replica can omit it.

A slave replica needs a default locator, set with `Ice.Default.Locator` or installed by IceLocatorDiscovery, and does
not start without one. At startup, the slave replica asks the replicas it reaches through this locator for the master
replica's endpoints, then registers with the master replica to copy its database and obtain the list of active nodes.
Listing all the replicas lets a slave replica find a running master replica through any listed replica that is running,
including after you promote another slave replica to master.

The following properties configure a master replica:

```config
IceGrid.Registry.Client.Endpoints=default -p 12000
IceGrid.Registry.Server.Endpoints=default
IceGrid.Registry.Internal.Endpoints=default
IceGrid.Registry.LMDB.Path=db/master
...
```

The following properties configure a slave replica named `Replica1`:

```config
Ice.Default.Locator=IceGrid/Locator:default -h server1 -p 12000:default -h server2 -p 12001
IceGrid.Registry.Client.Endpoints=default -p 12001
IceGrid.Registry.Server.Endpoints=default
IceGrid.Registry.Internal.Endpoints=default
IceGrid.Registry.LMDB.Path=db/replica1
IceGrid.Registry.ReplicaName=Replica1
...
```

### Clients

A client sends its locate requests to the replicas listed in `Ice.Default.Locator`. Listing several replicas lets the
client fail over when a replica fails, and spreads the workload of locate requests across the replicas:

```config
Ice.Default.Locator=IceGrid/Locator:default -h server1 -p 12000:default -h server2 -p 12001
```

### Nodes

A node registers with every active replica, so that each replica can activate the node's servers and knows the endpoints
of their object adapters.

At startup, the node registers with the master replica, which gives it the list of active slave replicas. When the
master replica is not running, the node asks the replicas listed in `Ice.Default.Locator` for the list instead.

The following properties configure a node:

```config
Ice.Default.Locator=IceGrid/Locator:default -h server1 -p 12000:default -h server2 -p 12001
IceGrid.Node.Name=node1
IceGrid.Node.Endpoints=default
IceGrid.Node.Data=db/node1
```

### Diagnostics

The following properties enable tracing for registry replication:

- [IceGrid.Registry.Trace.Replica](../../../property-reference/icegrid-properties#icegrid.registry.trace.replica) traces
  the sessions between the master replica and the slave replicas.
- [IceGrid.Registry.Trace.Node](../../../property-reference/icegrid-properties#icegrid.registry.trace.node) and
  [IceGrid.Node.Trace.Replica](../../../property-reference/icegrid-properties#icegrid.node.trace.replica) trace the
  sessions between the replicas and the nodes.

## Using Registry Replication with External Load Balancing

Listing every replica in `Ice.Default.Locator` means editing the configuration of every client, node and slave replica
when you add or remove a replica. In a large deployment, you can instead give `Ice.Default.Locator` a single endpoint
that leads to all the replicas:

- **A DNS name with an address (A) record for each replica.** The endpoint in `Ice.Default.Locator` uses this DNS name.
  The Ice runtime tries the addresses in the order the DNS resolver returns them, so this order determines which replica
  a client contacts first. All the replicas must use the same port.
- **A TCP load balancer.** The endpoint in `Ice.Default.Locator` uses the address and port of the load balancer, which
  forwards each connection to an active replica.

The DNS server or the load balancer then becomes part of the registry's availability: replicate it too.

Start the master replica before a slave replica whose database is empty. A slave replica finds the master replica
through the replicas it reaches with `Ice.Default.Locator`: a replica that has synchronized with the master replica
keeps the master replica's endpoints in its database. With a single DNS or load balancer endpoint, a slave replica with
an empty database may reach only itself, or another replica that has never synchronized, and then keeps retrying without
finding the master replica.

## See Also

- [Promoting a Registry Slave](../icegrid-server-reference/promoting-a-registry-slave)
- [Object Adapter Replication](../object-adapter-replication)
- [Well-Known Objects](../well-known-objects)
- [Resource Allocation Using IceGrid Sessions](../resource-allocation-using-icegrid-sessions)
- [icegridadmin Command Line Tool](../icegridadmin-command-line-tool)
- [Glacier2 Integration with IceGrid](../glacier2-integration-with-icegrid)
- [IceGrid.*](../../../property-reference/icegrid-properties)
