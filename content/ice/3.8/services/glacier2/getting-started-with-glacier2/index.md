---
title: Getting Started with Glacier2
---

<!-- cspell:ignore Aztd Ftgw Xlvb -->

## Using Glacier2

Using Glacier2 in a minimal configuration involves the following tasks:

1. Write a [configuration file](#configuring-the-router) for the router.
2. Write a [password file](#writing-a-password-file) for the router. (Glacier2 also supports
   [other ways](../securing-a-glacier2-router) to authenticate users.)
3. Decide whether to use the router's internal session manager, or supply your own
   [session manager](../glacier2-session-management).
4. [Start the router](#starting-the-router) on a host with access to the public and private networks.
5. Modify the [client configuration](#configuring-a-glacier2-client) to use the router.
6. Modify the client to create a [router session](#glacier2-sessions).

{% callout type="note" %}

For the sake of example, the router's public address is 5.6.7.8 and its private address is 10.0.0.1.

{% /callout %}

## Configuring the Router

The following router configuration property establish the necessary endpoint:

```config
Glacier2.Client.Endpoints=tcp -h 5.6.7.8 -p 4063
```

The endpoint defined by [Glacier2.Client.Endpoints](../../../property-reference/glacier2-properties) is used by the Ice
runtime in a client to interact directly with the router. It is also the endpoint where requests from routed proxies are
sent. This endpoint is defined on the public network interface because it must be accessible to clients. Furthermore,
the endpoint uses a fixed port because clients may be statically configured with a proxy for this endpoint. The port
numbers 4063 (for TCP) and 4064 (for SSL) are reserved for Glacier2 by the Internet Assigned Numbers Authority (IANA).

{% callout type="note" %}

This sample configuration uses TCP as the endpoint protocol, although in most cases,
[SSL is preferable](../securing-a-glacier2-router).

{% /callout %}

Note that this configuration enables the router to forward requests from clients to servers. Additional configuration is
necessary to support [callbacks](../callbacks-through-glacier2) from servers to clients.

You must also decide which authentication scheme (or schemes) to use. A [file-based](#writing-a-password-file) mechanism
is available, as are [more sophisticated strategies](../securing-a-glacier2-router).

If clients access a [location service](../icegrid-and-glacier2-integration) via the router, additional router
configuration is typically necessary.

## Writing a Password File

The router's simplest authentication mechanism uses an access control list in a text file containing user names and
password hashes. The supported hash formats depend on the platform.

Hashes in the [modular crypt format](https://pythonhosted.org/passlib/modular_crypt_format.html) (`MCF`) have the
structure `$identifier$content`, where `identifier` denotes the hashing scheme and `content` contains the scheme's
parameters and hash.

On Windows and macOS:

- `PBKDF2` using `SHA-1`, `SHA-256`, or `SHA-512` as the digest algorithm.

{% callout type="note" %}

PBKDF2 does not have a standard form in the `MCF` specification. In this case Glacier2 uses the same format as
[passlib](https://pythonhosted.org/passlib/modular_crypt_format.html).

- `$pbkdf2-digest$rounds$salt$checksum` for `SHA-256` and `SHA-512`.
- `$pbkdf2$rounds$salt$checksum` for `SHA-1`.

{% /callout %}

On Linux:

- Any password hash format supported by the system's `crypt` library, including SHA-256 and SHA-512 crypt.

The property [Glacier2.CryptPasswords](../../../property-reference/glacier2-properties) specifies the name of the
password file:

```config
Glacier2.CryptPasswords=passwords
```

Each non-blank line contains exactly two whitespace-separated fields, a user name and a password hash, and each user
name appears only once.

For example, the following password file contains an entry for the user name `test` on Linux:

```text
test $6$rounds=656000$PFLqAztdBNhCjPeZ$GeZ3rLbMu4FObT78zAqQ15qJu0M/DSAZVBoNJCm95AaTflH.c06IcgFNbm8fOnl1ynGcEBqa.Ftgw3lJ0jPRm0
```

The same entry on Windows and macOS:

```text
test $pbkdf2-sha256$29000$O4dQinGOcY7RWktJyXlvbQ$D0BZnA1kTw4Jl4xGUzdMOSxKO/vODiMCHEE9ZRLF4Gg
```

### `icehashpassword` Helper Script

You can use the `icehashpassword` helper script to generate these password hashes. This script requires `Python` and
`pip` to be installed. To install this script run:

```shell
pip install zeroc-icehashpassword
```

`icehashpassword` generates PBKDF2 hashes on Windows and macOS, and crypt hashes on Linux. It reads the password and
prints the hash. On Linux:

```shell
icehashpassword
Password:
$6$rounds=656000$PFLqAztdBNhCjPeZ$GeZ3rLbMu4FObT78zAqQ15qJu0M/DSAZVBoNJCm95AaTflH.c06IcgFNbm8fOnl1ynGcEBqa.Ftgw3lJ0jPRm0
```

On Windows and macOS:

```shell
icehashpassword
Password:
$pbkdf2-sha256$29000$O4dQinGOcY7RWktJyXlvbQ$D0BZnA1kTw4Jl4xGUzdMOSxKO/vODiMCHEE9ZRLF4Gg
```

You may also specify several optional parameters:

- `-d MESSAGE_DIGEST_ALGORITHM, --digest=MESSAGE_DIGEST_ALGORITHM`: `sha1`, `sha256` (the default), or `sha512` on
  Windows and macOS; `sha256` or `sha512` (the default) on Linux.
- `-s SALT_SIZE, --salt=SALT_SIZE` (Windows and macOS only)
- `-r ROUNDS, --rounds=ROUNDS`

For example:

```shell
icehashpassword -r 25000 -d sha256
Password:
...
```

{% callout type="note" %}

This authentication scheme is intended for use in simple applications with a few users. Most applications should install
their own custom [permissions verifier](../securing-a-glacier2-router).

{% /callout %}

## Starting the Router

Assuming our configuration properties are stored in a file named `config`, you can start the router with the following
command:

```shell
glacier2router --Ice.Config=config
```

## Configuring a Glacier2 Client

The following property configures a client to use a Glacier2 router:

```config
Ice.Default.Router=Glacier2/router:tcp -h 5.6.7.8 -p 4063
```

The [Ice.Default.Router](../../../property-reference/ice-default-properties) property defines the router proxy. Its
endpoints must match those in `Glacier2.Client.Endpoints`.

## Glacier2 Object Identities

A Glacier2 router hosts one well-known object. The default identity of this object is `Glacier2/router`, corresponding
to the `Glacier2::Router` interface. If an application requires the use of multiple different (that is, not replicated)
routers, it is a good idea to assign a unique identity to this object by configuring the routers with different values
of the [Glacier2.InstanceName](../../../property-reference/glacier2-properties) property, as shown in the following
example:

```config
Glacier2.InstanceName=PublicRouter
```

This property changes the category of the object identity, which becomes `PublicRouter/router`. The client's
configuration must also be changed to reflect the new identity:

```config
Ice.Default.Router=PublicRouter/router:tcp -h 5.6.7.8 -p 4063
```

One exception to this rule is if you deploy multiple Glacier2 routers as replicas, for example, to gain redundancy or to
distribute the message-forwarding load over a number of machines. In that case, all the routers must use the same
instance name, and the router clients can use proxies with multiple endpoints, such as:

```config
Ice.Default.Router=PublicRouter/router:tcp -h 5.6.7.8 -p 4063:tcp -h 6.10.7.8 -p 4063
```

{% callout type="note" %}

A client can discover a router's proxy at run time using the
[RouterFinder interface](../advanced-glacier2-client-configurations).

{% /callout %}

## Glacier2 Sessions

### Glacier2 Session Creation

Session management is provided by the `Glacier2::Router` interface:

```slice
module Glacier2
{
    exception PermissionDeniedException
    {
        string reason;
    }

    interface Router extends Ice::Router
    {
        Session* createSession(string userId, string password)
            throws PermissionDeniedException, CannotCreateSessionException;

        Session* createSessionFromSecureConnection()
            throws PermissionDeniedException,CannotCreateSessionException;

        idempotent string getCategoryForClient();

        void destroySession()
            throws SessionNotExistException;
    }
}
```

The interface defines two operations for creating sessions: `createSession` and `createSessionFromSecureConnection`. The
router requires each client to create a session using one of these operations; only after the session is created will
the router forward requests on behalf of the client.

The `createSession` operation expects a user name and password and, depending on the
[router's configuration](../glacier2-session-management), returns either a `Session` proxy or nil. When using the
default authentication scheme, the given user name and password must match an entry in the router's password file in
order to successfully create a session.

The `createSessionFromSecureConnection` operation does not require a user name and password because it authenticates the
client using the credentials associated with the client's [SSL connection](../securing-a-glacier2-router) to the router.

To create a session, the client typically creates the router proxy from the communicator and then calls one of the
`create` operations. For example:

{% language-section name="mapping" /%}

If the router is configured with a [session manager](../glacier2-session-management), the `createSession` and
`createSessionFromSecureConnection` operations may return a proxy for an object implementing the `Glacier2::Session`
interface (or an application-specific derived interface). The client receives a null proxy if no session manager is
configured.

A non-null session proxy returned by a `create` operation must be configured with the router that created it because the
session object is only accessible via the router. If the router is configured as the client's default router at the time
`createSession` or `createSessionFromSecureConnection` is invoked, then the session proxy is already properly configured
and nothing else is required. Otherwise, the client must explicitly configure the session proxy with a router using the
`ice_router` proxy method.

### Glacier2 Session Destruction

A Glacier2 session ends when the connection between the client and the router closes or when the client calls
`destroySession` on the router. The server-side application can also end a session by calling `destroy` on the
`SessionControl` object that the router passes to the session manager's `create` operation.

## See Also

- [Callbacks Through Glacier2](../callbacks-through-glacier2)
- [Securing a Glacier2 Router](../securing-a-glacier2-router)
- [Glacier2 Session Management](../glacier2-session-management)
- [Glacier2.*](../../../property-reference/glacier2-properties)
- [Windows Services](../../../background-servers/windows-services)
