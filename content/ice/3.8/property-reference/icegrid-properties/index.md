---
title: IceGrid.*
---

## IceGrid.InstanceName

{% property-synopsis %}

`IceGrid.InstanceName=name`

{% /property-synopsis %}

{% property-description %}

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

{% /property-description %}

## IceGrid.Node._AdapterProperty_

{% property-synopsis %}

`IceGrid.Node.AdapterProperty=value`

{% /property-synopsis %}

{% property-description %}

An IceGrid node uses the adapter name `IceGrid.Node` for the object adapter that the registry contacts to communicate
with the node. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this adapter.

{% /property-description %}

## IceGrid.Node.AllowEndpointsOverride

{% property-synopsis %}

`IceGrid.Node.AllowEndpointsOverride=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a non-zero value, an IceGrid node permits servers to override previously set endpoints even if the
server is active. Setting this property to a non-zero value is necessary if the servers managed by the node use the
object adapter operation `refreshPublishedEndpoints`. The default value of `num` is zero.

{% /property-description %}

## IceGrid.Node.AllowRunningServersAsRoot

{% property-synopsis %}

`IceGrid.Node.AllowRunningServersAsRoot=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a non-zero value, an IceGrid node will permit servers started by the node to run with super-user
privileges. Note that you should not set this property unless the node uses a secure endpoint; otherwise, clients can
start arbitrary processes with super-user privileges on the node's machine.

The default value of `num` is zero.

{% /property-description %}

## IceGrid.Node.CollocateRegistry

{% property-synopsis %}

`IceGrid.Node.CollocateRegistry=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a value larger than zero, the [node](../../services/icegrid/icegrid-server-reference/icegridnode)
collocates the IceGrid registry.

The collocated registry is configured with the same properties as the standalone IceGrid registry.

{% /property-description %}

## IceGrid.Node.Data

{% property-synopsis %}

`IceGrid.Node.Data=path`

{% /property-synopsis %}

{% property-description %}

Defines the path of the IceGrid node [data directory](../../services/icegrid/icegrid-server-reference/icegridnode). This
property must be defined for each node, and the directory must already exist. The node creates a `servers` subdirectory
in this directory if it does not already exist; `servers` contains the configuration files and data directory of each
[deployed server](../../services/icegrid/using-icegrid-deployment).

{% /property-description %}

## IceGrid.Node.DisableOnFailure

{% property-synopsis %}

`IceGrid.Node.DisableOnFailure=num`

{% /property-synopsis %}

{% property-description %}

The node considers a server to have terminated improperly if it has a non-zero exit code or if it exits due to one of
the signals `SIGABRT`, `SIGBUS`, `SIGILL`, `SIGFPE`, or `SIGSEGV`. The node marks such a server as disabled if `num` is
a non-zero value; a [disabled server](../../services/icegrid/icegrid-troubleshooting) cannot be activated on demand. For
values of `num` greater than zero, the server is disabled for `num` seconds. If `num` is a negative value, the server is
disabled indefinitely, or until it is explicitly enabled or started via an administrative action. The default value is
zero, meaning the node does not disable servers in this situation.

{% /property-description %}

## IceGrid.Node.Name

{% property-synopsis %}

`IceGrid.Node.Name=name`

{% /property-synopsis %}

{% property-description %}

Defines the `name` of the IceGrid node. Each node in an IceGrid deployment must have a unique name. This property must
be defined for each node.

{% /property-description %}

## IceGrid.Node.Output

{% property-synopsis %}

`IceGrid.Node.Output=path`

{% /property-synopsis %}

{% property-description %}

Defines the path of the IceGrid node output directory. If set, the node redirects the `stdout` of each server it starts
to `path/server-id.out` and its `stderr` to `path/server-id.err`, where `server-id` is the server's ID. A server whose
own configuration sets [Ice.StdOut](../ice-properties) or [Ice.StdErr](../ice-properties) keeps that setting. With
[IceGrid.Node.RedirectErrToOut](#icegrid.node.redirecterrtoout) set, `stderr` goes to the `.out` file too. If this
property is not set, the servers share the `stdout` and `stderr` of the node's process.

{% /property-description %}

## IceGrid.Node.PrintServersReady

{% property-synopsis %}

`IceGrid.Node.PrintServersReady=token`

{% /property-synopsis %}

{% property-description %}

The IceGrid node prints "`token` ready" on standard output after all the servers managed by the node are ready. This is
useful for scripts that wish to wait until all servers have been started and are ready for use.

{% /property-description %}

## IceGrid.Node.ProcessorSocketCount

{% property-synopsis %}

`IceGrid.Node.ProcessorSocketCount=num`

{% /property-synopsis %}

{% property-description %}

This property sets the number of processor sockets. This value is reported by the
[icegridadmin](../../services/icegrid/icegridadmin-command-line-tool) `node sockets` command. On Windows Vista (or
later), Windows Server 2008 (or later), and Linux systems, the number of processor sockets is set automatically by the
Ice run time. On other systems, the run time cannot obtain the socket count from the operating system; you can use this
property to set the number of processor sockets manually on such systems.

{% /property-description %}

## IceGrid.Node.PropertiesOverride

{% property-synopsis %}

`IceGrid.Node.PropertiesOverride=overrides`

{% /property-synopsis %}

{% property-description %}

Defines a list of properties that override the properties defined in server deployment descriptors. For example, in some
cases it is desirable to set the property [Ice.Default.Host](../ice-default-properties) for servers, but not in server
deployment descriptors. The property definitions must be separated by white space.

{% /property-description %}

## IceGrid.Node.RedirectErrToOut

{% property-synopsis %}

`IceGrid.Node.RedirectErrToOut=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a value larger than zero, the node redirects the `stderr` of each server it starts to the server's
`.out` file instead of its `.err` file. This property takes effect only when [IceGrid.Node.Output](#icegrid.node.output)
is set.

{% /property-description %}

## IceGrid.Node.Trace.Activator

{% property-synopsis %}

`IceGrid.Node.Trace.Activator=num`

{% /property-synopsis %}

{% property-description %}

The activator trace level:

| Value | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | No activator trace (default).                                                                                                                                                                                                                                                                                                                                                               |
| 1     | Trace process activation, termination.                                                                                                                                                                                                                                                                                                                                                      |
| 2     | Like 1, but more verbose: includes process signaling, the activation parameters of each spawned server (path, working directory, uid/gid, arguments, and environment variables), and more diagnostic messages. Note: environment variables and arguments may carry secrets (passwords, tokens, certificate passphrases) injected via your deployment — treat the trace output as sensitive. |

{% /property-description %}

## IceGrid.Node.Trace.Adapter

{% property-synopsis %}

`IceGrid.Node.Trace.Adapter=num`

{% /property-synopsis %}

{% property-description %}

The object adapter trace level:

| Value | Description                                                             |
| ----- | ----------------------------------------------------------------------- |
| 0, 1  | No object adapter trace. The default value is `0`.                      |
| 2     | Trace object adapter activation, deactivation, and activation failures. |
| 3     | Like 2, plus requests waiting for the activation of an object adapter.  |

{% /property-description %}

## IceGrid.Node.Trace.Admin

{% property-synopsis %}

`IceGrid.Node.Trace.Admin=num`

{% /property-synopsis %}

{% property-description %}

Set the trace level for the routing of operations to Ice.Admin objects through this node.

| Value | Description                                      |
| ----- | ------------------------------------------------ |
| 0     | No admin trace (default).                        |
| 1     | Trace routing of operations to Ice.Admin objects |

{% /property-description %}

## IceGrid.Node.Trace.Replica

{% property-synopsis %}

`IceGrid.Node.Trace.Replica=num`

{% /property-synopsis %}

{% property-description %}

The replica trace level:

| Value | Description                                                                      |
| ----- | -------------------------------------------------------------------------------- |
| 0     | No replica trace (default).                                                      |
| 1     | Trace session lifecycle between nodes and replicas.                              |
| 2     | Like 1, but more verbose, including session establishment attempts and failures. |
| 3     | Like 2, but more verbose, including keep alive messages sent to the replica.     |

{% /property-description %}

## IceGrid.Node.Trace.Server

{% property-synopsis %}

`IceGrid.Node.Trace.Server=num`

{% /property-synopsis %}

{% property-description %}

Sets the node's trace level for server configuration updates and state changes:

| Value | Description                                                                                                                                                                                                          |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | No server trace (default).                                                                                                                                                                                           |
| 1     | Trace completed server configuration and runtime property updates.                                                                                                                                                   |
| 2     | Like 1, plus runtime property update attempts for individual servers and services, activation timeouts, and changes to the Active, Inactive, and Destroyed states. Changes from Loading to Inactive require level 3. |
| 3     | Like 2, plus all other server state changes, including Loading and WaitForActivation.                                                                                                                                |

{% /property-description %}

## IceGrid.Node.UserAccountMapper

{% property-synopsis %}

`IceGrid.Node.UserAccountMapper=proxy`

{% /property-synopsis %}

{% property-description %}

Specifies the proxy of an object that implements the `IceGrid::UserAccountMapper` interface for
[customizing](../../services/icegrid/icegrid-server-activation) the user accounts under which servers are activated. The
IceGrid node invokes this proxy to map session identifiers (the user ID for sessions created with a user ID and
password, or the distinguished name for sessions created from a secure connection) to user accounts.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

{% /property-description %}

## IceGrid.Node.UserAccounts

{% property-synopsis %}

`IceGrid.Node.UserAccounts=file`

{% /property-synopsis %}

{% property-description %}

Specifies the file name of an IceGrid node user account map file. Each line of the file contains a user account, white
space, and an identifier; the identifier is the rest of the line and may contain spaces. A `#` starts a comment that
runs to the end of the line. The identifier is matched against the client session identifier (the user ID for sessions
created with a user ID and password, or the distinguished name for sessions created from a secure connection). This user
account map file is used by the node to
[map session identifiers to user accounts](../../services/icegrid/icegrid-server-activation). This property is ignored
if IceGrid.Node.UserAccountMapper is defined.

{% /property-description %}

## IceGrid.Node.WaitTime

{% property-synopsis %}

`IceGrid.Node.WaitTime=num`

{% /property-synopsis %}

{% property-description %}

Defines the interval in seconds that IceGrid waits for
[server activation and deactivation](../../services/icegrid/icegrid-server-activation).

If a server is automatically activated and does not register its object adapter endpoints within this time interval, the
node assumes there is a problem with the server and returns an empty set of endpoints to the client.

If a server is being gracefully deactivated and IceGrid does not detect the server deactivation during this time
interval, IceGrid kills the server.

A server descriptor's `activation-timeout` and `deactivation-timeout` attributes, when set to a non-zero value, override
this property for that server.

The default value is 60 seconds.

{% /property-description %}

## IceGrid.Registry.AdminCryptPasswords

{% property-synopsis %}

`IceGrid.Registry.AdminCryptPasswords=file`

{% /property-synopsis %}

{% property-description %}

Specifies the file name of an IceGrid registry
[password file for administrative clients](../../services/icegrid/resource-allocation-using-icegrid-sessions). The file
uses the format described in [IceGrid.Registry.CryptPasswords](#icegrid.registry.cryptpasswords). This property is
ignored if [IceGrid.Registry.AdminPermissionsVerifier](#icegrid.registry.adminpermissionsverifier) is defined. When
neither property is defined, the registry rejects administrative sessions created with a user name and password.

{% /property-description %}

## IceGrid.Registry.AdminPermissionsVerifier

{% property-synopsis %}

`IceGrid.Registry.AdminPermissionsVerifier=proxy`

{% /property-synopsis %}

{% property-description %}

Specifies the proxy of an object that implements the `Glacier2::PermissionsVerifier` interface for
[controlling access to IceGrid administrative sessions](../../services/icegrid/icegrid-administrative-sessions). The
IceGrid registry invokes this proxy to validate each new administrative session created by a client with the
`IceGrid::Registry` interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

{% /property-description %}

## IceGrid.Registry.AdminSessionFilters

{% property-synopsis %}

`IceGrid.Registry.AdminSessionFilters=num`

{% /property-synopsis %}

{% property-description %}

When a client creates an administrative session through a [Glacier2](../../services/glacier2) router, using the
[IceGrid session manager](../../services/icegrid/glacier2-integration-with-icegrid), this property controls whether
IceGrid restricts the objects the client can reach through the router. If `num` is set to a value larger than zero,
IceGrid configures [Glacier2's filters](../../services/glacier2/securing-a-glacier2-router) for the session to allow
only the `IceGrid::AdminSession` object, the `IceGrid::Admin` object that is returned by the `getAdmin` operation, the
`IceGrid::Query` object, and the server admin objects returned by `IceGrid::Admin::getServerAdmin`. If `num` is set to
zero, IceGrid configures no filters, and access to objects is controlled solely by Glacier2's configuration.

The default value is `0`.

{% /property-description %}

## IceGrid.Registry.AdminSessionManager._AdapterProperty_

{% property-synopsis %}

`IceGrid.Registry.AdminSessionManager.AdapterProperty=value`

{% /property-synopsis %}

{% property-description %}

The IceGrid registry uses the adapter name `IceGrid.Registry.AdminSessionManager` for the object adapter that processes
incoming requests from [IceGrid administrative sessions](../../services/icegrid/icegrid-administrative-sessions).
Therefore, [adapter properties](../object-adapter-properties) can be used to configure this adapter. (Note any setting
of `IceGrid.Registry.AdminSessionManager.AdapterId` is ignored because the registry always provides a direct adapter.)

For security reasons, defining endpoints for this object adapter is optional. If you do define endpoints, they should
only be accessible to Glacier2 routers used to create IceGrid administrative sessions.

{% /property-description %}

## IceGrid.Registry.AdminSSLPermissionsVerifier

{% property-synopsis %}

`IceGrid.Registry.AdminSSLPermissionsVerifier=proxy`

{% /property-synopsis %}

{% property-description %}

Specifies the proxy of an object that implements the `Glacier2::SSLPermissionsVerifier` interface for
[controlling access to IceGrid administrative sessions](../../services/icegrid/icegrid-administrative-sessions). The
IceGrid registry invokes this proxy to validate each new administrative session created by a client from a secure
connection with the `IceGrid::Registry` interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using the properties.

{% /property-description %}

## IceGrid.Registry.Client._AdapterProperty_

{% property-synopsis %}

`IceGrid.Registry.Client.AdapterProperty=value`

{% /property-synopsis %}

{% property-description %}

IceGrid uses the adapter name `IceGrid.Registry.Client` for the object adapter that processes incoming requests from
clients. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this adapter. (Note any
setting of `IceGrid.Registry.Client.AdapterId` is ignored because the registry always provides a direct adapter.)

Note that [IceGrid.Registry.Client.Endpoints](../object-adapter-properties) controls the client endpoint for the
registry. The port numbers 4061 (for TCP) and 4062 (for SSL) are reserved for the registry by the
[Internet Assigned Numbers Authority](https://www.iana.org/assignments/service-names-port-numbers) (IANA).

{% /property-description %}

## IceGrid.Registry.CryptPasswords

{% property-synopsis %}

`IceGrid.Registry.CryptPasswords=file`

{% /property-synopsis %}

{% property-description %}

Specifies the file name of an IceGrid registry
[password file](../../services/icegrid/resource-allocation-using-icegrid-sessions). Each line of the file contains a
user name and a password hash, separated by white space. The supported hash formats depend on the platform; see
[Writing a Password File](../../services/glacier2/getting-started-with-glacier2#writing-a-password-file).

This property is ignored if [IceGrid.Registry.PermissionsVerifier](#icegrid.registry.permissionsverifier) is defined.
When neither property is defined, the registry rejects sessions created with a user name and password.

{% /property-description %}

## IceGrid.Registry.DefaultTemplates

{% property-synopsis %}

`IceGrid.Registry.DefaultTemplates=path`

{% /property-synopsis %}

{% property-description %}

Defines the path name of an XML file containing default
[template descriptors](../../services/icegrid/icegrid-templates). A sample file named `config/templates.xml` that
contains convenient server templates for Ice services is provided in the Ice distribution.

When this property is not set, the registry has no default templates.

{% /property-description %}

## IceGrid.Registry.Discovery._AdapterProperty_

{% property-synopsis %}

`IceGrid.Registry.Discovery.AdapterProperty=value`

{% /property-synopsis %}

{% property-description %}

The IceGrid registry creates an object adapter named `IceGrid.Registry.Discovery` for receiving
[multicast discovery queries](../../plugins/icelocatordiscovery) from clients. If not otherwise defined by
`IceGrid.Registry.Discovery.Endpoints`, the endpoint for this object adapter is composed as follows:

`udp -h addr -p port [--interface intf]`

where `addr` is the value of `IceGrid.Registry.Discovery.Address`, `port` is the value of
`IceGrid.Registry.Discovery.Port`, and `intf` is the value of `IceGrid.Registry.Discovery.Interface`.

You don't normally need to set [other properties](../object-adapter-properties) for this object adapter.

{% /property-description %}

## IceGrid.Registry.Discovery.Address

{% property-synopsis %}

`IceGrid.Registry.Discovery.Address=addr`

{% /property-synopsis %}

{% property-description %}

Specifies the multicast IP address to use for receiving multicast discovery queries. The default value is `239.255.0.1`;
it is `ff15::1` when [Ice.IPv4](../ice-properties) is disabled or [Ice.PreferIPv6Address](../ice-properties) is enabled.
This property is used to compose the endpoint of the IceGrid.Registry.Discovery object adapter.

{% /property-description %}

## IceGrid.Registry.Discovery.Enabled

{% property-synopsis %}

`IceGrid.Registry.Discovery.Enabled=num`

{% /property-synopsis %}

{% property-description %}

If `num` is a value larger than zero, the registry creates the IceGrid.Registry.Discovery object adapter and listens for
[multicast discovery queries](../../plugins/icelocatordiscovery). If not defined, the default value is `1`. Set this
property to zero to disable multicast discovery.

{% /property-description %}

## IceGrid.Registry.Discovery.Interface

{% property-synopsis %}

`IceGrid.Registry.Discovery.Interface=intf`

{% /property-synopsis %}

{% property-description %}

Specifies the IP address of the interface to use for receiving multicast discovery queries. If not defined, the
operating system will select a default interface to send and receive the UDP multicast datagrams. This property is used
to compose the endpoint of the IceGrid.Registry.Discovery object adapter.

{% /property-description %}

## IceGrid.Registry.Discovery.Port

{% property-synopsis %}

`IceGrid.Registry.Discovery.Port=port`

{% /property-synopsis %}

{% property-description %}

Specifies the multicast port to use for receiving multicast discovery queries. If not set, the default value is `4061`.
This property is used to compose the endpoint of the IceGrid.Registry.Discovery object adapter.

{% /property-description %}

## IceGrid.Registry.DynamicRegistration

{% property-synopsis %}

`IceGrid.Registry.DynamicRegistration=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a value larger than zero, the locator registry does not require Ice servers to preregister object
adapters and replica groups, but rather creates them automatically if they do not exist. If this property is not
defined, or `num` is set to zero, an attempt to register an unknown object adapter or replica group causes adapter
activation to fail with `Ice.NotRegisteredException`. An object adapter registers itself when the
[_adapter_.AdapterId](../object-adapter-properties) property is defined. The
[_adapter_.ReplicaGroupId](../object-adapter-properties) property identifies the replica group. An adapter registered
with dynamic registration can only be a member of a replica group also registered with dynamic registration. Trying to
dynamically register an adapter with a replica group registered with the
[deployment facility](../../services/icegrid/using-icegrid-deployment) will fail with `Ice.NotRegisteredException`.

{% /property-description %}

## IceGrid.Registry.Internal._AdapterProperty_

{% property-synopsis %}

`IceGrid.Registry.Internal.AdapterProperty=value`

{% /property-synopsis %}

{% property-description %}

The IceGrid registry uses the adapter name `IceGrid.Registry.Internal` for the object adapter that processes incoming
requests from nodes and slave replicas. Therefore, [adapter properties](../object-adapter-properties) can be used to
configure this adapter. (Note any setting of `IceGrid.Registry.Internal.AdapterId` is ignored because the registry
always provides a direct adapter.)

{% /property-description %}

## IceGrid.Registry.LMDB.MapSize

{% property-synopsis %}

`IceGrid.Registry.LMDB.MapSize=num`

{% /property-synopsis %}

{% property-description %}

Specifies the map size for the IceGrid [LMDB](http://www.lmdb.tech/doc/) database environment. The value is specified in
megabytes. If not set, IceGrid uses a system-dependent default: 10 MB on Windows, and 100 MB on other platforms.

{% /property-description %}

## IceGrid.Registry.LMDB.Path

{% property-synopsis %}

`IceGrid.Registry.LMDB.Path=path`

{% /property-synopsis %}

{% property-description %}

Specifies the path of the directory where the IceGrid registry keeps its
[persistent data](../../services/icegrid/icegrid-server-reference/icegrid-persistent-data), stored in an
[LMDB](http://www.lmdb.tech/doc/) database environment: the deployed applications, and the well-known objects and object
adapter endpoints registered at run time. This property must be defined, and the directory specified in `path` must
exist: the IceGrid registry does not create this directory.

{% /property-description %}

## IceGrid.Registry.NodeSessionTimeout

{% property-synopsis %}

`IceGrid.Registry.NodeSessionTimeout=num`

{% /property-synopsis %}

{% property-description %}

Each IceGrid node establishes a session with the registry that must be refreshed periodically. If a node does not
refresh its session within `num` seconds, the node's session is destroyed and the servers deployed on that node become
unavailable to new clients. If not specified, the default value is 30 seconds.

A value of `0` disables the expiration of node sessions; any other value must be at least `10`.

{% /property-description %}

## IceGrid.Registry.PermissionsVerifier

{% property-synopsis %}

`IceGrid.Registry.PermissionsVerifier=proxy`

{% /property-synopsis %}

{% property-description %}

Specifies the proxy of an object that implements the `Glacier2::PermissionsVerifier` interface for
[controlling access to IceGrid sessions](../../services/icegrid/resource-allocation-using-icegrid-sessions). The IceGrid
registry invokes this proxy to validate each new client session created by a client with the `IceGrid::Registry`
interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

{% /property-description %}

## IceGrid.Registry.ReplicaName

{% property-synopsis %}

`IceGrid.Registry.ReplicaName=name`

{% /property-synopsis %}

{% property-description %}

Specifies the name of a [registry replica](../../services/icegrid/registry-replication). If not defined, the default
value is `Master`, which is the name reserved for the master replica. Each registry replica must have a unique name.

{% /property-description %}

## IceGrid.Registry.ReplicaSessionTimeout

{% property-synopsis %}

`IceGrid.Registry.ReplicaSessionTimeout=num`

{% /property-synopsis %}

{% property-description %}

Each IceGrid [registry replica](../../services/icegrid/registry-replication) establishes a session with the master
registry that must be refreshed periodically. If a replica does not refresh its session within `num` seconds, the
replica's session is destroyed and the replica no longer receives replication information from the master registry. If
not specified, the default value is 30 seconds.

A value of `0` disables the expiration of replica sessions; any other value must be at least `10`.

{% /property-description %}

## IceGrid.Registry.Server._AdapterProperty_

{% property-synopsis %}

`IceGrid.Registry.Server.AdapterProperty=value`

{% /property-synopsis %}

{% property-description %}

The IceGrid registry uses the adapter name `IceGrid.Registry.Server` for the object adapter that processes incoming
requests from servers. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this
adapter. (Note any setting of `IceGrid.Registry.Server.AdapterId` is ignored because the registry always provides a
direct adapter.)

{% /property-description %}

## IceGrid.Registry.SessionFilters

{% property-synopsis %}

`IceGrid.Registry.SessionFilters=num`

{% /property-synopsis %}

{% property-description %}

This property controls whether IceGrid establishes filters for sessions created with the
[IceGrid session manager](../../services/icegrid/glacier2-integration-with-icegrid). If `num` is set to a value larger
than zero, IceGrid establishes these filters, so Glacier2 limits access to the `IceGrid::Query` and `IceGrid::Session`
objects, and to objects and adapters allocated by the session. If `num` is set to zero, IceGrid does not establish
filters, so access to objects is controlled solely by Glacier2's configuration.

The default value is `0`.

{% /property-description %}

## IceGrid.Registry.SessionManager._AdapterProperty_

{% property-synopsis %}

`IceGrid.Registry.SessionManager.AdapterProperty=value`

{% /property-synopsis %}

{% property-description %}

The IceGrid registry uses the adapter name `IceGrid.Registry.SessionManager` for the object adapter that processes
incoming requests from [client sessions](../../services/icegrid/resource-allocation-using-icegrid-sessions). Therefore,
[adapter properties](../object-adapter-properties) can be used to configure this adapter. (Note any setting of
`IceGrid.Registry.SessionManager.AdapterId` is ignored because the registry always provides a direct adapter.)

For security reasons, defining endpoints for this object adapter is optional. If you do define endpoints, they should
only be accessible to Glacier2 routers used to create IceGrid client sessions.

{% /property-description %}

## IceGrid.Registry.SSLPermissionsVerifier

{% property-synopsis %}

`IceGrid.Registry.SSLPermissionsVerifier=proxy`

{% /property-synopsis %}

{% property-description %}

Specifies the proxy of an object that implements the `Glacier2::SSLPermissionsVerifier` interface for
[controlling access to IceGrid sessions](../../services/icegrid/resource-allocation-using-icegrid-sessions). The IceGrid
registry invokes this proxy to validate each new client session created by a client from a secure connection with the
`IceGrid::Registry` interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

{% /property-description %}

## IceGrid.Registry.Trace.Adapter

{% property-synopsis %}

`IceGrid.Registry.Trace.Adapter=num`

{% /property-synopsis %}

{% property-description %}

The object adapter trace level:

| `0` | No object adapter trace (default).                           |
| --- | ------------------------------------------------------------ |
| `1` | Trace object adapter registration, removal, and replication. |

{% /property-description %}

## IceGrid.Registry.Trace.Admin

{% property-synopsis %}

`IceGrid.Registry.Trace.Admin=num`

{% /property-synopsis %}

{% property-description %}

Set the trace level for the routing of operations to Ice.Admin objects through this registry.

| Value | Description                                      |
| ----- | ------------------------------------------------ |
| 0     | No admin trace (default).                        |
| 1     | Trace routing of operations to Ice.Admin objects |

{% /property-description %}

## IceGrid.Registry.Trace.Application

{% property-synopsis %}

`IceGrid.Registry.Trace.Application=num`

{% /property-synopsis %}

{% property-description %}

The application trace level:

| Value | Description                                      |
| ----- | ------------------------------------------------ |
| 0     | No application trace (default).                  |
| 1     | Trace application addition, update, and removal. |

{% /property-description %}

## IceGrid.Registry.Trace.Discovery

{% property-synopsis %}

`IceGrid.Registry.Trace.Discovery=num`

{% /property-synopsis %}

{% property-description %}

The discovery trace level:

| `0` | No discovery trace (default).                    |
| --- | ------------------------------------------------ |
| `1` | Trace replied discovery lookup requests.         |
| 2   | Like 1, also includes discarded lookup requests. |

{% /property-description %}

## IceGrid.Registry.Trace.Locator

{% property-synopsis %}

`IceGrid.Registry.Trace.Locator=num`

{% /property-synopsis %}

{% property-description %}

The locator and locator registry trace level:

| Value | Description                                                                                |
| ----- | ------------------------------------------------------------------------------------------ |
| 0     | No locator trace (default).                                                                |
| 1     | Trace failures to locate an adapter or object, and failures to register adapter endpoints. |
| 2     | Like 1, but more verbose, including registration of adapter endpoints.                     |

{% /property-description %}

## IceGrid.Registry.Trace.Node

{% property-synopsis %}

`IceGrid.Registry.Trace.Node=num`

{% /property-synopsis %}

{% property-description %}

The node trace level:

| Value | Description                                                               |
| ----- | ------------------------------------------------------------------------- |
| 0     | No node trace (default).                                                  |
| 1, 2  | Trace nodes going up and down, and node session creation and destruction. |
| 3     | Like 1, plus the keep-alive messages of each node with its load averages. |

{% /property-description %}

## IceGrid.Registry.Trace.Object

{% property-synopsis %}

`IceGrid.Registry.Trace.Object=num`

{% /property-synopsis %}

{% property-description %}

The object trace level:

| Value | Description                                                     |
| ----- | --------------------------------------------------------------- |
| 0     | No object trace (default).                                      |
| 1     | Trace object registration, removal.                             |
| 2     | Like 1, plus the allocation and release of allocatable objects. |

{% /property-description %}

## IceGrid.Registry.Trace.Replica

{% property-synopsis %}

`IceGrid.Registry.Trace.Replica=num`

{% /property-synopsis %}

{% property-description %}

The replica trace level:

| Value | Description                                                                                                    |
| ----- | -------------------------------------------------------------------------------------------------------------- |
| 0     | No replica trace (default).                                                                                    |
| 1     | Trace replicas going up and down, and the session lifecycle between the master replica and the other replicas. |
| 2     | Like 1, plus session establishment attempts and failures.                                                      |
| 3     | Like 2, plus keep-alive messages.                                                                              |

{% /property-description %}

## IceGrid.Registry.Trace.Server

{% property-synopsis %}

`IceGrid.Registry.Trace.Server=num`

{% /property-synopsis %}

{% property-description %}

The server trace level:

| Value | Description                                                                            |
| ----- | -------------------------------------------------------------------------------------- |
| 0     | No server trace (default).                                                             |
| 1     | Trace the addition and removal of servers in the Registry database.                    |
| 2     | Like 1, but more verbose: includes load/unload failures, properties updates, and more. |
| 3     | Like 2, plus the start of each server load and unload on a node.                       |

{% /property-description %}

## IceGrid.Registry.Trace.Session

{% property-synopsis %}

`IceGrid.Registry.Trace.Session=num`

{% /property-synopsis %}

{% property-description %}

The session trace level:

| Value | Description                                                                                          |
| ----- | ---------------------------------------------------------------------------------------------------- |
| 0     | No client or admin session trace (default).                                                          |
| 1     | Trace client or admin session creation and destruction, and failures to call a permissions verifier. |

{% /property-description %}

## IceGrid.Registry.UserAccounts

{% property-synopsis %}

`IceGrid.Registry.UserAccounts=file`

{% /property-synopsis %}

{% property-description %}

Specifies the file name of an IceGrid registry user account map file. The file uses the format described in
[IceGrid.Node.UserAccounts](#icegrid.node.useraccounts). The identifier is matched against the client session identifier
(the user ID for sessions created with a user ID and password, or the distinguished name for sessions created from a
secure connection). This user account map file is used by IceGrid nodes to map session identifiers to user accounts if
the nodes' IceGrid.Node.UserAccountMapper property is set to the proxy `IceGrid/RegistryUserAccountMapper`.

{% /property-description %}
