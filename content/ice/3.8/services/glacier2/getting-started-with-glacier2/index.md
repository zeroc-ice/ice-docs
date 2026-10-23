---
title: Getting Started with Glacier2
---

<!-- cspell:ignore Aztd Ftgw Xlvb -->

## Using Glacier2

Using Glacier2 in a minimal configuration involves the following tasks:

1. Write a [configuration file](#configuring-the-router) for the router.
2. Write a [password file](#writing-a-password-file) for the router. (Glacier2 also supports
   [other ways](../securing-a-glacier2-router) to authenticate users.)
3. [Start the router](#starting-the-router) on a host with access to the public and private networks.
4. Modify the [client configuration](#configuring-a-glacier2-client) to use the router.
5. Modify the client to create a [router session](#glacier2-sessions).

{% callout type="note" %}

For the sake of example, the router's public address is 5.6.7.8 and its private address is 10.0.0.1.

{% /callout %}

{% language-section name="greeter-demo" /%}

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

The simplest way for the router to authenticate clients is a password file. The property
[Glacier2.CryptPasswords](../../../property-reference/glacier2-properties#glacier2.cryptpasswords) specifies the name of
this file:

```config
Glacier2.CryptPasswords=passwords
```

Each non-blank line contains exactly two whitespace-separated fields, a user name and a password hash, and each user
name appears only once. The [`icehashpassword`](#icehashpassword-helper-script) helper script generates the hash in one
of the [formats the router accepts](../securing-a-glacier2-router#supported-hash-formats).

For example, the following password file contains an entry for the user name `test` on Linux:

```text
test $6$rounds=656000$PFLqAztdBNhCjPeZ$GeZ3rLbMu4FObT78zAqQ15qJu0M/DSAZVBoNJCm95AaTflH.c06IcgFNbm8fOnl1ynGcEBqa.Ftgw3lJ0jPRm0
```

The same entry on Windows and macOS:

```text
test $pbkdf2-sha256$29000$O4dQinGOcY7RWktJyXlvbQ$D0BZnA1kTw4Jl4xGUzdMOSxKO/vODiMCHEE9ZRLF4Gg
```

{% callout type="note" %}

This authentication scheme is intended for use in simple applications with a few users. Most applications should install
their own custom [permissions verifier](../securing-a-glacier2-router).

{% /callout %}

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

The [Ice.Default.Router](../../../property-reference/ice-default-properties#ice.default.router) property defines the
router proxy. Its endpoints must match those in `Glacier2.Client.Endpoints`.

## Glacier2 Object Identities

A Glacier2 router hosts a single object, which implements the `Glacier2::Router` interface and has the identity
`Glacier2/router` by default. If an application uses several different routers, as opposed to replicas, give this object
a unique identity in each router by configuring the routers with different values of the
[Glacier2.InstanceName](../../../property-reference/glacier2-properties) property, as shown in the following example:

```config
Glacier2.InstanceName=PublicRouter
```

This property changes the category of the object identity, which becomes `PublicRouter/router`. The client's
configuration must also be changed to reflect the new identity:

```config
Ice.Default.Router=PublicRouter/router:tcp -h 5.6.7.8 -p 4063
```

Glacier2 routers deployed as replicas, for example to gain redundancy or to distribute the message-forwarding load over
several machines, use the same instance name, and their clients use a proxy with the endpoints of all the replicas, such
as:

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
router forwards the requests of a client only after the client creates a session with one of these operations. Both
operations return a null proxy in the configuration described on this page.

The `createSession` operation expects a user name and password. When using the default authentication scheme, the given
user name and password must match an entry in the router's password file in order to successfully create a session.

The `createSessionFromSecureConnection` operation does not require a user name and password because it authenticates the
client using the credentials associated with the client's [SSL connection](../securing-a-glacier2-router) to the router.

To create a session, the client typically creates the router proxy from the communicator and then calls one of the
`create` operations. For example:

{% language-section name="mapping" /%}

### Glacier2 Session Destruction

A Glacier2 session ends when the connection between the client and the router closes or when the client calls
`destroySession` on the router.

A client that creates a new session, for example after losing its connection to the router, must set up its callbacks
again, as described in [Handling Connection Loss](../callbacks-through-glacier2#handling-connection-loss).

The router's [idle check](../../../runtime/connection-management/connection-closure#the-idle-check) detects a client
that disappears without closing its connection: when the router receives nothing on the connection for the idle timeout,
60 seconds by default, it aborts the connection, which ends the session.
[Glacier2.Client.Connection.IdleTimeout](../../../property-reference/glacier2-properties#glacier2.client.adapterproperty)
sets this timeout.

The router does not close an inactive client connection: it disables its
[inactivity check](../../../runtime/connection-management/connection-closure#the-inactivity-check) on these connections
unless you set `Glacier2.Client.Connection.InactivityTimeout`. The client's own inactivity check closes a connection it
has not used for 300 seconds by default, and this closure ends the session. A client that wishes to keep an unused
session open can set
[Ice.Connection.Client.InactivityTimeout](../../../property-reference/ice-connection-properties#ice.connection.name.inactivitytimeout)
to `0`.

## See Also

- [Callbacks Through Glacier2](../callbacks-through-glacier2)
- [Securing a Glacier2 Router](../securing-a-glacier2-router)
- [Glacier2 Session Management](../glacier2-session-management)
- [Glacier2.*](../../../property-reference/glacier2-properties)
- [Windows Services](../../../background-servers/windows-services)
