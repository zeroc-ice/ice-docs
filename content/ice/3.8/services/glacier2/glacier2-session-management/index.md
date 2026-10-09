---
title: Glacier2 Session Management
---

A Glacier2 router requires a client to [create a session](../getting-started-with-glacier2) and forwards requests on
behalf of the client until its session ends. A Glacier2 session ends when the connection between the client and the
router closes or when the client calls `destroySession` on the router. The server-side application can also end a
session by calling `destroy` on the `SessionControl` object that the router passes to the session manager's `create`
operation.

You can configure a router to use a custom session manager if your application needs to track the router's session
activities. For example, your application may need to acquire resources and initialize the state of back-end services
for each new session, and later reclaim those resources when the session ends.

As with the [authentication facility](../securing-a-glacier2-router), Glacier2 provides two session manager interfaces
that an application can implement. The `SessionManager` interface receives notifications about sessions that use
password authentication, while the `SSLSessionManager` interface is for sessions authenticated using SSL certificates.

## Glacier2 Session Manager Interfaces

The relevant Slice definitions are shown below:

```slice
module Glacier2
{
    exception CannotCreateSessionException
    {
        string reason;
    }

    interface Session
    {
        void destroy();
    }

    interface SessionManager
    {
        Session* create(string userId, SessionControl* control)
            throws CannotCreateSessionException;
    }

    interface SSLSessionManager
    {
        Session* create(SSLInfo info, SessionControl* control)
            throws CannotCreateSessionException;
    }
}
```

When a client [creates a session](../getting-started-with-glacier2) by invoking `createSession` on the `Router`
interface, the router validates the client's user name and password and then calls `SessionManager::create`. Similarly,
a call to `createSessionFromSecureConnection` causes the router to invoke `SSLSessionManager::create`. The
[SSLInfo](../securing-a-glacier2-router) structure provides details about the client's SSL connection. The second
argument to the `create` operations is a proxy for a `SessionControl` object, which a session can use to perform
[dynamic filtering](../dynamic-request-filtering-with-glacier2).

The `create` operations must return the proxy of a new `Session` object, or raise `CannotCreateSessionException` and
provide an appropriate reason. The `Session` proxy returned by `create` is ultimately returned to the client as the
result of `createSession` or `createSessionFromSecureConnection`.

Glacier2 invokes the `destroy` operation on a `Session` proxy when the session ends, giving a custom session manager the
opportunity to reclaim resources that were acquired for the session during `create`.

{% callout type="note" %}

Glacier2 does not limit a user to one session: the same user can have several sessions at the same time, for example
when a client reconnects before the router has detected the loss of its previous connection. A session manager must
therefore handle a `create` call for a user who already has a session.

{% /callout %}

To configure the router with a custom session manager, define the properties
[Glacier2.SessionManager](../../../property-reference/glacier2-properties) or
[Glacier2.SSLSessionManager](../../../property-reference/glacier2-properties) with the proxies of the session manager
objects. If necessary, you can configure a router with proxies for both types of session managers. If a session manager
proxy is not supplied, the call to `createSession` or `createSessionFromSecureConnection` always returns a null proxy.

The router attempts to contact the configured session manager at startup. If the object is unreachable, the router logs
a warning message but continues its normal operation. The router does not contact the session manager again until it
needs to invoke an operation on the object. For example, when a client asks the router to create a new session, the
router makes another attempt to contact the session manager; if the session manager is still unavailable, the router
returns `CannotCreateSessionException` to the client.

## Connection Caching for Session Managers

You can distribute the load among multiple session manager objects by configuring the router with a session manager
proxy that contains multiple endpoints. Glacier2 disables
[connection caching](../../../runtime/connection-management/connection-establishment) on this proxy so that each
invocation on a session manager attempts to use a different endpoint.

This behavior achieves a basic form of load balancing without depending on the
[replication](../../icegrid/object-adapter-replication) features provided by IceGrid. Be aware that including an invalid
endpoint in your session manager proxy, such as the endpoint of a session manager server that is not currently running,
can cause router clients to experience delays during session creation.

If your session managers are in an IceGrid replica group, refer to
[IceGrid and Glacier2 Integration](../icegrid-and-glacier2-integration) for more information on the router's caching
behavior.

## See Also

- [Getting Started with Glacier2](../getting-started-with-glacier2)
- [Securing a Glacier2 Router](../securing-a-glacier2-router)
- [Dynamic Request Filtering with Glacier2](../dynamic-request-filtering-with-glacier2)
- [IceGrid and Glacier2 Integration](../icegrid-and-glacier2-integration)
- [Object Adapter Replication](../../icegrid/object-adapter-replication)
- [Glacier2.*](../../../property-reference/glacier2-properties)
