---
title: IceGrid Server Activation
---

## Server Activation Modes

You can choose among four activation modes for servers deployed and managed by an IceGrid node:

- Manual You must start the server explicitly via the IceGrid GUI or `icegridadmin`, or programmatically via the
  `IceGrid::Admin` interface.

- Always IceGrid activates the server when its node starts. If the server stops, IceGrid automatically reactivates it.
  If server activation fails, IceGrid disables the server and does not retry starting it unless
  `IceGrid.Node.DisableOnFailure` is configured.

- On demand IceGrid activates the server when a client invokes an operation on an object in the server.

- Session This mode also provides on-demand activation but requires the server to be allocated by a session.

## Server Activation in Detail

On-demand server activation is a valuable feature of distributed computing architectures for a number of reasons:

- It minimizes application startup times by avoiding the need to pre-start all servers.
- It allows administrators to use their computing resources more efficiently because only those servers that are
  actually needed are running.
- It provides more reliability in the case of some server failure scenarios, e.g., the server is reactivated after a
  failure and may still be capable of providing some services to clients until the failure is resolved.
- It allows remote activation and deactivation.

On-demand activation occurs when an Ice client [requests the endpoints](../icegrid-architecture) of one of the server's
object adapters via a locate request. If the server is not active at the time the client issues the request, the node
activates the server and waits for the target object adapter to register its endpoints. Once the object adapter
endpoints are registered, the registry returns the endpoint information back to the client. This sequence ensures that
the client receives the endpoint information _after_ the server is ready to receive requests.

## Requirements for Server Activation

In order to use on-demand activation for an object adapter, the adapter must have an identifier and be entered in the
IceGrid registry.

When using session activation mode, IceGrid requires that the server be
[allocated](../resource-allocation-using-icegrid-sessions); on-demand activation fails for servers that have not been
allocated.

The session activation mode recognizes an additional [reserved variable](../using-descriptor-variables-and-parameters)
in the server descriptor, `${session.id}`. The value of this variable is the user ID or, for SSL sessions, the
distinguished name associated with the session.

## Efficiency Considerations for Server Activation

Once a server is activated, it remains running indefinitely (unless it uses the session activation mode). A node
[deactivates a server](../../../runtime/locators/locator-configuration-for-a-server) only when explicitly requested to
do so. As a result, server processes tend to accumulate on the node's host.

One of the advantages of on-demand activation is the ability to manage computing resources more efficiently. Of course
there are many aspects to this, but Ice makes one technique particularly simple: servers can be configured to terminate
gracefully after they have been idle for a certain amount of time.

A typical scenario involves a server that is activated on demand, used for a while by one or more clients, and then
terminated automatically when no requests have been made for a configurable number of seconds. All that is necessary is
setting the server's configuration property [Ice.ServerIdleTime](../../../property-reference/ice-properties) to the
desired idle time.

For a server activated in session activation mode, IceGrid deactivates the server when the session releases the server
or when the session is destroyed.

## Activating Servers with Specific User IDs

An IceGrid node that runs as root on Unix, including macOS, runs each server under the operating system account that the
server's user string, described below, maps to. On Windows, or when the node does not run as root, the node runs every
server under its own account, and fails to load a server whose user string maps to another account.

### The User String

For each server, the node computes a user string:

- When the [server descriptor](../icegrid-xml-reference/server-descriptor-element) sets the `user` attribute, the user
  string is the value of this attribute.
- When the `user` attribute is not set and the node runs as root on Unix, the user string is the session ID for a server
  with the `session` activation mode, and `nobody` for a server with any other activation mode.

The node computes the user string of a server with the `session` activation mode when a session allocates the server;
until then, this user string is empty.

The session ID is the user ID for a session created with a user ID and password, and the distinguished name of the
client certificate for a session created from a secure connection. It is also the value of the `${session.id}`
[reserved variable](../using-descriptor-variables-and-parameters).

When a user account mapper is configured, the node maps a non-empty user string to an account name, whatever the
activation mode. Without a mapper, the user string is the account name. The node refuses to run a server as root unless
[IceGrid.Node.AllowRunningServersAsRoot](../../../property-reference/icegrid-properties#icegrid.node.allowrunningserversasroot)
permits it.

### User Account Mappers

A user account mapper maps user strings to operating system accounts. Mapping is useful because an account name can
differ from one machine to another, and because a session ID, such as a distinguished name, is not an account name. A
user account mapper implements the
[`IceGrid::UserAccountMapper`](https://code.zeroc.com/ice/3.8/api/slice/interfaceIceGrid_1_1UserAccountMapper.html)
interface:

```slice
exception UserAccountNotFoundException {}

interface UserAccountMapper
{
    string getUserAccount(string user)
            throws UserAccountNotFoundException;
}
```

The node calls `getUserAccount` with the user string and runs the server under the returned account. When the mapper
throws `UserAccountNotFoundException`, the node fails to load the server.

IceGrid provides a built-in file-based user account mapper, which you can configure for a node and for the registry.
Each line of the file contains an account name, white space, and the user string that maps to this account. The user
string is the rest of the line and can contain spaces. A `#` starts a comment that runs to the end of the line. When the
same user string appears on several lines, the last line wins. The file-based mapper throws
`UserAccountNotFoundException` for any user string missing from the file, including `nobody`.

The following file maps the `user` attribute `lisa` of a server descriptor, the user ID `lisa` of a session created with
a password, and the distinguished name of Lisa's client certificate to the local account `lisa`, and maps `nobody` to
itself for the other servers that set no `user` attribute:

```text
lisa lisa
lisa CN=Lisa,OU=Ice,O=ZeroC
nobody nobody
```

With this file, a node running as root runs a server whose descriptor sets `user="lisa"` under the account `lisa`. It
also runs a server with the `session` activation mode and no `user` attribute under `lisa` when a session created from a
secure connection with Lisa's certificate allocates the server.

You can specify the path of the user account file with the
[IceGrid.Registry.UserAccounts](../../../property-reference/icegrid-properties#icegrid.registry.useraccounts) property
for the registry and the
[IceGrid.Node.UserAccounts](../../../property-reference/icegrid-properties#icegrid.node.useraccounts) property for a
node.

To configure an IceGrid node to use the registry's file-based user account mapper, set the
[IceGrid.Node.UserAccountMapper](../../../property-reference/icegrid-properties#icegrid.node.useraccountmapper) property
to the well-known proxy `IceGrid/RegistryUserAccountMapper`. You can also set this property to the proxy of your own
user account mapper object. When this property is set, the node ignores `IceGrid.Node.UserAccounts`.

## Automating Endpoint Registration

Servers must be [properly configured](../../../runtime/locators/locator-configuration-for-a-server) to enable automatic
endpoint registration. It should be noted however that IceGrid simplifies the configuration process in two ways:

- The IceGrid [deployment facility](../using-icegrid-deployment) automates the creation of a
  [configuration file](../getting-started-with-icegrid) for the server, including the definition of object adapter
  identifiers and endpoints.
- A server that is activated automatically by an IceGrid node does not need to explicitly configure a proxy for the
  locator because the IceGrid node defines it in the server's configuration file.

## See Also

- [Getting Started with IceGrid](../getting-started-with-icegrid)
- [IceGrid Architecture](../icegrid-architecture)
- [Resource Allocation Using IceGrid Sessions](../resource-allocation-using-icegrid-sessions)
- [Server Descriptor Element](../icegrid-xml-reference/server-descriptor-element)
- [Locator Configuration for a Server](../../../runtime/locators/locator-configuration-for-a-server)
- [Using IceGrid Deployment](../using-icegrid-deployment)
- [IceGrid.*](../../../property-reference/icegrid-properties)
