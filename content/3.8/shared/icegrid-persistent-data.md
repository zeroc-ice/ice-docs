---
id: icegrid-persistent-data
title: IceGrid Persistent Data
---

The IceGrid registry and node both store information in files. This section describes what type of information the
registry and node are storing, and discusses backup and recovery techniques.

# Registry Database

## Data Stored

The registry stores the following data in the [LMDB](https://www.symas.com/mdb) database specified through the
[IceGrid.Registry.LMDB.Path](../icegrid-properties) property:

- Applications [deployed](../using-icegrid-deployment) using the `addApplication` operation on the `IceGrid::Admin`
  interface (which includes the IceGrid GUI and command-line
  [administrative clients](../icegridadmin-command-line-tool)). Applications describe servers, well-known objects,
  object adapters, replica groups, and allocatable objects. Applications can be removed with the `removeApplication`
  operation.
- [Well-known objects](../well-known-objects) registered using the `addObject` and `addObjectWithType` operations on the
  `IceGrid::Admin` interface. Well-known objects added by these operations can be removed using the `removeObject`
  operation.
- [Adapter endpoints](../object-adapter-endpoints) registered dynamically by servers using the `Ice::LocatorRegistry`
  interface. The property [IceGrid.Registry.DynamicRegistration](../icegrid-properties) must be set to a value larger
  than zero to allow the dynamic registration of object adapters. These adapters can be removed using the
  `removeAdapter` operation.
- Some internal proxies used by the registry to contact nodes and other registry replicas during startup. The proxies
  enable the registry to notify these entities about the registry's availability.

[Client session](../resource-allocation-using-icegrid-sessions) and
[administrative sessions](../icegrid-administrative-sessions) established with the IceGrid registry are not stored in
this database. If the registry is restarted, these sessions must be recreated. For client sessions in particular, this
implies that objects allocated using the allocation mechanism will no longer be allocated once the IceGrid registry
restarts.

If the registry's database is corrupted or lost, you must recover the deployed applications, the well-known objects, and
the adapter endpoints. You do not need to worry about the internal proxies stored by the registry, as the nodes and
registry replicas will eventually contact the registry again.

Depending on your deployed applications and your use of the registry, you should consider backing up the registry's
database, especially if you cannot easily recover the persistent information.

For example, if you rely on dynamically-registered adapters, or on well-known objects registered programmatically via
the `IceGrid::Admin` interface, you should back up the registry database because recovering this information may be
difficult. On the other hand, if you only deploy a few applications from XML files, you can easily recover the
applications by redeploying their XML files, and therefore backing up the database may be unnecessary.

Be aware that restarting the registry with an empty database may cause the server information stored by the nodes to be
deleted. This can be an issue if the deployed servers have databases stored in the node data directory. The
[Node Persistent Data](../icegrid-persistent-data#node-persistent-data) section below provides more information on this
subject.

## Limits Imposed by the Registry Database

### Key Size

A LMDB database consists of one or more persistent key-value maps, and the size of the keys in these maps is limited to
511 bytes. For example, IceGrid stores applications in a persistent map where the keys are the application names,
encoded using the [Ice encoding](../ice-encoding) for strings, and this LMDB limitation means you cannot select an
application name with an arbitrary size.

| **IceGrid Registry Database Key** | **Slice Type**  | **Max Encoded Size** |
| --------------------------------- | --------------- | -------------------- |
| Adapter ID                        | `string`        | 511 bytes            |
| Application Name                  | `string`        | 511 bytes            |
| Well-known Object Identity        | `Ice::Identity` | 511 bytes            |
| Well-known Object Type            | `string`        | 511 bytes            |

If you attempt to save an application, adapter ID or well-known object that is too large for the LMDB database, IceGrid
will throw an `IceGrid::DeploymentException` or an `Ice::UnknownException` depending on the operation invoked.

{% callout type="info" %}

This maximum key size is not configurable. If you exceed this limit, you need to shorten the corresponding name, ID or
identity.

{% /callout %}

### Map Size

A LMDB database has a maximum size, known as its map size. The IceGrid registry database can store up to
[IceGrid.Registry.LMDB.MapSize](../icegrid-properties) megabytes of data in its database; any attempt to store more data
will fail with an `Ice::UnknownException`. If you exceed this limit, increase `IceGrid.Registry.LMDB.MapSize` and
restart the IceGrid registry.

If you don't set `IceGrid.Registry.LMDB.MapSize`, or set it to 0, IceGrid uses a map size of 10 MB on Windows, and 100
MB on Linux and macOS

On Windows, LMDB immediately allocates a file with the given map size, while on Linux and OS X LMDB uses sparse files
and the allocated data file starts small and grows as needed, until it reaches the configured limit.

{% callout type="info" %}

The default `MapSize` provided by the IceGrid registry is expected to be sufficient for most applications. Unless you
have an extremely large IceGrid deployment on Windows, we recommend keeping the default setting.

Use the [mdb_stat](https://manpages.org/mdb_stat) utility to monitor the pages used by your IceGrid registry database.
The example below shows a LMDB database with the default size on Linux (100 MB):

```shell
$ mdb_stat -e registry
Environment Info
  Map address: (nil)
  Map size: 104857600
  Page size: 4096
  Max pages: 25600
  Number of pages used: 18
  Last transaction ID: 8
  Max readers: 126
  Number of readers used: 0
Status of Main DB
  Tree depth: 1
  Branch pages: 0
  Leaf pages: 1
  Overflow pages: 0
  Entries: 8
```

{% /callout %}

## Backing up the Registry Database

You should consider making regular backups of your IceGrid registry database. We recommend using one of the following
tools to perform backups while the IceGrid registry is running:

- [icegriddb](../icegrid-database-utility) with the `--export` option
- [mdb_copy](https://manpages.org/mdb_copy) or [mdb_dump](https://manpages.org/mdb_dump)

# Node Persistent Data

Each IceGrid node stores information in a directory specified through its [IceGrid.Node.Data](../icegrid-properties)
property - the node's data directory. In IceGrid descriptors, the `node.data` variable is substituted with the path of
the node data directory.

Each node stores configuration files and user data for each server in a sub-directory named `servers/<server ID>`, where
`<server ID>` represents the unique [server ID](../server-descriptor-element) of that server. Per-server or per-service
user data can be stored in the sub-directories named `servers/<server ID>/data` and
`servers/<server ID>/data_<service name>`. In IceGrid descriptors, the `server.data` and `service.data` variables are
replaced with the paths of the server or service data directory.

If a server directory is deleted, the node recreates it at startup. The node will also recreate the server configuration
files. However, the node cannot restore the prior contents of a server's user data directory. It is your responsibility
to back up the user data and restore them when necessary.

##### See Also

- [Using IceGrid Deployment](../using-icegrid-deployment)
- [icegridadmin Command Line Tool](../icegridadmin-command-line-tool)
- [Well-Known Objects](../well-known-objects)
- [Object Adapter Endpoints](../object-adapter-endpoints)
- [Resource Allocation using IceGrid Sessions](../resource-allocation-using-icegrid-sessions)
- [IceGrid Administrative Sessions](../icegrid-administrative-sessions)
- [IceGrid.*](../icegrid-properties)
