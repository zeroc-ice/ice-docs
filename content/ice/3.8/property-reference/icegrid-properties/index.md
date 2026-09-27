---
title: IceGrid.*
---

# IceGrid.InstanceName

#### Synopsis

`IceGrid.InstanceName=name`

#### Description

Specifies an alternate identity category for the [well-known IceGrid objects](../well-known-registry-objects). If
defined, the identities of the IceGrid objects become:

`name/AdminSessionManager` `name/AdminSessionManager-replica` `name/AdminSSLSessionManager`
`name/AdminSSLSessionManager-replica` `name/NullPermissionsVerifier` `name/NullSSLPermissionsVerifier` `name/Locator`
`name/Query` `name/Registry` `name/Registry-replica` `name/RegistryUserAccountMapper`
`name/RegistryUserAccountMapper-replica` `name/SessionManager` `name/SSLSessionManager`

If this property is not set, the category (`name`) is computed as follows:

- if `IceLocalDiscovery.InstanceName` is defined, use its value; otherwise
- if a default locator is set on the communicator (typically via `Ice.Default.Locator`), use the category of the locator
  proxy; otherwise
- use `IceGrid`

For example, in the configuration of an IceGrid node, you don’t need to set `IceGrid.InstanceName` since you already
specify it indirectly with `Ice.Default.Locator`.

# IceGrid.Node._AdapterProperty_

#### Synopsis

`IceGrid.Node.AdapterProperty=value`

#### Description

An IceGrid node uses the adapter name `IceGrid.Node` for the object adapter that the registry contacts to communicate
with the node. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this adapter.

# IceGrid.Node.AllowEndpointsOverride

#### Synopsis

`IceGrid.Node.AllowEndpointsOverride=num`

If `num` is set to a non-zero value, an IceGrid node permits servers to override previously set endpoints even if the
server is active. Setting this property to a non-zero value is necessary if the servers managed by the node use the
object adapter operation `refreshPublishedEndpoints`. The default value of `num` is zero.

# IceGrid.Node.AllowRunningServersAsRoot

#### Synopsis

`IceGrid.Node.AllowRunningServersAsRoot=num`

If `num` is set to a non-zero value, an IceGrid node will permit servers started by the node to run with super-user
privileges. Note that you should not set this property unless the node uses a secure endpoint; otherwise, clients can
start arbitrary processes with super-user privileges on the node's machine.

The default value of `num` is zero.

# IceGrid.Node.CollocateRegistry

#### Synopsis

`IceGrid.Node.CollocateRegistry=num`

#### Description

If `num` is set to a value larger than zero, the [node](../icegridnode) collocates the IceGrid registry.

The collocated registry is configured with the same properties as the standalone IceGrid registry.

# IceGrid.Node.Data

#### Synopsis

`IceGrid.Node.Data=path`

#### Description

Defines the path of the IceGrid node [data directory](../icegridnode). The node creates `servers`, and `tmp`
subdirectories in this directory if they do not already exist. The `servers` directory contains configuration data for
each [deployed server](../using-icegrid-deployment). The `tmp` directory holds temporary files.

# IceGrid.Node.DisableOnFailure

#### Synopsis

`IceGrid.Node.DisableOnFailure=num`

#### Description

The node considers a server to have terminated improperly if it has a non-zero exit code or if it exits due to one of
the signals `SIGABRT`, `SIGBUS`, `SIGILL`, `SIGFPE`, or `SIGSEGV`. The node marks such a server as disabled if `num` is
a non-zero value; a [disabled server](../icegrid-troubleshooting) cannot be activated on demand. For values of `num`
greater than zero, the server is disabled for `num` seconds. If `num` is a negative value, the server is disabled
indefinitely, or until it is explicitly enabled or started via an administrative action. The default value is zero,
meaning the node does not disable servers in this situation.

# IceGrid.Node.Name

#### Synopsis

`IceGrid.Node.Name=name`

#### Description

Defines the `name` of the IceGrid node. All nodes using the same registry must have unique names; a node refuses to
start if there is a node with the same name running already. This property must be defined for each node.

# IceGrid.Node.Output

#### Synopsis

`IceGrid.Node.Output=path`

#### Description

Defines the path of the IceGrid node output directory. If set, the node redirects the `stdout` and `stderr` output of
the started servers to files named `server.out` and `server.err` in this directory. Otherwise, the started servers share
the `stdout` and `stderr` of the node's process.

# IceGrid.Node.PrintServersReady

#### Synopsis

`IceGrid.Node.PrintServersReady=token`

#### Description

The IceGrid node prints "`token` ready" on standard output after all the servers managed by the node are ready. This is
useful for scripts that wish to wait until all servers have been started and are ready for use.

# IceGrid.Node.ProcessorSocketCount

#### Synopsis

`IceGrid.Node.ProcessorSocketCount=num`

#### Description

This property sets the number of processor sockets. This value is reported by the
[icegridadmin](../icegridadmin-command-line-tool) `node sockets` command. On Windows Vista (or later), Windows Server
2008 (or later), and Linux systems, the number of processor sockets is set automatically by the Ice run time. On other
systems, the run time cannot obtain the socket count from the operating system; you can use this property to set the
number of processor sockets manually on such systems.

# IceGrid.Node.PropertiesOverride

#### Synopsis

`IceGrid.Node.PropertiesOverride=overrides`

#### Description

Defines a list of properties that override the properties defined in server deployment descriptors. For example, in some
cases it is desirable to set the property [Ice.Default.Host](../ice-default-properties) for servers, but not in server
deployment descriptors. The property definitions must be separated by white space.

# IceGrid.Node.RedirectErrToOut

#### Synopsis

`IceGrid.Node.RedirectErrToOut=num`

#### Description

If `num` is set to a value larger than zero, the `stderr` of each started server is redirected to the server's `stdout`.

# IceGrid.Node.Trace.Activator

#### Synopsis

`IceGrid.Node.Trace.Activator=num`

#### Description

The activator trace level:

| 0   | No activator trace (default).                                                                                                                                                                                                                                                                                                                                                               |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Trace process activation, termination.                                                                                                                                                                                                                                                                                                                                                      |
| 2   | Like 1, but more verbose: includes process signaling, the activation parameters of each spawned server (path, working directory, uid/gid, arguments, and environment variables), and more diagnostic messages. Note: environment variables and arguments may carry secrets (passwords, tokens, certificate passphrases) injected via your deployment — treat the trace output as sensitive. |

# IceGrid.Node.Trace.Adapter

#### Synopsis

`IceGrid.Node.Trace.Adapter=num`

#### Description

The object adapter trace level:

| 0   | No object adapter trace (default).                                                                                    |
| --- | --------------------------------------------------------------------------------------------------------------------- |
| 1   | Trace object adapter addition, removal.                                                                               |
| 2   | Like 1, but more verbose, including object adapter activation and deactivation and more diagnostic messages.          |
| 3   | Like 2, but more verbose, including object adapter transitional state change (for example, "waiting for activation"). |

# IceGrid.Node.Trace.Admin

#### Synopsis

`IceGrid.Node.Trace.Admin=num`

#### Description

Set the trace level for the routing of operations to Ice.Admin objects through this node.

| 0   | No admin trace (default).                        |
| --- | ------------------------------------------------ |
| 1   | Trace routing of operations to Ice.Admin objects |

# IceGrid.Node.Trace.Replica

#### Synopsis

`IceGrid.Node.Trace.Replica=num`

#### Description

The replica trace level:

| 0   | No replica trace (default).                                                      |
| --- | -------------------------------------------------------------------------------- |
| 1   | Trace session lifecycle between nodes and replicas.                              |
| 2   | Like 1, but more verbose, including session establishment attempts and failures. |
| 3   | Like 2, but more verbose, including keep alive messages sent to the replica.     |

# IceGrid.Node.UserAccountMapper

#### Synopsis

`IceGrid.Node.UserAccountMapper=proxy`

#### Description

Specifies the proxy of an object that implements the `IceGrid::UserAccountMapper` interface for
[customizing](../icegrid-server-activation) the user accounts under which servers are activated. The IceGrid node
invokes this proxy to map session identifiers (the user ID for sessions created with a user ID and password, or the
distinguished name for sessions created from a secure connection) to user accounts.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

# IceGrid.Node.UserAccounts

#### Synopsis

`IceGrid.Node.UserAccounts=file`

#### Description

Specifies the file name of an IceGrid node user account map file. Each line of the file must contain an identifier and a
user account, separated by white space. The identifier will be matched against the client session identifier (the user
ID for sessions created with a user ID and password, or the distinguished name for sessions created from a secure
connection). This user account map file is used by the node to
[map session identifiers to user accounts](../icegrid-server-activation). This property is ignored if
IceGrid.Node.UserAccountMapper is defined.

# IceGrid.Node.WaitTime

#### Synopsis

`IceGrid.Node.WaitTime=num`

#### Description

Defines the interval in seconds that IceGrid waits for
[server activation and deactivation](../icegrid-server-activation).

If a server is automatically activated and does not register its object adapter endpoints within this time interval, the
node assumes there is a problem with the server and returns an empty set of endpoints to the client.

If a server is being gracefully deactivated and IceGrid does not detect the server deactivation during this time
interval, IceGrid kills the server.

The default value is 60 seconds.

# IceGrid.Registry.AdminCryptPasswords

#### Synopsis

`IceGrid.Registry.AdminCryptPasswords=file`

#### Description

Specifies the file name of an IceGrid registry
[access control list for administrative clients](../resource-allocation-using-icegrid-sessions). Each line of the file
must contain a user name and a password, separated by white space. The password must a `MCF` encoded string as described
in the [passlib Modular Crypt Format documentation](https://pythonhosted.org/passlib/modular_crypt_format.html). If this
property is not defined, the default value is `admin-passwords`. This property is ignored if
IceGrid.Registry.AdminPermissionsVerifier is defined.

# IceGrid.Registry.AdminPermissionsVerifier

#### Synopsis

`IceGrid.Registry.AdminPermissionsVerifier=proxy`

#### Description

Specifies the proxy of an object that implements the `Glacier2::PermissionsVerifier` interface for
[controlling access to IceGrid administrative sessions](../icegrid-administrative-sessions). The IceGrid registry
invokes this proxy to validate each new administrative session created by a client with the `IceGrid::Registry`
interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

# IceGrid.Registry.AdminSessionFilters

#### Synopsis

`IceGrid.Registry.AdminSessionFilters=num`

#### Description

This property controls whether IceGrid establishes filters for sessions created with the
[IceGrid session manager](../glacier2-integration-with-icegrid). If `num` is set to a value larger than zero, IceGrid
establishes these filters, so [Glacier2](../glacier2) limits access to the `IceGrid::AdminSession` object and the
`IceGrid::Admin` object that is returned by the `getAdmin` operation. If `num` is set to zero, IceGrid does not
establish filters, so access to these objects is controlled solely by Glacier2's configuration.

The default value is 1.

# IceGrid.Registry.AdminSessionManager._AdapterProperty_

#### Synopsis

`IceGrid.Registry.AdminSessionManager.AdapterProperty=value`

#### Description

The IceGrid registry uses the adapter name `IceGrid.Registry.AdminSessionManager` for the object adapter that processes
incoming requests from [IceGrid administrative sessions](../icegrid-administrative-sessions). Therefore,
[adapter properties](../object-adapter-properties) can be used to configure this adapter. (Note any setting of
`IceGrid.Registry.AdminSessionManager.AdapterId` is ignored because the registry always provides a direct adapter.)

For security reasons, defining endpoints for this object adapter is optional. If you do define endpoints, they should
only be accessible to Glacier2 routers used to create IceGrid administrative sessions.

# IceGrid.Registry.AdminSSLPermissionsVerifier

#### Synopsis

`IceGrid.Registry.AdminSSLPermissionsVerifier=proxy`

#### Description

Specifies the proxy of an object that implements the `Glacier2::SSLPermissionsVerifier` interface for
[controlling access to IceGrid administrative sessions](../icegrid-administrative-sessions). The IceGrid registry
invokes this proxy to validate each new administrative session created by a client from a secure connection with the
`IceGrid::Registry` interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using the properties.

# IceGrid.Registry.Client._AdapterProperty_

#### Synopsis

`IceGrid.Registry.Client.AdapterProperty=value`

#### Description

IceGrid uses the adapter name `IceGrid.Registry.Client` for the object adapter that processes incoming requests from
clients. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this adapter. (Note any
setting of `IceGrid.Registry.Client.AdapterId` is ignored because the registry always provides a direct adapter.)

Note that [IceGrid.Registry.Client.Endpoints](../object-adapter-properties) controls the client endpoint for the
registry. The port numbers 4061 (for TCP) and 4062 (for SSL) are reserved for the registry by the
[Internet Assigned Numbers Authority](https://www.iana.org/assignments/service-names-port-numbers) (IANA).

# IceGrid.Registry.CryptPasswords

#### Synopsis

`IceGrid.Registry.CryptPasswords=file`

#### Description

Specifies the file name of an IceGrid registry [access control list](../resource-allocation-using-icegrid-sessions).
Each line of the file must contain a user name and a password, separated by white space. The password must a `MCF`
encoded string as described in the
[passlib Modular Crypt Format documentation](https://pythonhosted.org/passlib/modular_crypt_format.html). If this
property is not defined, the default value is `passwords`. This property is ignored if
IceGrid.Registry.PermissionsVerifier is defined.

# IceGrid.Registry.DefaultTemplates

#### Synopsis

`IceGrid.Registry.DefaultTemplates=path`

#### Description

Defines the path name of an XML file containing default [template descriptors](../icegrid-templates). A sample file
named `config/templates.xml` that contains convenient server templates for Ice services is provided in the Ice
distribution.

# IceGrid.Registry.Discovery._AdapterProperty_

#### Synopsis

`IceGrid.Registry.Discovery.AdapterProperty=value`

#### Description

The IceGrid registry creates an object adapter named `IceGrid.Registry.Discovery` for receiving
[multicast discovery queries](../icelocatordiscovery) from clients. If not otherwise defined by
`IceGrid.Registry.Discovery.Endpoints`, the endpoint for this object adapter is composed as follows:

`udp -h addr -p port [--interface intf]`

where `addr` is the value of `IceGrid.Registry.Discovery.Address`, `port` is the value of
`IceGrid.Registry.Discovery.Port`, and `intf` is the value of `IceGrid.Registry.Discovery.Interface`.

You don't normally need to set [other properties](../object-adapter-properties) for this object adapter.

# IceGrid.Registry.Discovery.Address

#### Synopsis

`IceGrid.Registry.Discovery.Address=addr`

#### Description

Specifies the multicast IP address to use for receiving multicast discovery queries. If not defined, the default value
depends on the setting of [Ice.IPv4](../ice-properties): if enabled (the default), IceDiscovery uses the address
`239.255.0.1`, otherwise IceDiscovery assumes the application wants to use IPv6 and defaults to the address `ff15::1`
instead. This property is used to compose the endpoint of the IceGrid.Registry.Discovery object adapter.

# IceGrid.Registry.Discovery.Enabled

#### Synopsis

`IceDiscovery.Enabled=num`

#### Description

If `num` is a value larger than zero, the registry creates the IceGrid.Registry.Discovery object adapter and listens for
[multicast discovery queries](../icelocatordiscovery). If not defined, the default value is `1`. Set this property to
zero to disable multicast discovery.

# IceGrid.Registry.Discovery.Interface

#### Synopsis

`IceGrid.Registry.Discovery.Interface=intf`

#### Description

Specifies the IP address of the interface to use for receiving multicast discovery queries. If not defined, the
operating system will select a default interface to send and receive the UDP multicast datagrams. This property is used
to compose the endpoint of the IceGrid.Registry.Discovery object adapter.

# IceGrid.Registry.Discovery.Port

#### Synopsis

`IceGrid.Registry.Discovery.Port=port`

#### Description

Specifies the multicast port to use for receiving multicast discovery queries. If not set, the default value is `4061`.
This property is used to compose the endpoint of the IceGrid.Registry.Discovery object adapter.

# IceGrid.Registry.DynamicRegistration

#### Synopsis

`IceGrid.Registry.DynamicRegistration=num`

#### Description

If `num` is set to a value larger than zero, the locator registry does not require Ice servers to preregister object
adapters and replica groups, but rather creates them automatically if they do not exist. If this property is not
defined, or `num` is set to zero, an attempt to register an unknown object adapter or replica group causes adapter
activation to fail with `Ice.NotRegisteredException`. An object adapter registers itself when the
[_adapter_.AdapterId](../object-adapter-properties) property is defined. The
[_adapter_.ReplicaGroupId](../object-adapter-properties) property identifies the replica group. An adapter registered
with dynamic registration can only be a member of a replica group also registered with dynamic registration. Trying to
dynamically register an adapter with a replica group registered with the
[deployment facility](../using-icegrid-deployment) will fail with `Ice.NotRegisteredException`.

# IceGrid.Registry.Internal._AdapterProperty_

#### Synopsis

`IceGrid.Registry.Internal.AdapterProperty=value`

#### Description

The IceGrid registry uses the adapter name `IceGrid.Registry.Internal` for the object adapter that processes incoming
requests from nodes and slave replicas. Therefore, [adapter properties](../object-adapter-properties) can be used to
configure this adapter. (Note any setting of `IceGrid.Registry.Internal.AdapterId` is ignored because the registry
always provides a direct adapter.)

# IceGrid.Registry.LMDB.MapSize

#### Synopsis

`IceGrid.Registry.LMDB.MapSize=num`

#### Description

Specifies the map size for the IceGrid [LMDB](http://www.lmdb.tech/doc/) database environment. The value is specified in
megabytes. If not specified or set to 0, IceGrid uses a system-dependent default: 10 MB on Windows, and 100 MB on other
platforms.

# IceGrid.Registry.LMDB.Path

#### Synopsis

`IceGrid.Registry.LMDB.Path=path`

#### Description

Specifies the path of IceGrid registry LMDB [database environment](../icegrid-persistent-data). The directory specified
in `path` must exist - the IceGrid registry does not create this directory.

# IceGrid.Registry.NodeSessionTimeout

#### Synopsis

`IceGrid.Registry.NodeSessionTimeout=num`

#### Description

Each IceGrid node establishes a session with the registry that must be refreshed periodically. If a node does not
refresh its session within `num` seconds, the node's session is destroyed and the servers deployed on that node become
unavailable to new clients. If not specified, the default value is 30 seconds.

# IceGrid.Registry.PermissionsVerifier

#### Synopsis

`IceGrid.Registry.PermissionsVerifier=proxy`

#### Description

Specifies the proxy of an object that implements the `Glacier2::PermissionsVerifier` interface for
[controlling access to IceGrid sessions](../resource-allocation-using-icegrid-sessions). The IceGrid registry invokes
this proxy to validate each new client session created by a client with the `IceGrid::Registry` interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

# IceGrid.Registry.ReplicaName

#### Synopsis

`IceGrid.Registry.ReplicaName=name`

#### Description

Specifies the name of a [registry replica](../registry-replication). If not defined, the default value is `Master`,
which is the name reserved for the master replica. Each registry replica must have a unique name.

# IceGrid.Registry.ReplicaSessionTimeout

#### Synopsis

`IceGrid.Registry.ReplicaSessionTimeout=num`

#### Description

Each IceGrid [registry replica](../registry-replication) establishes a session with the master registry that must be
refreshed periodically. If a replica does not refresh its session within `num` seconds, the replica's session is
destroyed and the replica no longer receives replication information from the master registry. If not specified, the
default value is 30 seconds.

# IceGrid.Registry.Server._AdapterProperty_

#### Synopsis

`IceGrid.Registry.Server.AdapterProperty=value`

#### Description

The IceGrid registry uses the adapter name `IceGrid.Registry.Server` for the object adapter that processes incoming
requests from servers. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this
adapter. (Note any setting of `IceGrid.Registry.Server.AdapterId` is ignored because the registry always provides a
direct adapter.)

# IceGrid.Registry.SessionFilters

#### Synopsis

`IceGrid.Registry.SessionFilters=num`

#### Description

This property controls whether IceGrid establishes filters for sessions created with the
[IceGrid session manager](../glacier2-integration-with-icegrid). If `num` is set to a value larger than zero, IceGrid
establishes these filters, so Glacier2 limits access to the `IceGrid::Query` and `IceGrid::Session` objects, and to
objects and adapters allocated by the session. If `num` is set to zero, IceGrid does not establish filters, so access to
objects is controlled solely by Glacier2's configuration.

The default value is 0.

# IceGrid.Registry.SessionManager._AdapterProperty_

#### Synopsis

`IceGrid.Registry.SessionManager.AdapterProperty=value`

#### Description

The IceGrid registry uses the adapter name `IceGrid.Registry.SessionManager` for the object adapter that processes
incoming requests from [client sessions](../resource-allocation-using-icegrid-sessions). Therefore,
[adapter properties](../object-adapter-properties) can be used to configure this adapter. (Note any setting of
`IceGrid.Registry.SessionManager.AdapterId` is ignored because the registry always provides a direct adapter.)

For security reasons, defining endpoints for this object adapter is optional. If you do define endpoints, they should
only be accessible to Glacier2 routers used to create IceGrid client sessions.

# IceGrid.Registry.SSLPermissionsVerifier

#### Synopsis

`IceGrid.Registry.SSLPermissionsVerifier=proxy`

#### Description

Specifies the proxy of an object that implements the `Glacier2::SSLPermissionsVerifier` interface for
[controlling access to IceGrid sessions](../resource-allocation-using-icegrid-sessions). The IceGrid registry invokes
this proxy to validate each new client session created by a client from a secure connection with the `IceGrid::Registry`
interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

# IceGrid.Registry.Trace.Adapter

#### Synopsis

`IceGrid.Registry.Trace.Adapter=num`

#### Description

The object adapter trace level:

| `0` | No object adapter trace (default).                           |
| --- | ------------------------------------------------------------ |
| `1` | Trace object adapter registration, removal, and replication. |

# IceGrid.Registry.Trace.Admin

#### Synopsis

`IceGrid.Registry.Trace.Admin=num`

#### Description

Set the trace level for the routing of operations to Ice.Admin objects through this registry.

| 0   | No admin trace (default).                        |
| --- | ------------------------------------------------ |
| 1   | Trace routing of operations to Ice.Admin objects |

# IceGrid.Registry.Trace.Application

#### Synopsis

`IceGrid.Registry.Trace.Application=num`

#### Description

The application trace level:

| 0   | No application trace (default).                  |
| --- | ------------------------------------------------ |
| 1   | Trace application addition, update, and removal. |

# IceGrid.Registry.Trace.Discovery

#### Synopsis

`IceGrid.Registry.Trace.Discovery=num`

#### Description

The discovery trace level:

| `0` | No discovery trace (default).                    |
| --- | ------------------------------------------------ |
| `1` | Trace replied discovery lookup requests.         |
| 2   | Like 1, also includes discarded lookup requests. |

# IceGrid.Registry.Trace.Locator

#### Synopsis

`IceGrid.Registry.Trace.Locator=num`

#### Description

The locator and locator registry trace level:

| 0   | No locator trace (default).                                                                |
| --- | ------------------------------------------------------------------------------------------ |
| 1   | Trace failures to locate an adapter or object, and failures to register adapter endpoints. |
| 2   | Like 1, but more verbose, including registration of adapter endpoints.                     |

# IceGrid.Registry.Trace.Node

#### Synopsis

`IceGrid.Registry.Trace.Node=num`

#### Description

The node trace level:

| 0   | No node trace (default).                             |
| --- | ---------------------------------------------------- |
| 1   | Trace node registration, removal.                    |
| 2   | Like 1, but more verbose, including load statistics. |

# IceGrid.Registry.Trace.Object

#### Synopsis

`IceGrid.Registry.Trace.Object=num`

#### Description

The object trace level:

| 0   | No object trace (default).          |
| --- | ----------------------------------- |
| 1   | Trace object registration, removal. |

# IceGrid.Registry.Trace.Replica

#### Synopsis

`IceGrid.Registry.Trace.Replica=num`

#### Description

The server trace level:

| 0   | No server trace (default).                                 |
| --- | ---------------------------------------------------------- |
| 1   | Trace session lifecycle between master replica and slaves. |

# IceGrid.Registry.Trace.Server

#### Synopsis

`IceGrid.Registry.Trace.Server=num`

#### Description

The server trace level:

| 0   | No server trace (default).                                                             |
| --- | -------------------------------------------------------------------------------------- |
| 1   | Trace the addition and removal of servers in the Registry database.                    |
| 2   | Like 1, but more verbose: includes load/unload failures, properties updates, and more. |

# IceGrid.Registry.Trace.Session

#### Synopsis

`IceGrid.Registry.Trace.Session=num`

#### Description

The session trace level:

| 0   | No client or admin session trace (default).             |
| --- | ------------------------------------------------------- |
| 1   | Trace client or admin session registration, removal.    |
| 2   | Like 1, but more verbose, includes keep alive messages. |

# IceGrid.Registry.UserAccounts

#### Synopsis

`IceGrid.Registry.UserAccounts=file`

#### Description

Specifies the file name of an IceGrid registry user account map file. Each line of the file must contain an identifier
and a user account, separated by white space. The identifier will be matched against the client session identifier (the
user ID for sessions created with a user ID and password, or the distinguished name for sessions created from a secure
connection). This user account map file is used by IceGrid nodes to map session identifiers to user accounts if the
nodes' IceGrid.Node.UserAccountMapper property is set to the proxy `IceGrid/RegistryUserAccountMapper`.
