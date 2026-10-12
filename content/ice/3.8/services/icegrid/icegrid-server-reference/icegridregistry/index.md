---
title: icegridregistry
---

The IceGrid registry is a centralized repository of information, including
[deployed applications](../../using-icegrid-deployment) and [well-known objects](../../well-known-objects). A registry
can optionally be collocated with an IceGrid node, which conserves resources and can be convenient during development
and testing. The registry server is implemented by the `icegridregistry` executable.

## Command Line Options for `icegridregistry`

The registry supports the following command-line options:

```shell
icegridregistry -h
Usage: icegridregistry [options]
Options:
-h, --help           Show this message.
-v, --version        Display the Ice version.
--readonly           Start the master registry in read-only mode.
--initdb-from-replica <replica>
                     Initialize the database from the given replica.
```

The `--readonly` option prevents any updates to the registry's database; it also prevents slaves from synchronizing
their databases with this master. This option is useful when you need to verify that the master registry's database is
correct after [promoting a slave](../promoting-a-registry-slave) to become the new master. The `--initdb-from-replica`
option, added in Ice 3.5.1, allows you to initialize the database from another registry replica. This option is useful
when you need to start a new master with the contents of a slave database.

Additional command line options are supported, including those that allow the registry to run as a
[Windows service or Unix daemon](../../../../background-servers), and Ice includes a
[utility](../../../../background-servers/windows-services) to help you install an IceGrid registry as a Windows service.

## Configuring Registry Endpoints

The IceGrid registry creates up to six object adapters. You configure their endpoints with the following properties:

- [IceGrid.Registry.Client.Endpoints](../../../../property-reference/icegrid-properties) The `IceGrid.Registry.Client`
  adapter hosts the objects that clients use: the locator (`Ice::Locator`), the `IceGrid::Query` and `IceGrid::Registry`
  objects, and the `IceGrid::Session`, `IceGrid::AdminSession` and `IceGrid::Admin` objects of the sessions that clients
  create. The registry requires this property to start.

{% callout type="warning" %}

There are security implications in allowing access to administrative sessions, as explained in the next section.

{% /callout %}

- [IceGrid.Registry.Server.Endpoints](../../../../property-reference/icegrid-properties) The `IceGrid.Registry.Server`
  adapter hosts the locator registry (`Ice::LocatorRegistry`), with which servers register their object adapters. The
  registry requires this property to start.

- [IceGrid.Registry.Internal.Endpoints](../../../../property-reference/icegrid-properties) The
  `IceGrid.Registry.Internal` adapter hosts the objects that IceGrid nodes and registry replicas use. The registry
  requires this property to start, even when there are no nodes or replicas.

- [IceGrid.Registry.SessionManager.Endpoints](../../../../property-reference/icegrid-properties) The
  `IceGrid.Registry.SessionManager` adapter hosts the Glacier2 session managers that create
  [sessions](../../resource-allocation-using-icegrid-sessions) for the clients of a
  [Glacier2 router](../../glacier2-integration-with-icegrid). The registry creates this adapter only when this property
  is set.

- [IceGrid.Registry.AdminSessionManager.Endpoints](../../../../property-reference/icegrid-properties) The
  `IceGrid.Registry.AdminSessionManager` adapter hosts the Glacier2 session managers that create
  [administrative sessions](../../icegrid-administrative-sessions) for the clients of a Glacier2 router. The registry
  creates this adapter only when this property is set.

- [IceGrid.Registry.Discovery.Endpoints](../../../../property-reference/icegrid-properties) The
  `IceGrid.Registry.Discovery` adapter hosts the object that answers
  [locator discovery](../../../../plugins/icelocatordiscovery) queries, on UDP multicast endpoints. The registry creates
  this adapter by default, with port `4061`; setting `IceGrid.Registry.Discovery.Enabled` to `0` disables it.

## Registry Security Considerations

A client that successfully establishes an [administrative session](../../icegrid-administrative-sessions) with the
registry has the ability to compromise the security of the registry host. As a result, it is imperative that you
configure the registry carefully if you intend to allow the use of administrative sessions.

Administrative sessions are disabled unless you explicitly configure the registry to use an authentication mechanism. To
allow authentication with a user name and password, you can specify a password file using the property
[IceGrid.Registry.AdminCryptPasswords](../../../../property-reference/icegrid-properties#icegrid.registry.admincryptpasswords)
or use your own [permissions verifier](../../../glacier2/securing-a-glacier2-router) object by supplying its proxy in
the property
[IceGrid.Registry.AdminPermissionsVerifier](../../../../property-reference/icegrid-properties#icegrid.registry.adminpermissionsverifier).
Your verifier object must implement the `Glacier2::PermissionsVerifier` interface.

To authenticate administrative clients using their SSL connections, define
[IceGrid.Registry.AdminSSLPermissionsVerifier](../../../../property-reference/icegrid-properties#icegrid.registry.adminsslpermissionsverifier)
with the proxy of a verifier object that implements the `Glacier2::SSLPermissionsVerifier` interface.

## Configuring the Registry's Database Directory

You must provide an empty directory in which the registry can initialize its [database](../icegrid-persistent-data). The
path name of this directory is supplied by the configuration property
[IceGrid.Registry.LMDB.Path](../../../../property-reference/icegrid-properties#icegrid.registry.lmdb.path).

The files in this directory must not be edited manually, but rather indirectly using one of the
[administrative tools](../../icegridadmin-command-line-tool). To clear a registry's database, first ensure the server is
not currently running, then remove all of the files in its data directory and restart the server.

## Registry Configuration Example

The registry requires values for the three mandatory endpoint properties, as well as the database directory property, as
shown in the following example:

```config
IceGrid.Registry.Client.Endpoints=tcp -p 4061
IceGrid.Registry.Server.Endpoints=tcp
IceGrid.Registry.Internal.Endpoints=tcp
IceGrid.Registry.LMDB.Path=/opt/ripper/registry
```

In addition, we also recommend defining `IceGrid.InstanceName`, whose value affects the identities of the registry's
[well-known objects](../well-known-registry-objects).

The remaining configuration properties are discussed in [IceGrid.*](../../../../property-reference/icegrid-properties).

## See Also

- [Using IceGrid Deployment](../../using-icegrid-deployment)
- [Well-Known Objects](../../well-known-objects)
- [Promoting a Registry Slave](../promoting-a-registry-slave)
- [Windows Services](../../../../background-servers/windows-services)
- [Resource Allocation Using IceGrid Sessions](../../resource-allocation-using-icegrid-sessions)
- [IceGrid Administrative Sessions](../../icegrid-administrative-sessions)
- [Glacier2 Integration with IceGrid](../../glacier2-integration-with-icegrid)
- [icegridadmin Command Line Tool](../../icegridadmin-command-line-tool)
- [Securing a Glacier2 Router](../../../glacier2/securing-a-glacier2-router)
- [IceGrid Persistent Data](../icegrid-persistent-data)
- [Well-Known Registry Objects](../well-known-registry-objects)
- [IceGrid.*](../../../../property-reference/icegrid-properties)
