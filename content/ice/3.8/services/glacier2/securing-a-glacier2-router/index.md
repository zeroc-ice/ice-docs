---
title: Securing a Glacier2 Router
---

A Glacier2 router accepts connections from clients outside a private network and forwards their requests to servers
inside it. Use [SSL](../../../runtime/ssl-transport) for the router's client endpoints to encrypt the traffic between
clients and the router, and to authenticate clients by their certificates. On top of SSL, the router provides access
control, which decides which clients can create a session, and request filtering, which decides which objects a client
can reach.

## Glacier2 Access Control

Validating a client's certificate during the SSL handshake establishes who the client is, but not whether that client
may use the router. Glacier2 decides this with an access control facility that supports two forms of authentication:
passwords and certificates. You can configure the router to use either form, or both.

### Password Authentication

The router verifies the user name and password arguments to its [createSession](../getting-started-with-glacier2)
operation before it forwards any requests on behalf of the client. Given that the password is sent "in the clear," it is
important to protect these values by using an SSL connection with the router.

There are two ways for the router to verify a user name and password. By default, the router uses a file-based access
control list, but you can override this behavior by installing a proxy for an application-defined verifier object.
Configuration properties define the password file name or the verifier proxy; if you install a verifier proxy, the
password file is ignored. Since we have already discussed the [password file](../getting-started-with-glacier2), we will
focus on the custom verifier interface here.

An application that has special requirements can implement the interface `Glacier2::PermissionsVerifier` to gain
programmatic control over access to a router. This can be especially useful in situations where a repository of account
information already exists (such as an LDAP directory), in which case duplicating that information in another file would
be tedious and error-prone.

The Slice definition for the interface contains just one operation:

```slice
module Glacier2
{
    interface PermissionsVerifier
    {
        idempotent bool checkPermissions(
            string userId,
            string password,
            out string reason) throws PermissionDeniedException;
    }
}
```

The router invokes `checkPermissions` on the verifier object, passing it the user name and password arguments that were
given to `createSession`. The operation must return true if the arguments are valid, and false otherwise. If the
operation returns false, a reason can be provided in the output parameter. `checkPermissions` can also throw
`Glacier2::PermissionDeniedException`: the Glacier2 router forwards this exception as-is to the client, which means the
verifier can throw a subclass of `PermissionDeniedException` in order to provide more information to the client.

To configure a router with a custom verifier, set the configuration property
[Glacier2.PermissionsVerifier](../../../property-reference/glacier2-properties) with the proxy for the object.

In situations where authentication is not necessary, such as during development or when running in a trusted
environment, you can use Glacier2's built-in "null" permissions verifier. This object accepts any combination of user
name and password, and you can enable it with the following property definition:

```config
Glacier2.PermissionsVerifier=Glacier2/NullPermissionsVerifier
```

Note that the category of the object's identity (`Glacier2` in this example) must match the value of the property
[Glacier2.InstanceName](../../../property-reference/glacier2-properties).

### Certificate Authentication

The [createSessionFromSecureConnection](../getting-started-with-glacier2) operation does not require a user name or
password because the client's SSL connection to the router already supplies the credentials necessary to sufficiently
identify the client, in the form of X.509 certificates.

It is up to you to decide what constitutes sufficient identification. For example, a single certificate could be shared
by all clients if there is no need to distinguish between them, or you could generate a unique certificate for each
client or a group of clients. Glacier2 does not enforce any particular policy, but simply delegates the decision of
whether to accept the client's credentials to an application-defined object that implements the
`Glacier2::SSLPermissionsVerifier` interface:

```slice
module Glacier2
{
    interface SSLPermissionsVerifier
    {
        idempotent bool authorize(
            SSLInfo info,
            out string reason) throws PermissionDeniedException;
    }
}
```

Router clients may only use `createSessionFromSecureConnection` if the router is configured with a proxy for an
`SSLPermissionsVerifier` object. The implementation of `authorize` must return true to allow the client to establish a
session. To reject the session, `authorize` must return false and may optionally provide a value for `reason`, which is
returned to the client as a member of `PermissionDeniedException`. Starting with Ice 3.5, it can also throw
`Glacier2::PermissionDeniedException`. Glacier2 forwards this exception as-is to the client, which means the verifier
can raise a subclass of `PermissionDeniedException` in order to provide more information to the client.

The verifier examines the fields of `SSLInfo` to authenticate a client:

```slice
module Glacier2
{
    struct SSLInfo
    {
        string remoteHost;
        int remotePort;
        string localHost;
        int localPort;
        string cipher;
        Ice::StringSeq certs;
    }
}
```

`certs` holds a single element: the client's certificate in the Privacy Enhanced Mail (PEM) encoding.
`createSessionFromSecureConnection` requires an SSL connection with a client certificate whose subject name is not
empty. For a connection over IP, the `remoteHost`, `remotePort`, `localHost`, and `localPort` fields hold the addresses
of the client's connection to the router; for other connections, the hosts are empty and the ports are 0. The router
leaves `cipher` empty.

The verifier typically examines the certificate's subject and issuer names. It decodes the PEM string with the
certificate API of its platform, such as `X509Certificate2` in .NET or `CertificateFactory` in Java.

To install your verifier, set the [Glacier2.SSLPermissionsVerifier](../../../property-reference/glacier2-properties)
property with the proxy of your verifier object.

In situations where authentication is not necessary, such as during development or when running in a trusted
environment, you can use Glacier2's built-in "null" permissions verifier. This object accepts the credentials of any
client, and you can enable it with the following property definition:

```config
Glacier2.SSLPermissionsVerifier=Glacier2/NullSSLPermissionsVerifier
```

Note that the category of the object's identity (`Glacier2` in this example) must match the value of the property
[Glacier2.InstanceName](../../../property-reference/glacier2-properties).

### Interaction with a Permissions Verifier

The router attempts to contact the configured permissions verifiers at startup. If an object is unreachable, the router
logs a warning message but continues its normal operation. The router does not contact a verifier again until it needs
to invoke an operation on the object. For example, when a client asks the router to create a new session, the router
makes another attempt to contact the verifier; if the object is still unavailable, the router logs a message and returns
`PermissionDeniedException` to the client.

### Obtaining SSL Credentials for a Router Client

Servers that need information about a client's connection to the router can set
[Glacier2.AddConnectionContext](../../../property-reference/glacier2-properties) to 1. The router then adds connection
information to permissions-verifier and session-manager calls and to requests forwarded from clients to servers. Value 2
adds this information only to `checkPermissions` and `authorize` calls on permissions verifiers and `create` calls on
session managers.

The context entries include addressing details for connections over IP and, for SSL or WSS connections with a client
certificate, the PEM-encoded certificate in `_con.peerCert`. A server can check for this entry and extract additional
context entries as shown below:

```cpp
void unlockDoor(string id, const Ice::Current& current)
{
    auto i = current.ctx.find("_con.peerCert");
    if(i != current.ctx.end())
    {
        string certPEM = i->second;
        auto address = current.ctx.find("_con.remoteAddress");
        auto port = current.ctx.find("_con.remotePort");
        if(address != current.ctx.end() && port != current.ctx.end())
        {
            cout << "Client address = " << address->second << ":" << port->second << endl;
        }
        ...
    }
    ...
}
```

If the client supplied a certificate, the server can decode and examine it using the techniques discussed for
[IceSSL](../../../runtime/ssl-transport).

## Request Filtering

The Glacier2 router can restrict the objects that a client reaches through it. The router forwards a request when at
least one of the configured category, identity and adapter identifier filters accepts it, and forwards every request
when none of these filters is configured. The address filters and the proxy size limit apply independently.

### Address Filters

To prevent a client from accessing arbitrary back-end hosts or ports, you can configure a Glacier2 router to validate
the address information in each proxy that the client attempts to use. Two properties determine the router's filtering
behavior:

- [Glacier2.Filter.Address.Accept](../../../property-reference/glacier2-properties) An address is accepted if it matches
  an entry in this property and does not match an entry in `Glacier2.Filter.Address.Reject`.

- [Glacier2.Filter.Address.Reject](../../../property-reference/glacier2-properties) An address is rejected if it matches
  an entry in this property.

The value of each property is a list of _address_:_port_ pairs separated by spaces, as shown in the example below:

```config
Glacier2.Filter.Address.Accept=192.168.1.5:4063 192.168.1.6:4063
```

With this configuration, clients can reach two back-end hosts, each on a single port. The router rejects a proxy with
any other address (endpoint); see [Client Impact](#client-impact) for what a rejection means for the client.

You can also use ranges, groups and wildcards when defining your address filters. For example, the following property
value shows how to use an address range:

```config
Glacier2.Filter.Address.Accept=192.168.1.[5-6]:4063
```

This property is equivalent to the first example, but the range notation allows us to define the filter more concisely.
Similarly, we can restate the property using the group notation by separating values with a comma:

```config
Glacier2.Filter.Address.Accept=192.168.1.[5,6]:4063
```

The wildcard notation uses the * character to substitute for a value:

```config
Glacier2.Filter.Address.Accept=10.0.*.1:4063
```

The range, group, and wildcard notation is also supported when specifying ports, as shown below:

```config
Glacier2.Filter.Address.Accept=192.168.1.[5,6]:[10000-11000]
Glacier2.Filter.Address.Reject=192.168.1.[5,6]:[10500,10501]
```

In this configuration, the router allows clients to access all of the ports in the range `10000` to `11000`, except for
the two ports `10500` and `10501`.

At first glance, you might think that the following property definition is pointless because it would prevent clients
from accessing any back-end server:

```config
Glacier2.Filter.Address.Reject=*
```

In reality, this configuration only prevents clients from accessing servers using direct proxies, that is, proxies that
contain endpoints. As a result, the property causes Glacier2 to accept only
[indirect proxies](../../../basics/terminology).

{% callout type="note" %}

By default, a Glacier2 router forwards requests for any address.

{% /callout %}

### Category Filters

The [Ice::Identity](../../../runtime/object-identity) type contains two string members: category and name. You can
configure a router with a list of accepted identity categories, in which case the category filter accepts requests for
objects in those categories. The configuration property
[Glacier2.Filter.Category.Accept](../../../property-reference/glacier2-properties) supplies the category list:

```config
Glacier2.Filter.Category.Accept=cat1 cat2
```

This property does not affect the routing of [callback requests](../callbacks-through-glacier2) from back-end servers to
router clients.

{% callout type="note" %}

By default a Glacier2 router forwards requests for any category.

{% /callout %}

If a category contains spaces, you can enclose the value in single or double quotes. If a category contains a quote
character, it must be escaped with a leading backslash.

Glacier2 can optionally manipulate the category filter automatically. When you set
[Glacier2.Filter.Category.AcceptUser](../../../property-reference/glacier2-properties) to a value of 1, the router adds
the user name of each session created with `createSession` to the list of accepted categories, unless that user name is
empty. To ensure the uniqueness of your categories, you may prefer setting the property to a value of 2, which causes
the router to prepend an underscore to the user name before adding it to the list.

A session manager can also configure category filters [dynamically](../dynamic-request-filtering-with-glacier2) using
Glacier2's `SessionControl` interface.

### Identity Filters

The ability to filter on identity categories, as described in the previous section, is a convenient way to give clients
access to particular groups of objects. To give clients access to individual objects, you can use the
[Glacier2.Filter.Identity.Accept](../../../property-reference/glacier2-properties) property. The value of this property
is a list of identities, separated by whitespace, and the identity filter accepts requests for these objects.

If an identity contains spaces, you can enclose the value in single or double quotes. If an identity contains a quote
character, it must be escaped with a leading backslash.

Clearly, specifying a static list of identities is only practical for a small set of objects. Furthermore, in many
applications, the complete set of identities cannot be known in advance, such as when objects are created on a
per-session basis and use UUIDs in their identities. For these situations, category-based filtering is generally
sufficient. However, a session manager can also use Glacier2's
[dynamic filtering](../dynamic-request-filtering-with-glacier2) interface, `SessionControl`, to manage the set of valid
identities at run time.

### Adapter Filters

Applications often use [IceGrid](../../icegrid) in their back-end network to simplify server administration and take
advantage of the benefits offered by indirect proxies. Once you have configured Glacier2 with an appropriate
[locator proxy](../icegrid-and-glacier2-integration), clients can use indirect proxies to refer to objects in
IceGrid-managed servers. Indirect proxies come in two forms: one that contains only an identity, and one that contains
an identity and an object adapter identifier. You can use the category and identity filters described in previous
sections to control identity-only proxies, and you can use the property
[Glacier2.Filter.AdapterId.Accept](../../../property-reference/glacier2-properties) to enforce restrictions on indirect
proxies that use an object adapter identifier.

For example, the following property definition allows a client to use the proxy `factory@WidgetAdapter` but not the
proxy `factory@SecretAdapter`:

```config
Glacier2.Filter.AdapterId.Accept=WidgetAdapter
```

If an adapter identifier contains spaces, you can enclose the value in single or double quotes. If an adapter identifier
contains a quote character, it must be escaped with a leading backslash.

A session manager can also configure this filter [dynamically](../dynamic-request-filtering-with-glacier2) using
Glacier2's `SessionControl` interface.

### Proxy Filters

The Glacier2 router maintains an internal routing table that contains an entry for each proxy used by a router client;
the size of the routing table grows in proportion to the number of clients and their proxy usage. Furthermore, the
amount of memory that the routing table consumes is affected by the number of endpoints in each proxy. Glacier2 provides
two properties that you can use to limit the size of the routing table and defend against malicious router clients.

The property [Glacier2.RoutingTable.MaxSize](../../../property-reference/glacier2-properties) specifies the maximum
number of entries allowed in the routing table. If the size of the table exceeds the value of this property, the router
evicts older entries on a least-recently-used basis. (Eviction of proxies from the routing table is transparent to
router clients.) The default size of the routing table is 1000, but you may need to define a different value depending
on the needs of your application. While experimenting with different values, you may find it useful to define the
property [Glacier2.Trace.RoutingTable](../../../property-reference/glacier2-properties) to see a log of the router's
activities with respect to the routing table.

The property [Glacier2.Filter.ProxySizeMax](../../../property-reference/glacier2-properties) sets a limit on the size of
a stringified proxy. The Ice run time places no limits on the size of proxy components such as identities and host
names, but a malicious client could manufacture very large proxies in a denial-of-service attack on a Glacier2 router.
By setting this property to a reasonably small value, you can prevent proxies from consuming excessive memory in the
router process.

### Client Impact

The Glacier2 router immediately terminates a client's session if it attempts to use a proxy that is rejected by an
address filter or exceeds the size limit defined by the property
[Glacier2.Filter.ProxySizeMax](../../../property-reference/glacier2-properties). The Ice run time in the client responds
by raising `ConnectionLostException` to the application.

For category, identity, and adapter identifier filters, the router raises `ObjectNotExistException` if any of the
filters rejects a proxy and none of the filters accepts it.

To obtain more information on the router's reasons for terminating a session or rejecting a request, set the following
property and examine the router's log output:

```config
Glacier2.Client.Trace.Reject=1
```

## Glacier2 Routing Table

The Glacier2 router maintains an internal routing table for each session. The routing table holds every proxy used by
its session. Consequently, the size of the routing table grows in proportion to the number of proxies used by a session.
Furthermore, the amount of memory that all of the routing tables consume grows with the number of active sessions.

The property [Glacier2.RoutingTable.MaxSize](../../../property-reference/glacier2-properties) allows you to specify an
upper limit on the number of entries in the routing table. If the size of the table exceeds the value of this property,
the router evicts older entries on a least-recently-used basis. (Eviction of proxies from the routing table is
transparent to router clients.) The default size of the routing table is 1000, but you may need to define a different
value depending on the needs of your application. While experimenting with different values, you may find it useful to
define the property [Glacier2.Trace.RoutingTable](../../../property-reference/glacier2-properties) to see a log of the
router's activities with respect to the routing table.

The router does not remove entries from a session's routing table except when evicting an old entry to make room for a
new one. In particular, an exception that occurs while routing a request for a proxy does _not_ cause that proxy to be
removed from the routing table. Note however that the routing table is destroyed upon session destruction.

## See Also

- [Glacier2.*](../../../property-reference/glacier2-properties)
- [IceSSL](../../../runtime/ssl-transport)
- [Getting Started with Glacier2](../getting-started-with-glacier2)
- [Callbacks Through Glacier2](../callbacks-through-glacier2)
- [Dynamic Request Filtering with Glacier2](../dynamic-request-filtering-with-glacier2)
- [IceGrid and Glacier2 Integration](../icegrid-and-glacier2-integration)
