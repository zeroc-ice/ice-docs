---
title: icegridregistry
---

The IceGrid registry is a centralized repository of information, including
[deployed applications](../using-icegrid-deployment) and [well-known objects](../well-known-objects). A registry can
optionally be collocated with an IceGrid node, which conserves resources and can be convenient during development and
testing. The registry server is implemented by the `icegridregistry` executable.

## Command Line Options for `icegridregistry`

The registry supports the following command-line options:

```shell
icegridregistry -h
Usage: icegridregistry [options]
Options:
-h, --help           Show this message.
-v, --version        Display the Ice version.
--nowarn             Don't print any security warnings.
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
[Windows service or Unix daemon](../background-servers), and Ice includes a [utility](../windows-services) to help you
install an IceGrid registry as a Windows service.

## Configuring Registry Endpoints

The IceGrid registry creates up to five sets of endpoints, configured with the following properties:

- [IceGrid.Registry.Client.Endpoints](../icegrid-properties) Client-side endpoints supporting the following interfaces:

  - `Ice::Locator`
  - `IceGrid::Query`
  - `IceGrid::Registry`
  - `IceGrid::Session`
  - `IceGrid::AdminSession`
  - `IceGrid::Admin`

{% callout type="warning" %}

There are security implications in allowing access to administrative sessions, as explained in the next section.

{% /callout %}

- [IceGrid.Registry.Server.Endpoints](../icegrid-properties) Server-side endpoints for object adapter registration.

- [IceGrid.Registry.SessionManager.Endpoints](../icegrid-properties) Optional endpoints for delegating
  [session](../resource-allocation-using-icegrid-sessions) authentication to a
  [Glacier2 router](../glacier2-integration-with-icegrid).

- [IceGrid.Registry.AdminSessionManager.Endpoints](../icegrid-properties) Optional endpoints for delegating
  [administrative session](../icegrid-administrative-sessions) authentication to a
  [Glacier2 router](../glacier2-integration-with-icegrid).

- [IceGrid.Registry.Internal.Endpoints](../icegrid-properties) Internal endpoints used by IceGrid nodes and registry
  replicas. This property must be defined even if no nodes or replicas are being used.

## Registry Security Considerations

A client that successfully establishes an [administrative session](../icegrid-administrative-sessions) with the registry
has the ability to compromise the security of the registry host. As a result, it is imperative that you configure the
registry carefully if you intend to allow the use of administrative sessions.

Administrative sessions are disabled unless you explicitly configure the registry to use an authentication mechanism. To
allow authentication with a user name and password, you can specify a password file using the property
[IceGrid.Registry.AdminCryptPasswords](../icegrid-properties) or use your own
[permissions verifier](../securing-a-glacier2-router) object by supplying its proxy in the property
[IceGrid.Registry.AdminPermissionsVerifier](../icegrid-properties). Your verifier object must implement the
`Glacier2::PermissionsVerifier` interface.

To authenticate administrative clients using their SSL connections, define
[IceGrid.Registry.AdminSSLPermissionsVerifier](../icegrid-properties) with the proxy of a verifier object that
implements the `Glacier2::SSLPermissionsVerifier` interface.

## Configuring the Registry's Database Directory

You must provide an empty directory in which the registry can initialize its [database](../icegrid-persistent-data). The
path name of this directory is supplied by the configuration property
[IceGrid.Registry.LMDB.Path](../icegrid-properties).

The files in this directory must not be edited manually, but rather indirectly using one of the
[administrative tools](../icegridadmin-command-line-tool). To clear a registry's database, first ensure the server is
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

The remaining configuration properties are discussed in [IceGrid.*](../icegrid-properties).

## See Also

- [Using IceGrid Deployment](../using-icegrid-deployment)
- [Well-Known Objects](../well-known-objects)
- [Promoting a Registry Slave](../promoting-a-registry-slave)
- [Windows Services](../windows-services)
- [Resource Allocation using IceGrid Sessions](../resource-allocation-using-icegrid-sessions)
- [IceGrid Administrative Sessions](../icegrid-administrative-sessions)
- [Glacier2 Integration with IceGrid](../glacier2-integration-with-icegrid)
- [icegridadmin Command Line Tool](../icegridadmin-command-line-tool)
- [Securing a Glacier2 Router](../securing-a-glacier2-router)
- [IceGrid Persistent Data](../icegrid-persistent-data)
- [Well-Known Registry Objects](../well-known-registry-objects)
- [IceGrid.*](../icegrid-properties)
