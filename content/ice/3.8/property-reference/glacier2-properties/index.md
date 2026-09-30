---
title: Glacier2.*
---

## Glacier2.AddConnectionContext

### Synopsis {% id="glacier2.addconnectioncontext-synopsis" %}

`Glacier2.AddConnectionContext=num`

### Description {% id="glacier2.addconnectioncontext-description" %}

Controls the connection information that Glacier2 adds to the [request context](../how-glacier2-uses-request-contexts):

| Value | Description                                                                                                                             |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | Do not add connection information (default).                                                                                            |
| 1     | Add connection information to permissions-verifier and session-manager calls, and to requests forwarded from clients to servers.        |
| 2     | Add connection information to `checkPermissions` and `authorize` calls on permissions verifiers and `create` calls on session managers. |

For values 1 and 2, Glacier2 supplies the following entries when the connection provides the corresponding information:

| Key                  | Description                                                                                                |
| -------------------- | ---------------------------------------------------------------------------------------------------------- |
| `_con.type`          | The connection type returned by `Connection::type`.                                                        |
| `_con.localAddress`  | The local IP address.                                                                                      |
| `_con.localPort`     | The local port.                                                                                            |
| `_con.remoteAddress` | The remote IP address.                                                                                     |
| `_con.remotePort`    | The remote port.                                                                                           |
| `_con.peerCert`      | The client's peer certificate, encoded in PEM format, for SSL and WSS connections with a peer certificate. |

The address and port entries apply to IP-based transports, including TCP, SSL, WS and WSS. Glacier2 removes
client-supplied values for the keys listed above from session-creation requests before calling the verifier or session
manager.

## Glacier2.Client._AdapterProperty_

### Synopsis {% id="glacier2.client.adapterproperty-synopsis" %}

`Glacier2.Client.AdapterProperty=value`

### Description {% id="glacier2.client.adapterproperty-description" %}

Glacier2 uses the adapter name `Glacier2.Client` for the object adapter that it provides to clients. Therefore,
[adapter properties](../object-adapter-properties) can be used to configure this adapter.

This adapter must be accessible to clients of Glacier2. Use of a secure transport for this adapter is highly
recommended.

`Glacier2.Client.Endpoints` specifies the client endpoints and must be set for the router to start. The port numbers
4063 (for TCP) and 4064 (for SSL) are reserved for Glacier2 by the
[Internet Assigned Numbers Authority](https://www.iana.org/assignments/service-names-port-numbers) (IANA).

`Glacier2.Client.Connection.InactivityTimeout` defaults to 0. The client adapter's connection idle timeout,
`Glacier2.Client.Connection.IdleTimeout`, supplies the value returned by `Glacier2::Router::getSessionTimeout`; it
defaults to `Ice.Connection.Server.IdleTimeout`.

## Glacier2.Client.ForwardContext

### Synopsis {% id="glacier2.client.forwardcontext-synopsis" %}

`Glacier2.Client.ForwardContext=num`

### Description {% id="glacier2.client.forwardcontext-description" %}

If `num` is set to a value larger than 0, the Glacier2 router includes the
[request context](../how-glacier2-uses-request-contexts) when forwarding requests from clients to servers. The default
value is `0`.

When `Glacier2.AddConnectionContext` is 1, Glacier2 includes its connection-information context even if
`Glacier2.Client.ForwardContext` is 0.

## Glacier2.Client.Trace.Reject

### Synopsis {% id="glacier2.client.trace.reject-synopsis" %}

`Glacier2.Client.Trace.Reject=num`

### Description {% id="glacier2.client.trace.reject-description" %}

Controls tracing for the router's [filters](../securing-a-glacier2-router):

| Value | Description                                                                                                                                                                                               |
| ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | No filter trace (default).                                                                                                                                                                                |
| 1, 2  | Trace proxy acceptance and rejection by the address and proxy-size filters, request rejections by category, identity and adapter-ID filters, and requests rejected because the connection has no session. |
| 3     | Like 1, with details of individual address and port matches.                                                                                                                                              |

## Glacier2.Client.Trace.Request

### Synopsis {% id="glacier2.client.trace.request-synopsis" %}

`Glacier2.Client.Trace.Request=num`

### Description {% id="glacier2.client.trace.request-description" %}

If `num` is set to a value larger than 0, the Glacier2 router logs a trace message for each request that is forwarded
from a client. The default value is `0`.

## Glacier2.CryptPasswords

### Synopsis {% id="glacier2.cryptpasswords-synopsis" %}

`Glacier2.CryptPasswords=file`

### Description {% id="glacier2.cryptpasswords-description" %}

Specifies the file name of a Glacier2 [access control list](../securing-a-glacier2-router). Each non-blank line contains
a user name and a password hash, separated by whitespace. User names must be unique. The supported hash formats depend
on the platform; see [Writing a Password File](../getting-started-with-glacier2).

This property is ignored if [Glacier2.PermissionsVerifier](../glacier2-properties#glacier2.permissionsverifier) is
defined.

## Glacier2.Filter.AdapterId.Accept

### Synopsis {% id="glacier2.filter.adapterid.accept-synopsis" %}

`Glacier2.Filter.AdapterId.Accept=list`

### Description {% id="glacier2.filter.adapterid.accept-description" %}

Specifies a space-separated list of adapter identifiers. If defined, the Glacier2 router
[filters requests](../securing-a-glacier2-router) so that it only allows requests to Ice objects with an adapter
identifier that matches one of the entries in this list.

Identifiers that contain spaces must be enclosed in single or double quotes. Single or double quotes that appear within
an identifier must be escaped with a leading backslash.

## Glacier2.Filter.Address.Accept

### Synopsis {% id="glacier2.filter.address.accept-synopsis" %}

`Glacier2.Filter.Address.Accept=list`

### Description {% id="glacier2.filter.address.accept-description" %}

Specifies a space-separated list of address-port pairs. When defined, the Glacier2 router
[filters requests](../securing-a-glacier2-router) so that it only allows requests to Ice objects through direct proxies
whose endpoints all match the same address-port pair in this list. If not defined, this property imposes no address
restriction. Requests accepted by this property may be rejected by the
[Glacier2.*#Glacier2.Filter.Address.Reject](../glacier2-properties#glacier2.filter.address.reject) property.

Each pair is of the form `address` or `address:port`. The `address` portion can include wildcards ('`*`'). Port
selection can be individual, value ranges, or groups. Ranges and groups have the form `[value1,value2,value3,...]`
and/or `[value1-value2]`. If the `port` section is unspecified then all ports will be permitted.

Host matching is case-insensitive and ignores a trailing dot on a DNS name. When either address filter is set, Glacier2
rejects proxies containing a non-IP or unknown transport, an empty host, a host longer than 255 bytes, a host containing
spaces or control characters, or an IPv4 address with a non-canonical spelling or a trailing dot.

## Glacier2.Filter.Address.Reject

### Synopsis {% id="glacier2.filter.address.reject-synopsis" %}

`Glacier2.Filter.Address.Reject=list`

### Description {% id="glacier2.filter.address.reject-description" %}

Specifies a space-separated list of address-port pairs. When defined, the Glacier2 router rejects requests to Ice
objects through proxies with any endpoint matching any address-port pair in this list. If not set, the Glacier2 router
allows requests to any network address unless the
[Glacier2.*#Glacier2.Filter.Address.Accept](../glacier2-properties#glacier2.filter.address.accept) property is set, in
which case requests will be accepted or rejected based on the `Glacier2.Filter.Address.Accept` property. If both the
`Glacier2.Filter.Address.Accept` and `Glacier2.Filter.Address.Reject` properties are defined, the
`Glacier2.Filter.Address.Reject` property takes precedence.

Each pair is of the form `address` or `address:port`. The `address` portion can include wildcards ('`*`'). Port
selection can be individual, value ranges, or groups. Ranges and groups have the form `[value1,value2,value3,...]`
and/or `[value1-value2]`. If the `port` section is unspecified then all ports will be rejected.

The host restrictions described for
[Glacier2.Filter.Address.Accept](../glacier2-properties#glacier2.filter.address.accept) also apply here.

## Glacier2.Filter.Category.Accept

### Synopsis {% id="glacier2.filter.category.accept-synopsis" %}

`Glacier2.Filter.Category.Accept=list`

### Description {% id="glacier2.filter.category.accept-description" %}

Specifies a space-separated list of identity categories. If defined, the Glacier2 router
[filters requests](../securing-a-glacier2-router) so that it only allows requests to Ice objects with an identity that
matches one of the categories in this list. If
[Glacier2.*#Glacier2.Filter.Category.AcceptUser](../glacier2-properties#glacier2.filter.category.acceptuser) is defined
with a non-0 value, the router automatically adds the user name of each session to this list.

Categories that contain spaces must be enclosed in single or double quotes. Single or double quotes that appear within a
category must be escaped with a leading backslash.

## Glacier2.Filter.Category.AcceptUser

### Synopsis {% id="glacier2.filter.category.acceptuser-synopsis" %}

`Glacier2.Filter.Category.AcceptUser=num`

### Description {% id="glacier2.filter.category.acceptuser-description" %}

Specifies whether to add an authenticated user ID to the
[Glacier2.*#Glacier2.Filter.Category.Accept](../glacier2-properties#glacier2.filter.category.accept) property when
creating a new session. The legal values are shown below:

| Value | Description                                |
| ----- | ------------------------------------------ |
| 0     | Do not add the user ID (default).          |
| 1     | Add the user ID.                           |
| 2     | Add the user ID with a leading underscore. |

{% callout type="info" %}

This property applies only to regular sessions (with username/password authentication). It has no effect on SSL
sessions.

{% /callout %}

## Glacier2.Filter.Identity.Accept

### Synopsis {% id="glacier2.filter.identity.accept-synopsis" %}

`Glacier2.Filter.Identity.Accept=list`

### Description {% id="glacier2.filter.identity.accept-description" %}

Specifies a space-separated list of identities. If defined, the Glacier2 router
[filters requests](../securing-a-glacier2-router) so that it only allows requests to Ice objects with an identity that
matches one of the entries in this list.

Identities that contain spaces must be enclosed in single or double quotes. Single or double quotes that appear within
an identity must be escaped with a leading backslash.

## Glacier2.Filter.ProxySizeMax

### Synopsis {% id="glacier2.filter.proxysizemax-synopsis" %}

`Glacier2.Filter.ProxySizeMax=num`

### Description {% id="glacier2.filter.proxysizemax-description" %}

If `num` is greater than 0, the Glacier2 router [rejects requests](../securing-a-glacier2-router) whose stringified
proxies are longer than `num` bytes. The default value is 0, which imposes no proxy-size limit.

## Glacier2.InstanceName

### Synopsis {% id="glacier2.instancename-synopsis" %}

`Glacier2.InstanceName=name`

### Description {% id="glacier2.instancename-description" %}

Specifies the identity category for the [Glacier2 router](../getting-started-with-glacier2) and its null permissions
verifiers: `name/router`, `name/NullPermissionsVerifier` and `name/NullSSLPermissionsVerifier`. Glacier2 also uses this
value as the router name in its metrics.

The default value is `Glacier2`.

## Glacier2.PermissionsVerifier

### Synopsis {% id="glacier2.permissionsverifier-synopsis" %}

`Glacier2.PermissionsVerifier=proxy`

### Description {% id="glacier2.permissionsverifier-description" %}

Specifies the proxy of an object that implements the `Glacier2::PermissionsVerifier` interface for
[controlling access to Glacier2 sessions](../securing-a-glacier2-router). The router invokes this proxy to validate the
user name and password of each new session. Glacier2 uses the object specified in
[Glacier2.*#Glacier2.SSLPermissionsVerifier](../glacier2-properties#glacier2.sslpermissionsverifier) when the client
calls `createSessionFromSecureConnection`. For simple configurations, you can specify the name of a password file using
[Glacier2.*#Glacier2.CryptPasswords](../glacier2-properties#glacier2.cryptpasswords).

Glacier2 supplies a "null" permissions verifier object that accepts any username and password combination for situations
in which no authentication is necessary. To enable this verifier, set the property value to
`instance/NullPermissionsVerifier`, where `instance` is the value of
[Glacier2.*#Glacier2.InstanceName](../glacier2-properties#glacier2.instancename).

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

The router requires a permissions verifier configured with `Glacier2.PermissionsVerifier`,
`Glacier2.SSLPermissionsVerifier` or `Glacier2.CryptPasswords`.

## Glacier2.RoutingTable.MaxSize

### Synopsis {% id="glacier2.routingtable.maxsize-synopsis" %}

`Glacier2.RoutingTable.MaxSize=num`

### Description {% id="glacier2.routingtable.maxsize-description" %}

This property sets the size of the router's [routing table](../securing-a-glacier2-router) to `num` entries. If more
proxies are added to the table than this value, proxies are evicted from the table on a least-recently used basis.

Clients automatically retry operation calls on evicted proxies and transparently re-add such proxies to the table.

The default size of the routing table is 1000.

## Glacier2.Server._AdapterProperty_

### Synopsis {% id="glacier2.server.adapterproperty-synopsis" %}

`Glacier2.Server.AdapterProperty=value`

### Description {% id="glacier2.server.adapterproperty-description" %}

Glacier2 uses the adapter name `Glacier2.Server` for the object adapter that it provides to servers. Therefore,
[adapter properties](../object-adapter-properties) can be used to configure this adapter.

Glacier2 creates this adapter only when `Glacier2.Server.Endpoints` is set. The adapter provides access to the
`SessionControl` interface and must be accessible to servers that call back to router clients. Without this adapter,
Glacier2 passes a null `SessionControl` proxy to session managers.

## Glacier2.Server.ForwardContext

### Synopsis {% id="glacier2.server.forwardcontext-synopsis" %}

`Glacier2.Server.ForwardContext=num`

### Description {% id="glacier2.server.forwardcontext-description" %}

If `num` is set to a value larger than 0, the Glacier2 router includes the
[request context](../how-glacier2-uses-request-contexts) when forwarding requests from servers to clients. The default
value is `0`.

## Glacier2.Server.Trace.Request

### Synopsis {% id="glacier2.server.trace.request-synopsis" %}

`Glacier2.Server.Trace.Request=num`

### Description {% id="glacier2.server.trace.request-description" %}

If `num` is set to a value larger than 0, the Glacier2 router logs a trace message for each request that is forwarded
from a server. The default value is `0`.

## Glacier2.SessionManager

### Synopsis {% id="glacier2.sessionmanager-synopsis" %}

`Glacier2.SessionManager=proxy`

### Description {% id="glacier2.sessionmanager-description" %}

Specifies the proxy of an object that implements the `Glacier2::SessionManager` interface. The router invokes this proxy
to create a new session for a client, but only after the router validates the client's user name and password.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

Glacier2 always disables connection caching for this proxy. Its locator cache timeout defaults to 600 seconds instead of
`Ice.Default.LocatorCacheTimeout`.

## Glacier2.SSLPermissionsVerifier

### Synopsis {% id="glacier2.sslpermissionsverifier-synopsis" %}

`Glacier2.SSLPermissionsVerifier=proxy`

### Description {% id="glacier2.sslpermissionsverifier-description" %}

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

## Glacier2.SSLSessionManager

### Synopsis {% id="glacier2.sslsessionmanager-synopsis" %}

`Glacier2.SSLSessionManager=proxy`

### Description {% id="glacier2.sslsessionmanager-description" %}

Specifies the proxy of an object that implements the `Glacier2::SSLSessionManager` interface for
[managing sessions](../glacier2-session-management). The router invokes this proxy to create a new session for a client
that has called `createSessionFromSecureConnection`.

As a proxy property, you can configure additional [aspects of the proxy](../proxy-properties) using properties.

Glacier2 always disables connection caching for this proxy. Its locator cache timeout defaults to 600 seconds instead of
`Ice.Default.LocatorCacheTimeout`.

## Glacier2.Trace.RoutingTable

### Synopsis {% id="glacier2.trace.routingtable-synopsis" %}

`Glacier2.Trace.RoutingTable=num`

### Description {% id="glacier2.trace.routingtable-description" %}

The routing table trace level:

| Value | Description                                                                                                                                     |
| ----- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 0     | No routing table trace (default).                                                                                                               |
| 1     | Trace proxy additions and attempts to add a proxy already in the routing table.                                                                 |
| 2     | Like 1, and trace proxy evictions when the table exceeds [Glacier2.RoutingTable.MaxSize](../glacier2-properties#glacier2.routingtable.maxsize). |

## Glacier2.Trace.Session

### Synopsis {% id="glacier2.trace.session-synopsis" %}

`Glacier2.Trace.Session=num`

### Description {% id="glacier2.trace.session-description" %}

If `num` is set to a value larger than 0, the Glacier2 router logs trace messages about session-related activities. The
default value is `0`.
