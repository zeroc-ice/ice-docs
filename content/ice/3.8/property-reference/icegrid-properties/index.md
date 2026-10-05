---
title: IceGrid.*
---

## IceGrid.InstanceName

### Synopsis {% id="icegrid.instancename-synopsis" %}

`IceGrid.InstanceName=name`

### Description {% id="icegrid.instancename-description" %}

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

## IceGrid.Node._AdapterProperty_

### Synopsis {% id="icegrid.node.adapterproperty-synopsis" %}

`IceGrid.Node.AdapterProperty=value`

### Description {% id="icegrid.node.adapterproperty-description" %}

An IceGrid node uses the adapter name `IceGrid.Node` for the object adapter that the registry contacts to communicate
with the node. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this adapter.

## IceGrid.Node.AllowEndpointsOverride

### Synopsis {% id="icegrid.node.allowendpointsoverride-synopsis" %}

`IceGrid.Node.AllowEndpointsOverride=num`

If `num` is set to a non-zero value, an IceGrid node permits servers to override previously set endpoints even if the
server is active. Setting this property to a non-zero value is necessary if the servers managed by the node use the
object adapter operation `refreshPublishedEndpoints`. The default value of `num` is zero.

## IceGrid.Node.AllowRunningServersAsRoot

### Synopsis {% id="icegrid.node.allowrunningserversasroot-synopsis" %}

`IceGrid.Node.AllowRunningServersAsRoot=num`

If `num` is set to a non-zero value, an IceGrid node will permit servers started by the node to run with super-user
privileges. Note that you should not set this property unless the node uses a secure endpoint; otherwise, clients can
start arbitrary processes with super-user privileges on the node's machine.

The default value of `num` is zero.

## IceGrid.Node.CollocateRegistry

### Synopsis {% id="icegrid.node.collocateregistry-synopsis" %}

`IceGrid.Node.CollocateRegistry=num`

### Description {% id="icegrid.node.collocateregistry-description" %}

If `num` is set to a value larger than zero, the [node](../../services/icegrid/icegrid-server-reference/icegridnode)
collocates the IceGrid registry.

The collocated registry is configured with the same properties as the standalone IceGrid registry.

## IceGrid.Node.Data

### Synopsis {% id="icegrid.node.data-synopsis" %}

`IceGrid.Node.Data=path`

### Description {% id="icegrid.node.data-description" %}

Defines the path of the IceGrid node [data directory](../../services/icegrid/icegrid-server-reference/icegridnode). This
property must be defined for each node, and the directory must already exist. The node creates a `servers` subdirectory
in this directory if it does not already exist; `servers` contains the configuration files and data directory of each
[deployed server](../../services/icegrid/using-icegrid-deployment).

## IceGrid.Node.DisableOnFailure

### Synopsis {% id="icegrid.node.disableonfailure-synopsis" %}

`IceGrid.Node.DisableOnFailure=num`

### Description {% id="icegrid.node.disableonfailure-description" %}

The node considers a server to have terminated improperly if it has a non-zero exit code or if it exits due to one of
the signals `SIGABRT`, `SIGBUS`, `SIGILL`, `SIGFPE`, or `SIGSEGV`. The node marks such a server as disabled if `num` is
a non-zero value; a [disabled server](../../services/icegrid/icegrid-troubleshooting) cannot be activated on demand. For
values of `num` greater than zero, the server is disabled for `num` seconds. If `num` is a negative value, the server is
disabled indefinitely, or until it is explicitly enabled or started via an administrative action. The default value is
zero, meaning the node does not disable servers in this situation.

## IceGrid.Node.Name

### Synopsis {% id="icegrid.node.name-synopsis" %}

`IceGrid.Node.Name=name`

### Description {% id="icegrid.node.name-description" %}

Defines the `name` of the IceGrid node. Each node in an IceGrid deployment must have a unique name. This property must
be defined for each node.

## IceGrid.Node.Output

### Synopsis {% id="icegrid.node.output-synopsis" %}

`IceGrid.Node.Output=path`

### Description {% id="icegrid.node.output-description" %}

Defines the path of the IceGrid node output directory. If set, the node redirects the `stdout` of each server it starts
to `path/server-id.out` and its `stderr` to `path/server-id.err`, where `server-id` is the server's ID. A server whose
own configuration sets [Ice.StdOut](../ice-properties) or [Ice.StdErr](../ice-properties) keeps that setting. With
[IceGrid.Node.RedirectErrToOut](#icegrid.node.redirecterrtoout) set, `stderr` goes to the `.out` file too. If this
property is not set, the servers share the `stdout` and `stderr` of the node's process.

## IceGrid.Node.PrintServersReady

### Synopsis {% id="icegrid.node.printserversready-synopsis" %}

`IceGrid.Node.PrintServersReady=token`

### Description {% id="icegrid.node.printserversready-description" %}

The IceGrid node prints "`token` ready" on standard output after all the servers managed by the node are ready. This is
useful for scripts that wish to wait until all servers have been started and are ready for use.

## IceGrid.Node.ProcessorSocketCount

### Synopsis {% id="icegrid.node.processorsocketcount-synopsis" %}

`IceGrid.Node.ProcessorSocketCount=num`

### Description {% id="icegrid.node.processorsocketcount-description" %}

This property sets the number of processor sockets. This value is reported by the
[icegridadmin](../../services/icegrid/icegridadmin-command-line-tool) `node sockets` command. On Windows Vista (or
later), Windows Server 2008 (or later), and Linux systems, the number of processor sockets is set automatically by the
Ice run time. On other systems, the run time cannot obtain the socket count from the operating system; you can use this
property to set the number of processor sockets manually on such systems.

## IceGrid.Node.PropertiesOverride

### Synopsis {% id="icegrid.node.propertiesoverride-synopsis" %}

`IceGrid.Node.PropertiesOverride=overrides`

### Description {% id="icegrid.node.propertiesoverride-description" %}

Defines a list of properties that override the properties defined in server deployment descriptors. For example, in some
cases it is desirable to set the property [Ice.Default.Host](../ice-default-properties) for servers, but not in server
deployment descriptors. The property definitions must be separated by white space.

## IceGrid.Node.RedirectErrToOut

### Synopsis {% id="icegrid.node.redirecterrtoout-synopsis" %}

`IceGrid.Node.RedirectErrToOut=num`

### Description {% id="icegrid.node.redirecterrtoout-description" %}

If `num` is set to a value larger than zero, the node redirects the `stderr` of each server it starts to the server's
`.out` file instead of its `.err` file. This property takes effect only when [IceGrid.Node.Output](#icegrid.node.output)
is set.

## IceGrid.Node.Trace.Activator

### Synopsis {% id="icegrid.node.trace.activator-synopsis" %}

`IceGrid.Node.Trace.Activator=num`

### Description {% id="icegrid.node.trace.activator-description" %}

The activator trace level:

| Value | Description                                                                                                                                                                                                                                                                                                                                                                                 |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | No activator trace (default).                                                                                                                                                                                                                                                                                                                                                               |
| 1     | Trace process activation, termination.                                                                                                                                                                                                                                                                                                                                                      |
| 2     | Like 1, but more verbose: includes process signaling, the activation parameters of each spawned server (path, working directory, uid/gid, arguments, and environment variables), and more diagnostic messages. Note: environment variables and arguments may carry secrets (passwords, tokens, certificate passphrases) injected via your deployment — treat the trace output as sensitive. |

## IceGrid.Node.Trace.Adapter

### Synopsis {% id="icegrid.node.trace.adapter-synopsis" %}

`IceGrid.Node.Trace.Adapter=num`

### Description {% id="icegrid.node.trace.adapter-description" %}

The object adapter trace level:

| Value | Description                                                             |
| ----- | ----------------------------------------------------------------------- |
| 0, 1  | No object adapter trace. The default value is `0`.                      |
| 2     | Trace object adapter activation, deactivation, and activation failures. |
| 3     | Like 2, plus requests waiting for the activation of an object adapter.  |

## IceGrid.Node.Trace.Admin

### Synopsis {% id="icegrid.node.trace.admin-synopsis" %}

`IceGrid.Node.Trace.Admin=num`

### Description {% id="icegrid.node.trace.admin-description" %}

Set the trace level for the routing of operations to Ice.Admin objects through this node.

| Value | Description                                      |
| ----- | ------------------------------------------------ |
| 0     | No admin trace (default).                        |
| 1     | Trace routing of operations to Ice.Admin objects |

## IceGrid.Node.Trace.Replica

### Synopsis {% id="icegrid.node.trace.replica-synopsis" %}

`IceGrid.Node.Trace.Replica=num`

### Description {% id="icegrid.node.trace.replica-description" %}

The replica trace level:

| Value | Description                                                                      |
| ----- | -------------------------------------------------------------------------------- |
| 0     | No replica trace (default).                                                      |
| 1     | Trace session lifecycle between nodes and replicas.                              |
| 2     | Like 1, but more verbose, including session establishment attempts and failures. |
| 3     | Like 2, but more verbose, including keep alive messages sent to the replica.     |

## IceGrid.Node.Trace.Server

### Synopsis {% id="icegrid.node.trace.server-synopsis" %}

`IceGrid.Node.Trace.Server=num`

### Description {% id="icegrid.node.trace.server-description" %}

Sets the node's trace level for server configuration updates and state changes:

| Value | Description                                                                                                                                                                                                          |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | No server trace (default).                                                                                                                                                                                           |
| 1     | Trace completed server configuration and runtime property updates.                                                                                                                                                   |
| 2     | Like 1, plus runtime property update attempts for individual servers and services, activation timeouts, and changes to the Active, Inactive, and Destroyed states. Changes from Loading to Inactive require level 3. |
| 3     | Like 2, plus all other server state changes, including Loading and WaitForActivation.                                                                                                                                |

## IceGrid.Node.UserAccountMapper

### Synopsis {% id="icegrid.node.useraccountmapper-synopsis" %}

`IceGrid.Node.UserAccountMapper=proxy`

### Description {% id="icegrid.node.useraccountmapper-description" %}

Specifies the proxy of an object that implements the `IceGrid::UserAccountMapper` interface for
[customizing](../../services/icegrid/icegrid-server-activation) the user accounts under which servers are activated. The
IceGrid node invokes this proxy to map session identifiers (the user ID for sessions created with a user ID and
password, or the distinguished name for sessions created from a secure connection) to user accounts.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

## IceGrid.Node.UserAccounts

### Synopsis {% id="icegrid.node.useraccounts-synopsis" %}

`IceGrid.Node.UserAccounts=file`

### Description {% id="icegrid.node.useraccounts-description" %}

Specifies the file name of an IceGrid node user account map file. Each line of the file contains a user account, white
space, and an identifier; the identifier is the rest of the line and may contain spaces. A `#` starts a comment that
runs to the end of the line. The identifier is matched against the client session identifier (the user ID for sessions
created with a user ID and password, or the distinguished name for sessions created from a secure connection). This user
account map file is used by the node to
[map session identifiers to user accounts](../../services/icegrid/icegrid-server-activation). This property is ignored
if IceGrid.Node.UserAccountMapper is defined.

## IceGrid.Node.WaitTime

### Synopsis {% id="icegrid.node.waittime-synopsis" %}

`IceGrid.Node.WaitTime=num`

### Description {% id="icegrid.node.waittime-description" %}

Defines the interval in seconds that IceGrid waits for
[server activation and deactivation](../../services/icegrid/icegrid-server-activation).

If a server is automatically activated and does not register its object adapter endpoints within this time interval, the
node assumes there is a problem with the server and returns an empty set of endpoints to the client.

If a server is being gracefully deactivated and IceGrid does not detect the server deactivation during this time
interval, IceGrid kills the server.

A server descriptor's `activation-timeout` and `deactivation-timeout` attributes, when set to a non-zero value, override
this property for that server.

The default value is 60 seconds.

## IceGrid.Registry.AdminCryptPasswords

### Synopsis {% id="icegrid.registry.admincryptpasswords-synopsis" %}

`IceGrid.Registry.AdminCryptPasswords=file`

### Description {% id="icegrid.registry.admincryptpasswords-description" %}

Specifies the file name of an IceGrid registry
[access control list for administrative clients](../../services/icegrid/resource-allocation-using-icegrid-sessions). The
file uses the format described in [IceGrid.Registry.CryptPasswords](#icegrid.registry.cryptpasswords). This property is
ignored if [IceGrid.Registry.AdminPermissionsVerifier](#icegrid.registry.adminpermissionsverifier) is defined. When
neither property is defined, the registry rejects administrative sessions created with a user name and password.

## IceGrid.Registry.AdminPermissionsVerifier

### Synopsis {% id="icegrid.registry.adminpermissionsverifier-synopsis" %}

`IceGrid.Registry.AdminPermissionsVerifier=proxy`

### Description {% id="icegrid.registry.adminpermissionsverifier-description" %}

Specifies the proxy of an object that implements the `Glacier2::PermissionsVerifier` interface for
[controlling access to IceGrid administrative sessions](../../services/icegrid/icegrid-administrative-sessions). The
IceGrid registry invokes this proxy to validate each new administrative session created by a client with the
`IceGrid::Registry` interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

## IceGrid.Registry.AdminSessionFilters

### Synopsis {% id="icegrid.registry.adminsessionfilters-synopsis" %}

`IceGrid.Registry.AdminSessionFilters=num`

### Description {% id="icegrid.registry.adminsessionfilters-description" %}

When a client creates an administrative session through a [Glacier2](../../services/glacier2) router, using the
[IceGrid session manager](../../services/icegrid/glacier2-integration-with-icegrid), this property controls whether
IceGrid restricts the objects the client can reach through the router. If `num` is set to a value larger than zero,
IceGrid configures [Glacier2's filters](../../services/glacier2/securing-a-glacier2-router) for the session to allow
only the `IceGrid::AdminSession` object, the `IceGrid::Admin` object that is returned by the `getAdmin` operation, the
`IceGrid::Query` object, and the server admin objects returned by `IceGrid::Admin::getServerAdmin`. If `num` is set to
zero, IceGrid configures no filters, and access to objects is controlled solely by Glacier2's configuration.

The default value is `0`.

## IceGrid.Registry.AdminSessionManager._AdapterProperty_

### Synopsis {% id="icegrid.registry.adminsessionmanager.adapterproperty-synopsis" %}

`IceGrid.Registry.AdminSessionManager.AdapterProperty=value`

### Description {% id="icegrid.registry.adminsessionmanager.adapterproperty-description" %}

The IceGrid registry uses the adapter name `IceGrid.Registry.AdminSessionManager` for the object adapter that processes
incoming requests from [IceGrid administrative sessions](../../services/icegrid/icegrid-administrative-sessions).
Therefore, [adapter properties](../object-adapter-properties) can be used to configure this adapter. (Note any setting
of `IceGrid.Registry.AdminSessionManager.AdapterId` is ignored because the registry always provides a direct adapter.)

For security reasons, defining endpoints for this object adapter is optional. If you do define endpoints, they should
only be accessible to Glacier2 routers used to create IceGrid administrative sessions.

## IceGrid.Registry.AdminSSLPermissionsVerifier

### Synopsis {% id="icegrid.registry.adminsslpermissionsverifier-synopsis" %}

`IceGrid.Registry.AdminSSLPermissionsVerifier=proxy`

### Description {% id="icegrid.registry.adminsslpermissionsverifier-description" %}

Specifies the proxy of an object that implements the `Glacier2::SSLPermissionsVerifier` interface for
[controlling access to IceGrid administrative sessions](../../services/icegrid/icegrid-administrative-sessions). The
IceGrid registry invokes this proxy to validate each new administrative session created by a client from a secure
connection with the `IceGrid::Registry` interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using the properties.

## IceGrid.Registry.Client._AdapterProperty_

### Synopsis {% id="icegrid.registry.client.adapterproperty-synopsis" %}

`IceGrid.Registry.Client.AdapterProperty=value`

### Description {% id="icegrid.registry.client.adapterproperty-description" %}

IceGrid uses the adapter name `IceGrid.Registry.Client` for the object adapter that processes incoming requests from
clients. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this adapter. (Note any
setting of `IceGrid.Registry.Client.AdapterId` is ignored because the registry always provides a direct adapter.)

Note that [IceGrid.Registry.Client.Endpoints](../object-adapter-properties) controls the client endpoint for the
registry. The port numbers 4061 (for TCP) and 4062 (for SSL) are reserved for the registry by the
[Internet Assigned Numbers Authority](https://www.iana.org/assignments/service-names-port-numbers) (IANA).

## IceGrid.Registry.CryptPasswords

### Synopsis {% id="icegrid.registry.cryptpasswords-synopsis" %}

`IceGrid.Registry.CryptPasswords=file`

### Description {% id="icegrid.registry.cryptpasswords-description" %}

Specifies the file name of an IceGrid registry
[access control list](../../services/icegrid/resource-allocation-using-icegrid-sessions). Each line of the file contains
a user name and a password hash, separated by white space. The supported hash formats depend on the platform; see
[Writing a Password File](../../services/glacier2/getting-started-with-glacier2).

This property is ignored if [IceGrid.Registry.PermissionsVerifier](#icegrid.registry.permissionsverifier) is defined.
When neither property is defined, the registry rejects sessions created with a user name and password.

## IceGrid.Registry.DefaultTemplates

### Synopsis {% id="icegrid.registry.defaulttemplates-synopsis" %}

`IceGrid.Registry.DefaultTemplates=path`

### Description {% id="icegrid.registry.defaulttemplates-description" %}

Defines the path name of an XML file containing default
[template descriptors](../../services/icegrid/icegrid-templates). A sample file named `config/templates.xml` that
contains convenient server templates for Ice services is provided in the Ice distribution.

When this property is not set, the registry has no default templates.

## IceGrid.Registry.Discovery._AdapterProperty_

### Synopsis {% id="icegrid.registry.discovery.adapterproperty-synopsis" %}

`IceGrid.Registry.Discovery.AdapterProperty=value`

### Description {% id="icegrid.registry.discovery.adapterproperty-description" %}

The IceGrid registry creates an object adapter named `IceGrid.Registry.Discovery` for receiving
[multicast discovery queries](../../plugins/icelocatordiscovery) from clients. If not otherwise defined by
`IceGrid.Registry.Discovery.Endpoints`, the endpoint for this object adapter is composed as follows:

`udp -h addr -p port [--interface intf]`

where `addr` is the value of `IceGrid.Registry.Discovery.Address`, `port` is the value of
`IceGrid.Registry.Discovery.Port`, and `intf` is the value of `IceGrid.Registry.Discovery.Interface`.

You don't normally need to set [other properties](../object-adapter-properties) for this object adapter.

## IceGrid.Registry.Discovery.Address

### Synopsis {% id="icegrid.registry.discovery.address-synopsis" %}

`IceGrid.Registry.Discovery.Address=addr`

### Description {% id="icegrid.registry.discovery.address-description" %}

Specifies the multicast IP address to use for receiving multicast discovery queries. The default value is `239.255.0.1`;
it is `ff15::1` when [Ice.IPv4](../ice-properties) is disabled or [Ice.PreferIPv6Address](../ice-properties) is enabled.
This property is used to compose the endpoint of the IceGrid.Registry.Discovery object adapter.

## IceGrid.Registry.Discovery.Enabled

### Synopsis {% id="icegrid.registry.discovery.enabled-synopsis" %}

`IceGrid.Registry.Discovery.Enabled=num`

### Description {% id="icegrid.registry.discovery.enabled-description" %}

If `num` is a value larger than zero, the registry creates the IceGrid.Registry.Discovery object adapter and listens for
[multicast discovery queries](../../plugins/icelocatordiscovery). If not defined, the default value is `1`. Set this
property to zero to disable multicast discovery.

## IceGrid.Registry.Discovery.Interface

### Synopsis {% id="icegrid.registry.discovery.interface-synopsis" %}

`IceGrid.Registry.Discovery.Interface=intf`

### Description {% id="icegrid.registry.discovery.interface-description" %}

Specifies the IP address of the interface to use for receiving multicast discovery queries. If not defined, the
operating system will select a default interface to send and receive the UDP multicast datagrams. This property is used
to compose the endpoint of the IceGrid.Registry.Discovery object adapter.

## IceGrid.Registry.Discovery.Port

### Synopsis {% id="icegrid.registry.discovery.port-synopsis" %}

`IceGrid.Registry.Discovery.Port=port`

### Description {% id="icegrid.registry.discovery.port-description" %}

Specifies the multicast port to use for receiving multicast discovery queries. If not set, the default value is `4061`.
This property is used to compose the endpoint of the IceGrid.Registry.Discovery object adapter.

## IceGrid.Registry.DynamicRegistration

### Synopsis {% id="icegrid.registry.dynamicregistration-synopsis" %}

`IceGrid.Registry.DynamicRegistration=num`

### Description {% id="icegrid.registry.dynamicregistration-description" %}

If `num` is set to a value larger than zero, the locator registry does not require Ice servers to preregister object
adapters and replica groups, but rather creates them automatically if they do not exist. If this property is not
defined, or `num` is set to zero, an attempt to register an unknown object adapter or replica group causes adapter
activation to fail with `Ice.NotRegisteredException`. An object adapter registers itself when the
[_adapter_.AdapterId](../object-adapter-properties) property is defined. The
[_adapter_.ReplicaGroupId](../object-adapter-properties) property identifies the replica group. An adapter registered
with dynamic registration can only be a member of a replica group also registered with dynamic registration. Trying to
dynamically register an adapter with a replica group registered with the
[deployment facility](../../services/icegrid/using-icegrid-deployment) will fail with `Ice.NotRegisteredException`.

## IceGrid.Registry.Internal._AdapterProperty_

### Synopsis {% id="icegrid.registry.internal.adapterproperty-synopsis" %}

`IceGrid.Registry.Internal.AdapterProperty=value`

### Description {% id="icegrid.registry.internal.adapterproperty-description" %}

The IceGrid registry uses the adapter name `IceGrid.Registry.Internal` for the object adapter that processes incoming
requests from nodes and slave replicas. Therefore, [adapter properties](../object-adapter-properties) can be used to
configure this adapter. (Note any setting of `IceGrid.Registry.Internal.AdapterId` is ignored because the registry
always provides a direct adapter.)

## IceGrid.Registry.LMDB.MapSize

### Synopsis {% id="icegrid.registry.lmdb.mapsize-synopsis" %}

`IceGrid.Registry.LMDB.MapSize=num`

### Description {% id="icegrid.registry.lmdb.mapsize-description" %}

Specifies the map size for the IceGrid [LMDB](http://www.lmdb.tech/doc/) database environment. The value is specified in
megabytes. If not set, IceGrid uses a system-dependent default: 10 MB on Windows, and 100 MB on other platforms.

## IceGrid.Registry.LMDB.Path

### Synopsis {% id="icegrid.registry.lmdb.path-synopsis" %}

`IceGrid.Registry.LMDB.Path=path`

### Description {% id="icegrid.registry.lmdb.path-description" %}

Specifies the path of the directory where the IceGrid registry keeps its
[persistent data](../../services/icegrid/icegrid-server-reference/icegrid-persistent-data), stored in an
[LMDB](http://www.lmdb.tech/doc/) database environment: the deployed applications, and the well-known objects and object
adapter endpoints registered at run time. This property must be defined, and the directory specified in `path` must
exist: the IceGrid registry does not create this directory.

## IceGrid.Registry.NodeSessionTimeout

### Synopsis {% id="icegrid.registry.nodesessiontimeout-synopsis" %}

`IceGrid.Registry.NodeSessionTimeout=num`

### Description {% id="icegrid.registry.nodesessiontimeout-description" %}

Each IceGrid node establishes a session with the registry that must be refreshed periodically. If a node does not
refresh its session within `num` seconds, the node's session is destroyed and the servers deployed on that node become
unavailable to new clients. If not specified, the default value is 30 seconds.

A value of `0` disables the expiration of node sessions; any other value must be at least `10`.

## IceGrid.Registry.PermissionsVerifier

### Synopsis {% id="icegrid.registry.permissionsverifier-synopsis" %}

`IceGrid.Registry.PermissionsVerifier=proxy`

### Description {% id="icegrid.registry.permissionsverifier-description" %}

Specifies the proxy of an object that implements the `Glacier2::PermissionsVerifier` interface for
[controlling access to IceGrid sessions](../../services/icegrid/resource-allocation-using-icegrid-sessions). The IceGrid
registry invokes this proxy to validate each new client session created by a client with the `IceGrid::Registry`
interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

## IceGrid.Registry.ReplicaName

### Synopsis {% id="icegrid.registry.replicaname-synopsis" %}

`IceGrid.Registry.ReplicaName=name`

### Description {% id="icegrid.registry.replicaname-description" %}

Specifies the name of a [registry replica](../../services/icegrid/registry-replication). If not defined, the default
value is `Master`, which is the name reserved for the master replica. Each registry replica must have a unique name.

## IceGrid.Registry.ReplicaSessionTimeout

### Synopsis {% id="icegrid.registry.replicasessiontimeout-synopsis" %}

`IceGrid.Registry.ReplicaSessionTimeout=num`

### Description {% id="icegrid.registry.replicasessiontimeout-description" %}

Each IceGrid [registry replica](../../services/icegrid/registry-replication) establishes a session with the master
registry that must be refreshed periodically. If a replica does not refresh its session within `num` seconds, the
replica's session is destroyed and the replica no longer receives replication information from the master registry. If
not specified, the default value is 30 seconds.

A value of `0` disables the expiration of replica sessions; any other value must be at least `10`.

## IceGrid.Registry.Server._AdapterProperty_

### Synopsis {% id="icegrid.registry.server.adapterproperty-synopsis" %}

`IceGrid.Registry.Server.AdapterProperty=value`

### Description {% id="icegrid.registry.server.adapterproperty-description" %}

The IceGrid registry uses the adapter name `IceGrid.Registry.Server` for the object adapter that processes incoming
requests from servers. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this
adapter. (Note any setting of `IceGrid.Registry.Server.AdapterId` is ignored because the registry always provides a
direct adapter.)

## IceGrid.Registry.SessionFilters

### Synopsis {% id="icegrid.registry.sessionfilters-synopsis" %}

`IceGrid.Registry.SessionFilters=num`

### Description {% id="icegrid.registry.sessionfilters-description" %}

This property controls whether IceGrid establishes filters for sessions created with the
[IceGrid session manager](../../services/icegrid/glacier2-integration-with-icegrid). If `num` is set to a value larger
than zero, IceGrid establishes these filters, so Glacier2 limits access to the `IceGrid::Query` and `IceGrid::Session`
objects, and to objects and adapters allocated by the session. If `num` is set to zero, IceGrid does not establish
filters, so access to objects is controlled solely by Glacier2's configuration.

The default value is `0`.

## IceGrid.Registry.SessionManager._AdapterProperty_

### Synopsis {% id="icegrid.registry.sessionmanager.adapterproperty-synopsis" %}

`IceGrid.Registry.SessionManager.AdapterProperty=value`

### Description {% id="icegrid.registry.sessionmanager.adapterproperty-description" %}

The IceGrid registry uses the adapter name `IceGrid.Registry.SessionManager` for the object adapter that processes
incoming requests from [client sessions](../../services/icegrid/resource-allocation-using-icegrid-sessions). Therefore,
[adapter properties](../object-adapter-properties) can be used to configure this adapter. (Note any setting of
`IceGrid.Registry.SessionManager.AdapterId` is ignored because the registry always provides a direct adapter.)

For security reasons, defining endpoints for this object adapter is optional. If you do define endpoints, they should
only be accessible to Glacier2 routers used to create IceGrid client sessions.

## IceGrid.Registry.SSLPermissionsVerifier

### Synopsis {% id="icegrid.registry.sslpermissionsverifier-synopsis" %}

`IceGrid.Registry.SSLPermissionsVerifier=proxy`

### Description {% id="icegrid.registry.sslpermissionsverifier-description" %}

Specifies the proxy of an object that implements the `Glacier2::SSLPermissionsVerifier` interface for
[controlling access to IceGrid sessions](../../services/icegrid/resource-allocation-using-icegrid-sessions). The IceGrid
registry invokes this proxy to validate each new client session created by a client from a secure connection with the
`IceGrid::Registry` interface.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

## IceGrid.Registry.Trace.Adapter

### Synopsis {% id="icegrid.registry.trace.adapter-synopsis" %}

`IceGrid.Registry.Trace.Adapter=num`

### Description {% id="icegrid.registry.trace.adapter-description" %}

The object adapter trace level:

| `0` | No object adapter trace (default).                           |
| --- | ------------------------------------------------------------ |
| `1` | Trace object adapter registration, removal, and replication. |

## IceGrid.Registry.Trace.Admin

### Synopsis {% id="icegrid.registry.trace.admin-synopsis" %}

`IceGrid.Registry.Trace.Admin=num`

### Description {% id="icegrid.registry.trace.admin-description" %}

Set the trace level for the routing of operations to Ice.Admin objects through this registry.

| Value | Description                                      |
| ----- | ------------------------------------------------ |
| 0     | No admin trace (default).                        |
| 1     | Trace routing of operations to Ice.Admin objects |

## IceGrid.Registry.Trace.Application

### Synopsis {% id="icegrid.registry.trace.application-synopsis" %}

`IceGrid.Registry.Trace.Application=num`

### Description {% id="icegrid.registry.trace.application-description" %}

The application trace level:

| Value | Description                                      |
| ----- | ------------------------------------------------ |
| 0     | No application trace (default).                  |
| 1     | Trace application addition, update, and removal. |

## IceGrid.Registry.Trace.Discovery

### Synopsis {% id="icegrid.registry.trace.discovery-synopsis" %}

`IceGrid.Registry.Trace.Discovery=num`

### Description {% id="icegrid.registry.trace.discovery-description" %}

The discovery trace level:

| `0` | No discovery trace (default).                    |
| --- | ------------------------------------------------ |
| `1` | Trace replied discovery lookup requests.         |
| 2   | Like 1, also includes discarded lookup requests. |

## IceGrid.Registry.Trace.Locator

### Synopsis {% id="icegrid.registry.trace.locator-synopsis" %}

`IceGrid.Registry.Trace.Locator=num`

### Description {% id="icegrid.registry.trace.locator-description" %}

The locator and locator registry trace level:

| Value | Description                                                                                |
| ----- | ------------------------------------------------------------------------------------------ |
| 0     | No locator trace (default).                                                                |
| 1     | Trace failures to locate an adapter or object, and failures to register adapter endpoints. |
| 2     | Like 1, but more verbose, including registration of adapter endpoints.                     |

## IceGrid.Registry.Trace.Node

### Synopsis {% id="icegrid.registry.trace.node-synopsis" %}

`IceGrid.Registry.Trace.Node=num`

### Description {% id="icegrid.registry.trace.node-description" %}

The node trace level:

| Value | Description                                                               |
| ----- | ------------------------------------------------------------------------- |
| 0     | No node trace (default).                                                  |
| 1, 2  | Trace nodes going up and down, and node session creation and destruction. |
| 3     | Like 1, plus the keep-alive messages of each node with its load averages. |

## IceGrid.Registry.Trace.Object

### Synopsis {% id="icegrid.registry.trace.object-synopsis" %}

`IceGrid.Registry.Trace.Object=num`

### Description {% id="icegrid.registry.trace.object-description" %}

The object trace level:

| Value | Description                                                     |
| ----- | --------------------------------------------------------------- |
| 0     | No object trace (default).                                      |
| 1     | Trace object registration, removal.                             |
| 2     | Like 1, plus the allocation and release of allocatable objects. |

## IceGrid.Registry.Trace.Replica

### Synopsis {% id="icegrid.registry.trace.replica-synopsis" %}

`IceGrid.Registry.Trace.Replica=num`

### Description {% id="icegrid.registry.trace.replica-description" %}

The replica trace level:

| Value | Description                                                                                                    |
| ----- | -------------------------------------------------------------------------------------------------------------- |
| 0     | No replica trace (default).                                                                                    |
| 1     | Trace replicas going up and down, and the session lifecycle between the master replica and the other replicas. |
| 2     | Like 1, plus session establishment attempts and failures.                                                      |
| 3     | Like 2, plus keep-alive messages.                                                                              |

## IceGrid.Registry.Trace.Server

### Synopsis {% id="icegrid.registry.trace.server-synopsis" %}

`IceGrid.Registry.Trace.Server=num`

### Description {% id="icegrid.registry.trace.server-description" %}

The server trace level:

| Value | Description                                                                            |
| ----- | -------------------------------------------------------------------------------------- |
| 0     | No server trace (default).                                                             |
| 1     | Trace the addition and removal of servers in the Registry database.                    |
| 2     | Like 1, but more verbose: includes load/unload failures, properties updates, and more. |
| 3     | Like 2, plus the start of each server load and unload on a node.                       |

## IceGrid.Registry.Trace.Session

### Synopsis {% id="icegrid.registry.trace.session-synopsis" %}

`IceGrid.Registry.Trace.Session=num`

### Description {% id="icegrid.registry.trace.session-description" %}

The session trace level:

| Value | Description                                                                                          |
| ----- | ---------------------------------------------------------------------------------------------------- |
| 0     | No client or admin session trace (default).                                                          |
| 1     | Trace client or admin session creation and destruction, and failures to call a permissions verifier. |

## IceGrid.Registry.UserAccounts

### Synopsis {% id="icegrid.registry.useraccounts-synopsis" %}

`IceGrid.Registry.UserAccounts=file`

### Description {% id="icegrid.registry.useraccounts-description" %}

Specifies the file name of an IceGrid registry user account map file. The file uses the format described in
[IceGrid.Node.UserAccounts](#icegrid.node.useraccounts). The identifier is matched against the client session identifier
(the user ID for sessions created with a user ID and password, or the distinguished name for sessions created from a
secure connection). This user account map file is used by IceGrid nodes to map session identifiers to user accounts if
the nodes' IceGrid.Node.UserAccountMapper property is set to the proxy `IceGrid/RegistryUserAccountMapper`.
