---
id: glacier2-properties
title: Glacier2.*
---

# Glacier2.AddConnectionContext

#### Synopsis

`Glacier2.AddConnectionContext=num`

#### Description

If `num` is set to 1 or 2, Glacier2 adds a number of key-value pairs to the
[request context](../how-glacier2-uses-request-contexts) that it sends with each request. If `num` is set to 1, these
entries are added to the context for all forwarded requests. If `num` is set to 2, the contexts are added only to calls
to `checkPermissions` and `authorize` on permission verifiers, and to calls to `create` on session managers.

If num is non-0, Glacier2 adds the following context entries:

| `_con.type`          | The type of the connection as returned by `Connection::type`.     |
| -------------------- | ----------------------------------------------------------------- |
| `_con.localAddress`  | The local address (TCP and SSL only).                             |
| `_con.localPort`     | The local port (TCP and SSL only).                                |
| `_con.remoteAddress` | The remote address (TCP and SSL only).                            |
| `_con.remotePort`    | The remote port (TCP and SSL only).                               |
| `_con.cipher`        | The cipher (SSL only).                                            |
| `_con.peerCert`      | The first certificate of the client certificate chain (SSL only). |

The default value is 0, meaning that no contexts are added.

# Glacier2.Client._AdapterProperty_

#### Synopsis

`Glacier2.Client.AdapterProperty=value`

#### Description

Glacier2 uses the adapter name `Glacier2.Client` for the object adapter that it provides to clients. Therefore,
[adapter properties](../object-adapter-properties) can be used to configure this adapter.

This adapter must be accessible to clients of Glacier2. Use of a secure transport for this adapter is highly
recommended.

Note that `Glacier2.Registry.Client.Endpoints` controls the client endpoint for Glacier2. The port numbers 4063 (for
TCP) and 4064 (for SSL) are reserved for Glacier2 by the
[Internet Assigned Numbers Authority](https://www.iana.org/assignments/service-names-port-numbers) (IANA).

# Glacier2.Client.ForwardContext

#### Synopsis

`Glacier2.Client.ForwardContext=num`

#### Description

If `num` is set to a value larger than 0, the Glacier2 router includes the
[request context](../how-glacier2-uses-request-contexts) when forwarding requests from clients to servers. The default
value is `0`.

# Glacier2.Client.Trace.Reject

#### Synopsis

`Glacier2.Client.Trace.Reject=num`

#### Description

If `num` is set to a value larger than 0, the Glacier2 router logs a trace message whenever the router's configured
[filters](../securing-a-glacier2-router) reject a client's request. The default value is `0`.

# Glacier2.Client.Trace.Request

#### Synopsis

`Glacier2.Client.Trace.Request=num`

#### Description

If `num` is set to a value larger than 0, the Glacier2 router logs a trace message for each request that is forwarded
from a client. The default value is `0`.

# Glacier2.CryptPasswords

#### Synopsis

`Glacier2.CryptPasswords=file`

#### Description

Specifies the file name of a Glacier2 [access control list](../securing-a-glacier2-router). Each line of the file must
contain a user name and an encrypted password, separated by white space, as described in
[Writing a Password File](../getting-started-with-glacier2). This property is ignored if
[Glacier2.*#Glacier2.PermissionsVerifier](../glacier2-properties#glacier2.permissionsverifier) is defined.

# Glacier2.Filter.AdapterId.Accept

#### Synopsis

`Glacier2.Filter.AdapterId.Accept=list`

#### Description

Specifies a space-separated list of adapter identifiers. If defined, the Glacier2 router
[filters requests](../securing-a-glacier2-router) so that it only allows requests to Ice objects with an adapter
identifier that matches one of the entries in this list.

Identifiers that contain spaces must be enclosed in single or double quotes. Single or double quotes that appear within
an identifier must be escaped with a leading backslash.

# Glacier2.Filter.Address.Accept

#### Synopsis

`Glacier2.Filter.Address.Accept=list`

#### Description

Specifies a space-separated list of address-port pairs. When defined, the Glacier2 router
[filters requests](../securing-a-glacier2-router) so that it only allows requests to Ice objects through proxies that
contain network endpoint information that matches an address-port pair listed in this property. If not defined, the
default value is `*`, which indicates that any network address is permitted. Requests accepted by this property may be
rejected by the [Glacier2.*#Glacier2.Filter.Address.Reject](../glacier2-properties#glacier2.filter.address.reject)
property.

Each pair is of the form `address` or `address:port`. The `address` portion can include wildcards ('`*`'). Port
selection can be individual, value ranges, or groups. Ranges and groups have the form `[value1,value2,value3,...]`
and/or `[value1-value2]`. If the `port` section is unspecified then all ports will be permitted.

# Glacier2.Filter.Address.Reject

#### Synopsis

`Glacier2.Filter.Address.Reject=list`

#### Description

Specifies a space-separated list of address-port pairs. When defined, the Glacier2 router rejects requests to Ice
objects through proxies that contain network endpoint information that matches an address-port pair listed in this
property. If not set, the Glacier2 router allows requests to any network address unless the
[Glacier2.*#Glacier2.Filter.Address.Accept](../glacier2-properties#glacier2.filter.address.accept) property is set, in
which case requests will be accepted or rejected based on the `Glacier2.Filter.Address.Accept` property. If both the
`Glacier2.Filter.Address.Accept` and `Glacier2.Filter.Address.Reject` properties are defined, the
`Glacier2.Filter.Address.Reject` property takes precedence.

Each pair is of the form `address` or `address:port`. The `address` portion can include wildcards ('`*`'). Port
selection can be individual, value ranges, or groups. Ranges and groups have the form `[value1,value2,value3,...]`
and/or `[value1-value2]`. If the `port` section is unspecified then all ports will be rejected.

# Glacier2.Filter.Category.Accept

#### Synopsis

`Glacier2.Filter.Category.Accept=list`

#### Description

Specifies a space-separated list of identity categories. If defined, the Glacier2 router
[filters requests](../securing-a-glacier2-router) so that it only allows requests to Ice objects with an identity that
matches one of the categories in this list. If
[Glacier2.*#Glacier2.Filter.Category.AcceptUser](../glacier2-properties#glacier2.filter.category.acceptuser) is defined
with a non-0 value, the router automatically adds the user name of each session to this list.

Categories that contain spaces must be enclosed in single or double quotes. Single or double quotes that appear within a
category must be escaped with a leading backslash.

# Glacier2.Filter.Category.AcceptUser

#### Synopsis

`Glacier2.Filter.Category.AcceptUser=num`

#### Description

Specifies whether to add an authenticated user ID to the
[Glacier2.*#Glacier2.Filter.Category.Accept](../glacier2-properties#glacier2.filter.category.accept) property when
creating a new session. The legal values are shown below:

| 0   | Do not add the user ID (default).          |
| --- | ------------------------------------------ |
| 1   | Add the user ID.                           |
| 2   | Add the user ID with a leading underscore. |

{% callout type="info" %}

This property applies only to regular sessions (with username/password authentication). It has no effect on SSL
sessions.

{% /callout %}

# Glacier2.Filter.Identity.Accept

#### Synopsis

`Glacier2.Filter.Identity.Accept=list`

#### Description

Specifies a space-separated list of identities. If defined, the Glacier2 router
[filters requests](../securing-a-glacier2-router) so that it only allows requests to Ice objects with an identity that
matches one of the entries in this list.

Identities that contain spaces must be enclosed in single or double quotes. Single or double quotes that appear within
an identity must be escaped with a leading backslash.

# Glacier2.Filter.ProxySizeMax

#### Synopsis

`Glacier2.Filter.ProxySizeMax=num`

#### Description

If set, the Glacier2 router [rejects requests](../securing-a-glacier2-router) whose stringified proxies are longer than
`num`. This helps secure the system against attack. If not set, Glacier2 will accept requests using proxies of any
length.

# Glacier2.InstanceName

#### Synopsis

`Glacier2.InstanceName=name`

#### Description

Specifies a default identity category for the [Glacier2 objects](../getting-started-with-glacier2). If defined, the
identity of the Glacier2 administrative interface becomes `name/admin` and the identity of the Glacier2 router interface
becomes `name/router`.

If not defined, the default value is `Glacier2`.

# Glacier2.PermissionsVerifier

#### Synopsis

`Glacier2.PermissionsVerifier=proxy`

#### Description

Specifies the proxy of an object that implements the `Glacier2::PermissionsVerifier` interface for
[controlling access to Glacier2 sessions](../securing-a-glacier2-router). The router invokes this proxy to validate the
user name and password of each new session. Sessions created from a secure connection are verified by the object
specified in [Glacier2.*#Glacier2.SSLPermissionsVerifier](../glacier2-properties#glacier2.sslpermissionsverifier). For
simple configurations, you can specify the name of a password file using
[Glacier2.*#Glacier2.CryptPasswords](../glacier2-properties#glacier2.cryptpasswords).

Glacier2 supplies a "null" permissions verifier object that accepts any username and password combination for situations
in which no authentication is necessary. To enable this verifier, set the property value to
`instance/NullPermissionsVerifier`, where `instance` is the value of
[Glacier2.*#Glacier2.InstanceName](../glacier2-properties#glacier2.instancename).

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

# Glacier2.RoutingTable.MaxSize

#### Synopsis

`Glacier2.RoutingTable.MaxSize=num`

#### Description

This property sets the size of the router's [routing table](../securing-a-glacier2-router) to `num` entries. If more
proxies are added to the table than this value, proxies are evicted from the table on a least-recently used basis.

Clients based on Ice version 3.1 and later automatically retry operation calls on evicted proxies and transparently
re-add such proxies to the table. Clients based on Ice versions earlier than 3.1 receive an `ObjectNotExistException`
for invocations on evicted proxies. For such older clients, `num` must be set to a sufficiently large value to prevent
these clients from failing.

The default size of the routing table is 1000.

# Glacier2.Server._AdapterProperty_

#### Synopsis

`Glacier2.Server.AdapterProperty=value`

#### Description

Glacier2 uses the adapter name `Glacier2.Server` for the object adapter that it provides to servers. Therefore,
[adapter properties](../object-adapter-properties) can be used to configure this adapter.

This adapter provides access to the `SessionControl` interface and must be accessible to servers that call back to
router clients.

# Glacier2.Server.ForwardContext

#### Synopsis

`Glacier2.Server.ForwardContext=num`

#### Description

If `num` is set to a value larger than 0, the Glacier2 router includes the
[request context](../how-glacier2-uses-request-contexts) when forwarding requests from servers to clients. The default
value is `0`.

# Glacier2.Server.Trace.Request

#### Synopsis

`Glacier2.Server.Trace.Request=num`

#### Description

If `num` is set to a value larger than 0, the Glacier2 router logs a trace message for each request that is forwarded
from a server. The default value is `0`.

# Glacier2.SessionManager

#### Synopsis

`Glacier2.SessionManager=proxy`

#### Description

Specifies the proxy of an object that implements the `Glacier2::SessionManager` interface. The router invokes this proxy
to create a new session for a client, but only after the router validates the client's user name and password.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

# Glacier2.SSLPermissionsVerifier

#### Synopsis

`Glacier2.SSLPermissionsVerifier=proxy`

#### Description

Specifies the proxy of an object that implements the `Glacier2::SSLPermissionsVerifier` interface for
[controlling access to Glacier2 sessions](../securing-a-glacier2-router). The router invokes this proxy to verify the
credentials of clients that attempt to create a session from a secure connection. Sessions created with a user name and
password are verified by the object specified in
[Glacier2.*#Glacier2.PermissionsVerifier](../glacier2-properties#glacier2.permissionsverifier).

Glacier2 supplies a "null" permissions verifier object that accepts the credentials of any client for situations in
which no authentication is necessary. To enable this verifier, set the property value to
`instance/NullSSLPermissionsVerifier`, where `instance` is the value of
[Glacier2.*#Glacier2.InstanceName](../glacier2-properties#glacier2.instancename).

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

# Glacier2.SSLSessionManager

#### Synopsis

`Glacier2.SSLSessionManager=proxy`

#### Description

Specifies the proxy of an object that implements the `Glacier2::SSLSessionManager` interface for
[managing sessions](../glacier2-session-management). The router invokes this proxy to create a new session for a client
that has called `createSessionFromSecureConnection`.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

# Glacier2.Trace.RoutingTable

#### Synopsis

`Glacier2.Trace.RoutingTable=num`

#### Description

The routing table trace level:

| 0   | No routing table trace (default).                                                                                                                                  |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Logs a message for each proxy that is added to the routing table.                                                                                                  |
| 2   | Logs a message for each proxy that is evicted from the routing table (see [#Glacier2.RoutingTable.MaxSize](../glacier2-properties#glacier2.routingtable.maxsize)). |
| 3   | Combines the output for trace levels 1 and 2.                                                                                                                      |

# Glacier2.Trace.Session

#### Synopsis

`Glacier2.Trace.Session=num`

#### Description

If `num` is set to a value larger than 0, the Glacier2 router logs trace messages about session-related activities. The
default value is `0`.
