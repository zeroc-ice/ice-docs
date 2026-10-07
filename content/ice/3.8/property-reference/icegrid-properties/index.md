---
title: IceGrid.*
---

## IceGrid.InstanceName

{% synopsis %}

`IceGrid.InstanceName=name`

{% /synopsis %}

{% description %}

Specifies an alternate identity category for the
[well-known IceGrid objects](../../services/icegrid/icegrid-server-reference/well-known-registry-objects). If defined,
the IceGrid objects use `name` as their identity category, for example:

`name/AdminSessionManager` `name/AdminSessionManager-replica` `name/AdminSSLSessionManager`
`name/AdminSSLSessionManager-replica` `name/NullPermissionsVerifier` `name/NullSSLPermissionsVerifier` `name/Locator`
`name/Query` `name/Registry` `name/Registry-replica` `name/RegistryUserAccountMapper`
`name/RegistryUserAccountMapper-replica` `name/SessionManager` `name/SSLSessionManager`

If this property is not set, the category (`name`) is computed as follows:

- if `IceLocatorDiscovery.InstanceName` is defined, use its value; otherwise
- if a default locator is set on the communicator (typically via `Ice.Default.Locator`), use the category of the locator
  proxy; otherwise
- use `IceGrid`

For example, in the configuration of an IceGrid node, you don’t need to set `IceGrid.InstanceName` since you already
specify it indirectly with `Ice.Default.Locator`.

{% /description %}

## IceGrid.Node._AdapterProperty_

{% synopsis %}

`IceGrid.Node.AdapterProperty=value`

{% /synopsis %}

{% description %}

An IceGrid node uses the adapter name `IceGrid.Node` for the object adapter that the registry contacts to communicate
with the node. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this adapter.

{% /description %}

## IceGrid.Node.AllowEndpointsOverride

{% synopsis %}

`IceGrid.Node.AllowEndpointsOverride=num`

{% /synopsis %}

{% description %}

If `num` is set to a non-zero value, an IceGrid node permits servers to override previously set endpoints even if the
server is active. Setting this property to a non-zero value is necessary if the servers managed by the node use the
object adapter operation `refreshPublishedEndpoints`. The default value of `num` is zero.

{% /description %}

## IceGrid.Node.AllowRunningServersAsRoot

{% synopsis %}

`IceGrid.Node.AllowRunningServersAsRoot=num`

{% /synopsis %}

{% description %}

If `num` is set to a non-zero value, an IceGrid node will permit servers started by the node to run with super-user
privileges. Note that you should not set this property unless the node uses a secure endpoint; otherwise, clients can
start arbitrary processes with super-user privileges on the node's machine.

The default value of `num` is zero.

{% /description %}

## IceGrid.Node.CollocateRegistry

{% synopsis %}

`IceGrid.Node.CollocateRegistry=num`

{% /synopsis %}

{% description %}

If `num` is set to a value larger than zero, the [node](../../services/icegrid/icegrid-server-reference/icegridnode)
collocates the IceGrid registry.

The collocated registry is configured with the same properties as the standalone IceGrid registry.

{% /description %}

## IceGrid.Node.Data

{% synopsis %}

`IceGrid.Node.Data=path`

{% /synopsis %}

{% description %}

Defines the path of the IceGrid node [data directory](../../services/icegrid/icegrid-server-reference/icegridnode). This
property must be defined for each node, and the directory must already exist. The node creates a `servers` subdirectory
in this directory if it does not already exist; `servers` contains the configuration files and data directory of each
[deployed server](../../services/icegrid/using-icegrid-deployment).

{% /description %}

## IceGrid.Node.DisableOnFailure

{% synopsis %}

`IceGrid.Node.DisableOnFailure=num`

{% /synopsis %}

{% description %}

The node considers a server to have terminated improperly if it has a non-zero exit code or if it exits due to one of
the signals `SIGABRT`, `SIGBUS`, `SIGILL`, `SIGFPE`, or `SIGSEGV`. The node marks such a server as disabled if `num` is
a non-zero value; a [disabled server](../../services/icegrid/icegrid-troubleshooting) cannot be activated on demand. For
values of `num` greater than zero, the server is disabled for `num` seconds. If `num` is a negative value, the server is
disabled indefinitely, or until it is explicitly enabled or started via an administrative action. The default value is
zero, meaning the node does not disable servers in this situation.

{% /description %}

## IceGrid.Node.Name

{% synopsis %}

`IceGrid.Node.Name=name`

{% /synopsis %}

{% description %}

Defines the `name` of the IceGrid node. Each node in an IceGrid deployment must have a unique name. This property must
be defined for each node.

{% /description %}

## IceGrid.Node.Output

{% synopsis %}

`IceGrid.Node.Output=path`

{% /synopsis %}

{% description %}

Defines the path of the IceGrid node output directory. If set, the node redirects the `stdout` of each server it starts
to `path/server-id.out` and its `stderr` to `path/server-id.err`, where `server-id` is the server's ID. A server whose
own configuration sets [Ice.StdOut](../ice-properties) or [Ice.StdErr](../ice-properties) keeps that setting. With
[IceGrid.Node.RedirectErrToOut](#icegrid.node.redirecterrtoout) set, `stderr` goes to the `.out` file too. If this
property is not set, the servers share the `stdout` and `stderr` of the node's process.

{% /description %}

## IceGrid.Node.PrintServersReady

{% synopsis %}

`IceGrid.Node.PrintServersReady=token`

{% /synopsis %}

{% description %}

The IceGrid node prints "`token` ready" on standard output after all the servers managed by the node are ready. This is
useful for scripts that wish to wait until all servers have been started and are ready for use.

{% /description %}

## IceGrid.Node.ProcessorSocketCount

{% synopsis %}

`IceGrid.Node.ProcessorSocketCount=num`

{% /synopsis %}

{% description %}

This property sets the number of processor sockets. This value is reported by the
[icegridadmin](../../services/icegrid/icegridadmin-command-line-tool) `node sockets` command. On Windows Vista (or
later), Windows Server 2008 (or later), and Linux systems, the number of processor sockets is set automatically by the
Ice run time. On other systems, the run time cannot obtain the socket count from the operating system; you can use this
property to set the number of processor sockets manually on such systems.

{% /description %}

## IceGrid.Node.PropertiesOverride

{% synopsis %}

`IceGrid.Node.PropertiesOverride=overrides`

{% /synopsis %}

{% description %}

Defines a list of properties that override the properties defined in server deployment descriptors. For example, in some
cases it is desirable to set the property [Ice.Default.Host](../ice-default-properties) for servers, but not in server
deployment descriptors. The property definitions must be separated by white space.

{% /description %}

## IceGrid.Node.RedirectErrToOut

{% synopsis %}

`IceGrid.Node.RedirectErrToOut=num`

{% /synopsis %}

{% description %}

If `num` is set to a value larger than zero, the node redirects the `stderr` of each server it starts to the server's
`.out` file instead of its `.err` file. This property takes effect only when [IceGrid.Node.Output](#icegrid.node.output)
is set.

{% /description %}

## IceGrid.Node.Trace.Activator

{% synopsis %}

`IceGrid.Node.Trace.Activator=num`

{% /synopsis %}

{% description %}

The activator trace level:

| Value | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | No activator trace (default).                                                                                                                                                                                                                                                                                                                                                               |
| 1     | Trace process activation, termination.                                                                                                                                                                                                                                                                                                                                                      |
| 2     | Like 1, but more verbose: includes process signaling, the activation parameters of each spawned server (path, working directory, uid/gid, arguments, and environment variables), and more diagnostic messages. Note: environment variables and arguments may carry secrets (passwords, tokens, certificate passphrases) injected via your deployment — treat the trace output as sensitive. |

{% /description %}

## IceGrid.Node.Trace.Adapter

{% synopsis %}

`IceGrid.Node.Trace.Adapter=num`

{% /synopsis %}

{% description %}

The object adapter trace level:

| Value | Description                                                             |
| ----- | ----------------------------------------------------------------------- |
| 0, 1  | No object adapter trace. The default value is `0`.                      |
| 2     | Trace object adapter activation, deactivation, and activation failures. |
| 3     | Like 2, plus requests waiting for the activation of an object adapter.  |

{% /description %}

## IceGrid.Node.Trace.Admin

{% synopsis %}

`IceGrid.Node.Trace.Admin=num`

{% /synopsis %}

{% description %}

Set the trace level for the routing of operations to Ice.Admin objects through this node.

| Value | Description                                      |
| ----- | ------------------------------------------------ |
| 0     | No admin trace (default).                        |
| 1     | Trace routing of operations to Ice.Admin objects |

{% /description %}

## IceGrid.Node.Trace.Replica

{% synopsis %}

`IceGrid.Node.Trace.Replica=num`

{% /synopsis %}

{% description %}

The replica trace level:

| Value | Description                                                                      |
| ----- | -------------------------------------------------------------------------------- |
| 0     | No replica trace (default).                                                      |
| 1     | Trace session lifecycle between nodes and replicas.                              |
| 2     | Like 1, but more verbose, including session establishment attempts and failures. |
| 3     | Like 2, but more verbose, including keep alive messages sent to the replica.     |

{% /description %}

## IceGrid.Node.Trace.Server

{% synopsis %}

`IceGrid.Node.Trace.Server=num`

{% /synopsis %}

{% description %}

Sets the node's trace level for server configuration updates and state changes:

| Value | Description                                                                                                                                                                                                          |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | No server trace (default).                                                                                                                                                                                           |
| 1     | Trace completed server configuration and runtime property updates.                                                                                                                                                   |
| 2     | Like 1, plus runtime property update attempts for individual servers and services, activation timeouts, and changes to the Active, Inactive, and Destroyed states. Changes from Loading to Inactive require level 3. |
| 3     | Like 2, plus all other server state changes, including Loading and WaitForActivation.                                                                                                                                |

{% /description %}

## IceGrid.Node.UserAccountMapper

{% synopsis %}

`IceGrid.Node.UserAccountMapper=proxy`

{% /synopsis %}

{% description %}

Specifies the proxy of an object that implements the `IceGrid::UserAccountMapper` interface for
[customizing](../../services/icegrid/icegrid-server-activation) the user accounts under which servers are activated. The
IceGrid node invokes this proxy to map session identifiers (the user ID for sessions created with a user ID and
password, or the distinguished name for sessions created from a secure connection) to user accounts.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

{% /description %}

## IceGrid.Node.UserAccounts

{% synopsis %}

`IceGrid.Node.UserAccounts=file`

{% /synopsis %}

{% description %}

Specifies the file name of an IceGrid node user account map file. Each line of the file contains a user account, white
space, and an identifier; the identifier is the rest of the line and may contain spaces. A `#` starts a comment that
runs to the end of the line. The identifier is matched against the client session identifier (the user ID for sessions
created with a user ID and password, or the distinguished name for sessions created from a secure connection). This user
account map file is used by the node to
[map session identifiers to user accounts](../../services/icegrid/icegrid-server-activation). This property is ignored
if IceGrid.Node.UserAccountMapper is defined.

{% /description %}

## IceGrid.Node.WaitTime

{% synopsis %}

`IceGrid.Node.WaitTime=num`

{% /synopsis %}

{% description %}

Defines the interval in seconds that IceGrid waits for
[server activation and deactivation](../../services/icegrid/icegrid-server-activation).

If a server is automatically activated and does not register its object adapter endpoints within this time interval, the
node assumes there is a problem with the server and returns an empty set of endpoints to the client.

If a server is being gracefully deactivated and IceGrid does not detect the server deactivation during this time
interval, IceGrid kills the server.

A server descriptor's `activation-timeout` and `deactivation-timeout` attributes, when set to a non-zero value, override
this property for that server.

The default value is 60 seconds.

{% /description %}

## IceGrid.Registry.AdminCryptPasswords

{% synopsis %}

`IceGrid.Registry.AdminCryptPasswords=file`

{% /synopsis %}

{% description %}

Specifies the file name of an IceGrid registry
[access control list for administrative clients](../../services/icegrid/resource-allocation-using-icegrid-sessions). The
file uses the format described in [IceGrid.Registry.CryptPasswords](#icegrid.registry.cryptpasswords). This property is
ignored if [IceGrid.Registry.AdminPermissionsVerifier](#icegrid.registry.adminpermissionsverifier) is defined. When
neither property is defined, the registry rejects administrative sessions created with a user name and password.

{% /description %}

## IceGrid.Registry.AdminPermissionsVerifier

{% synopsis %}

`IceGrid.Registry.AdminPermissionsVerifier=proxy`

{% /synopsis %}

{% description %}

Specifies the proxy of an object that implements the `Glacier2::PermissionsVerifier` interface for
[controlling access to IceGrid administrative sessions](../../services/icegrid/icegrid-administrative-sessions). The
IceGrid registry invokes this proxy to validate each new administrative session created by a client with the
`IceGrid::Registry` interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

{% /description %}

## IceGrid.Registry.AdminSessionFilters

{% synopsis %}

`IceGrid.Registry.AdminSessionFilters=num`

{% /synopsis %}

{% description %}

When a client creates an administrative session through a [Glacier2](../../services/glacier2) router, using the
[IceGrid session manager](../../services/icegrid/glacier2-integration-with-icegrid), this property controls whether
IceGrid restricts the objects the client can reach through the router. If `num` is set to a value larger than zero,
IceGrid configures [Glacier2's filters](../../services/glacier2/securing-a-glacier2-router) for the session to allow
only the `IceGrid::AdminSession` object, the `IceGrid::Admin` object that is returned by the `getAdmin` operation, the
`IceGrid::Query` object, and the server admin objects returned by `IceGrid::Admin::getServerAdmin`. If `num` is set to
zero, IceGrid configures no filters, and access to objects is controlled solely by Glacier2's configuration.

The default value is `0`.

{% /description %}

## IceGrid.Registry.AdminSessionManager._AdapterProperty_

{% synopsis %}

`IceGrid.Registry.AdminSessionManager.AdapterProperty=value`

{% /synopsis %}

{% description %}

The IceGrid registry uses the adapter name `IceGrid.Registry.AdminSessionManager` for the object adapter that processes
incoming requests from [IceGrid administrative sessions](../../services/icegrid/icegrid-administrative-sessions).
Therefore, [adapter properties](../object-adapter-properties) can be used to configure this adapter. (Note any setting
of `IceGrid.Registry.AdminSessionManager.AdapterId` is ignored because the registry always provides a direct adapter.)

For security reasons, defining endpoints for this object adapter is optional. If you do define endpoints, they should
only be accessible to Glacier2 routers used to create IceGrid administrative sessions.

{% /description %}

## IceGrid.Registry.AdminSSLPermissionsVerifier

{% synopsis %}

`IceGrid.Registry.AdminSSLPermissionsVerifier=proxy`

{% /synopsis %}

{% description %}

Specifies the proxy of an object that implements the `Glacier2::SSLPermissionsVerifier` interface for
[controlling access to IceGrid administrative sessions](../../services/icegrid/icegrid-administrative-sessions). The
IceGrid registry invokes this proxy to validate each new administrative session created by a client from a secure
connection with the `IceGrid::Registry` interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using the properties.

{% /description %}

## IceGrid.Registry.Client._AdapterProperty_

{% synopsis %}

`IceGrid.Registry.Client.AdapterProperty=value`

{% /synopsis %}

{% description %}

IceGrid uses the adapter name `IceGrid.Registry.Client` for the object adapter that processes incoming requests from
clients. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this adapter. (Note any
setting of `IceGrid.Registry.Client.AdapterId` is ignored because the registry always provides a direct adapter.)

Note that [IceGrid.Registry.Client.Endpoints](../object-adapter-properties) controls the client endpoint for the
registry. The port numbers 4061 (for TCP) and 4062 (for SSL) are reserved for the registry by the
[Internet Assigned Numbers Authority](https://www.iana.org/assignments/service-names-port-numbers) (IANA).

{% /description %}

## IceGrid.Registry.CryptPasswords

{% synopsis %}

`IceGrid.Registry.CryptPasswords=file`

{% /synopsis %}

{% description %}

Specifies the file name of an IceGrid registry
[access control list](../../services/icegrid/resource-allocation-using-icegrid-sessions). Each line of the file contains
a user name and a password hash, separated by white space. The supported hash formats depend on the platform; see
[Writing a Password File](../../services/glacier2/getting-started-with-glacier2).

This property is ignored if [IceGrid.Registry.PermissionsVerifier](#icegrid.registry.permissionsverifier) is defined.
When neither property is defined, the registry rejects sessions created with a user name and password.

{% /description %}

## IceGrid.Registry.DefaultTemplates

{% synopsis %}

`IceGrid.Registry.DefaultTemplates=path`

{% /synopsis %}

{% description %}

Defines the path name of an XML file containing default
[template descriptors](../../services/icegrid/icegrid-templates). A sample file named `config/templates.xml` that
contains convenient server templates for Ice services is provided in the Ice distribution.

When this property is not set, the registry has no default templates.

{% /description %}

## IceGrid.Registry.Discovery._AdapterProperty_

{% synopsis %}

`IceGrid.Registry.Discovery.AdapterProperty=value`

{% /synopsis %}

{% description %}

The IceGrid registry creates an object adapter named `IceGrid.Registry.Discovery` for receiving
[multicast discovery queries](../../plugins/icelocatordiscovery) from clients. If not otherwise defined by
`IceGrid.Registry.Discovery.Endpoints`, the endpoint for this object adapter is composed as follows:

`udp -h addr -p port [--interface intf]`

where `addr` is the value of `IceGrid.Registry.Discovery.Address`, `port` is the value of
`IceGrid.Registry.Discovery.Port`, and `intf` is the value of `IceGrid.Registry.Discovery.Interface`.

You don't normally need to set [other properties](../object-adapter-properties) for this object adapter.

{% /description %}

## IceGrid.Registry.Discovery.Address

{% synopsis %}

`IceGrid.Registry.Discovery.Address=addr`

{% /synopsis %}

{% description %}

Specifies the multicast IP address to use for receiving multicast discovery queries. The default value is `239.255.0.1`;
it is `ff15::1` when [Ice.IPv4](../ice-properties) is disabled or [Ice.PreferIPv6Address](../ice-properties) is enabled.
This property is used to compose the endpoint of the IceGrid.Registry.Discovery object adapter.

{% /description %}

## IceGrid.Registry.Discovery.Enabled

{% synopsis %}

`IceGrid.Registry.Discovery.Enabled=num`

{% /synopsis %}

{% description %}

If `num` is a value larger than zero, the registry creates the IceGrid.Registry.Discovery object adapter and listens for
[multicast discovery queries](../../plugins/icelocatordiscovery). If not defined, the default value is `1`. Set this
property to zero to disable multicast discovery.

{% /description %}

## IceGrid.Registry.Discovery.Interface

{% synopsis %}

`IceGrid.Registry.Discovery.Interface=intf`

{% /synopsis %}

{% description %}

Specifies the IP address of the interface to use for receiving multicast discovery queries. If not defined, the
operating system will select a default interface to send and receive the UDP multicast datagrams. This property is used
to compose the endpoint of the IceGrid.Registry.Discovery object adapter.

{% /description %}

## IceGrid.Registry.Discovery.Port

{% synopsis %}

`IceGrid.Registry.Discovery.Port=port`

{% /synopsis %}

{% description %}

Specifies the multicast port to use for receiving multicast discovery queries. If not set, the default value is `4061`.
This property is used to compose the endpoint of the IceGrid.Registry.Discovery object adapter.

{% /description %}

## IceGrid.Registry.DynamicRegistration

{% synopsis %}

`IceGrid.Registry.DynamicRegistration=num`

{% /synopsis %}

{% description %}

If `num` is set to a value larger than zero, the locator registry does not require Ice servers to preregister object
adapters and replica groups, but rather creates them automatically if they do not exist. If this property is not
defined, or `num` is set to zero, an attempt to register an unknown object adapter or replica group causes adapter
activation to fail with `Ice.NotRegisteredException`. An object adapter registers itself when the
[_adapter_.AdapterId](../object-adapter-properties) property is defined. The
[_adapter_.ReplicaGroupId](../object-adapter-properties) property identifies the replica group. An adapter registered
with dynamic registration can only be a member of a replica group also registered with dynamic registration. Trying to
dynamically register an adapter with a replica group registered with the
[deployment facility](../../services/icegrid/using-icegrid-deployment) will fail with `Ice.NotRegisteredException`.

{% /description %}

## IceGrid.Registry.Internal._AdapterProperty_

{% synopsis %}

`IceGrid.Registry.Internal.AdapterProperty=value`

{% /synopsis %}

{% description %}

The IceGrid registry uses the adapter name `IceGrid.Registry.Internal` for the object adapter that processes incoming
requests from nodes and slave replicas. Therefore, [adapter properties](../object-adapter-properties) can be used to
configure this adapter. (Note any setting of `IceGrid.Registry.Internal.AdapterId` is ignored because the registry
always provides a direct adapter.)

{% /description %}

## IceGrid.Registry.LMDB.MapSize

{% synopsis %}

`IceGrid.Registry.LMDB.MapSize=num`

{% /synopsis %}

{% description %}

Specifies the map size for the IceGrid [LMDB](http://www.lmdb.tech/doc/) database environment. The value is specified in
megabytes. If not set, IceGrid uses a system-dependent default: 10 MB on Windows, and 100 MB on other platforms.

{% /description %}

## IceGrid.Registry.LMDB.Path

{% synopsis %}

`IceGrid.Registry.LMDB.Path=path`

{% /synopsis %}

{% description %}

Specifies the path of the directory where the IceGrid registry keeps its
[persistent data](../../services/icegrid/icegrid-server-reference/icegrid-persistent-data), stored in an
[LMDB](http://www.lmdb.tech/doc/) database environment: the deployed applications, and the well-known objects and object
adapter endpoints registered at run time. This property must be defined, and the directory specified in `path` must
exist: the IceGrid registry does not create this directory.

{% /description %}

## IceGrid.Registry.NodeSessionTimeout

{% synopsis %}

`IceGrid.Registry.NodeSessionTimeout=num`

{% /synopsis %}

{% description %}

Each IceGrid node establishes a session with the registry that must be refreshed periodically. If a node does not
refresh its session within `num` seconds, the node's session is destroyed and the servers deployed on that node become
unavailable to new clients. If not specified, the default value is 30 seconds.

A value of `0` disables the expiration of node sessions; any other value must be at least `10`.

{% /description %}

## IceGrid.Registry.PermissionsVerifier

{% synopsis %}

`IceGrid.Registry.PermissionsVerifier=proxy`

{% /synopsis %}

{% description %}

Specifies the proxy of an object that implements the `Glacier2::PermissionsVerifier` interface for
[controlling access to IceGrid sessions](../../services/icegrid/resource-allocation-using-icegrid-sessions). The IceGrid
registry invokes this proxy to validate each new client session created by a client with the `IceGrid::Registry`
interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

{% /description %}

## IceGrid.Registry.ReplicaName

{% synopsis %}

`IceGrid.Registry.ReplicaName=name`

{% /synopsis %}

{% description %}

Specifies the name of a [registry replica](../../services/icegrid/registry-replication). If not defined, the default
value is `Master`, which is the name reserved for the master replica. Each registry replica must have a unique name.

{% /description %}

## IceGrid.Registry.ReplicaSessionTimeout

{% synopsis %}

`IceGrid.Registry.ReplicaSessionTimeout=num`

{% /synopsis %}

{% description %}

Each IceGrid [registry replica](../../services/icegrid/registry-replication) establishes a session with the master
registry that must be refreshed periodically. If a replica does not refresh its session within `num` seconds, the
replica's session is destroyed and the replica no longer receives replication information from the master registry. If
not specified, the default value is 30 seconds.

A value of `0` disables the expiration of replica sessions; any other value must be at least `10`.

{% /description %}

## IceGrid.Registry.Server._AdapterProperty_

{% synopsis %}

`IceGrid.Registry.Server.AdapterProperty=value`

{% /synopsis %}

{% description %}

The IceGrid registry uses the adapter name `IceGrid.Registry.Server` for the object adapter that processes incoming
requests from servers. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this
adapter. (Note any setting of `IceGrid.Registry.Server.AdapterId` is ignored because the registry always provides a
direct adapter.)

{% /description %}

## IceGrid.Registry.SessionFilters

{% synopsis %}

`IceGrid.Registry.SessionFilters=num`

{% /synopsis %}

{% description %}

This property controls whether IceGrid establishes filters for sessions created with the
[IceGrid session manager](../../services/icegrid/glacier2-integration-with-icegrid). If `num` is set to a value larger
than zero, IceGrid establishes these filters, so Glacier2 limits access to the `IceGrid::Query` and `IceGrid::Session`
objects, and to objects and adapters allocated by the session. If `num` is set to zero, IceGrid does not establish
filters, so access to objects is controlled solely by Glacier2's configuration.

The default value is `0`.

{% /description %}

## IceGrid.Registry.SessionManager._AdapterProperty_

{% synopsis %}

`IceGrid.Registry.SessionManager.AdapterProperty=value`

{% /synopsis %}

{% description %}

The IceGrid registry uses the adapter name `IceGrid.Registry.SessionManager` for the object adapter that processes
incoming requests from [client sessions](../../services/icegrid/resource-allocation-using-icegrid-sessions). Therefore,
[adapter properties](../object-adapter-properties) can be used to configure this adapter. (Note any setting of
`IceGrid.Registry.SessionManager.AdapterId` is ignored because the registry always provides a direct adapter.)

For security reasons, defining endpoints for this object adapter is optional. If you do define endpoints, they should
only be accessible to Glacier2 routers used to create IceGrid client sessions.

{% /description %}

## IceGrid.Registry.SSLPermissionsVerifier

{% synopsis %}

`IceGrid.Registry.SSLPermissionsVerifier=proxy`

{% /synopsis %}

{% description %}

Specifies the proxy of an object that implements the `Glacier2::SSLPermissionsVerifier` interface for
[controlling access to IceGrid sessions](../../services/icegrid/resource-allocation-using-icegrid-sessions). The IceGrid
registry invokes this proxy to validate each new client session created by a client from a secure connection with the
`IceGrid::Registry` interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

{% /description %}

## IceGrid.Registry.Trace.Adapter

{% synopsis %}

`IceGrid.Registry.Trace.Adapter=num`

{% /synopsis %}

{% description %}

The object adapter trace level:

| `0` | No object adapter trace (default).                           |
| --- | ------------------------------------------------------------ |
| `1` | Trace object adapter registration, removal, and replication. |

{% /description %}

## IceGrid.Registry.Trace.Admin

{% synopsis %}

`IceGrid.Registry.Trace.Admin=num`

{% /synopsis %}

{% description %}

Set the trace level for the routing of operations to Ice.Admin objects through this registry.

| Value | Description                                      |
| ----- | ------------------------------------------------ |
| 0     | No admin trace (default).                        |
| 1     | Trace routing of operations to Ice.Admin objects |

{% /description %}

## IceGrid.Registry.Trace.Application

{% synopsis %}

`IceGrid.Registry.Trace.Application=num`

{% /synopsis %}

{% description %}

The application trace level:

| Value | Description                                      |
| ----- | ------------------------------------------------ |
| 0     | No application trace (default).                  |
| 1     | Trace application addition, update, and removal. |

{% /description %}

## IceGrid.Registry.Trace.Discovery

{% synopsis %}

`IceGrid.Registry.Trace.Discovery=num`

{% /synopsis %}

{% description %}

The discovery trace level:

| `0` | No discovery trace (default).                    |
| --- | ------------------------------------------------ |
| `1` | Trace replied discovery lookup requests.         |
| 2   | Like 1, also includes discarded lookup requests. |

{% /description %}

## IceGrid.Registry.Trace.Locator

{% synopsis %}

`IceGrid.Registry.Trace.Locator=num`

{% /synopsis %}

{% description %}

The locator and locator registry trace level:

| Value | Description                                                                                |
| ----- | ------------------------------------------------------------------------------------------ |
| 0     | No locator trace (default).                                                                |
| 1     | Trace failures to locate an adapter or object, and failures to register adapter endpoints. |
| 2     | Like 1, but more verbose, including registration of adapter endpoints.                     |

{% /description %}

## IceGrid.Registry.Trace.Node

{% synopsis %}

`IceGrid.Registry.Trace.Node=num`

{% /synopsis %}

{% description %}

The node trace level:

| Value | Description                                                               |
| ----- | ------------------------------------------------------------------------- |
| 0     | No node trace (default).                                                  |
| 1, 2  | Trace nodes going up and down, and node session creation and destruction. |
| 3     | Like 1, plus the keep-alive messages of each node with its load averages. |

{% /description %}

## IceGrid.Registry.Trace.Object

{% synopsis %}

`IceGrid.Registry.Trace.Object=num`

{% /synopsis %}

{% description %}

The object trace level:

| Value | Description                                                     |
| ----- | --------------------------------------------------------------- |
| 0     | No object trace (default).                                      |
| 1     | Trace object registration, removal.                             |
| 2     | Like 1, plus the allocation and release of allocatable objects. |

{% /description %}

## IceGrid.Registry.Trace.Replica

{% synopsis %}

`IceGrid.Registry.Trace.Replica=num`

{% /synopsis %}

{% description %}

The replica trace level:

| Value | Description                                                                                                    |
| ----- | -------------------------------------------------------------------------------------------------------------- |
| 0     | No replica trace (default).                                                                                    |
| 1     | Trace replicas going up and down, and the session lifecycle between the master replica and the other replicas. |
| 2     | Like 1, plus session establishment attempts and failures.                                                      |
| 3     | Like 2, plus keep-alive messages.                                                                              |

{% /description %}

## IceGrid.Registry.Trace.Server

{% synopsis %}

`IceGrid.Registry.Trace.Server=num`

{% /synopsis %}

{% description %}

The server trace level:

| Value | Description                                                                            |
| ----- | -------------------------------------------------------------------------------------- |
| 0     | No server trace (default).                                                             |
| 1     | Trace the addition and removal of servers in the Registry database.                    |
| 2     | Like 1, but more verbose: includes load/unload failures, properties updates, and more. |
| 3     | Like 2, plus the start of each server load and unload on a node.                       |

{% /description %}

## IceGrid.Registry.Trace.Session

{% synopsis %}

`IceGrid.Registry.Trace.Session=num`

{% /synopsis %}

{% description %}

The session trace level:

| Value | Description                                                                                          |
| ----- | ---------------------------------------------------------------------------------------------------- |
| 0     | No client or admin session trace (default).                                                          |
| 1     | Trace client or admin session creation and destruction, and failures to call a permissions verifier. |

{% /description %}

## IceGrid.Registry.UserAccounts

{% synopsis %}

`IceGrid.Registry.UserAccounts=file`

{% /synopsis %}

{% description %}

Specifies the file name of an IceGrid registry user account map file. The file uses the format described in
[IceGrid.Node.UserAccounts](#icegrid.node.useraccounts). The identifier is matched against the client session identifier
(the user ID for sessions created with a user ID and password, or the distinguished name for sessions created from a
secure connection). This user account map file is used by IceGrid nodes to map session identifiers to user accounts if
the nodes' IceGrid.Node.UserAccountMapper property is set to the proxy `IceGrid/RegistryUserAccountMapper`.

{% /description %}
