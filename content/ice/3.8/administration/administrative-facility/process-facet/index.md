---
title: The Process Facet
---

An activation service, such as an [IceGrid](../../../services/icegrid) node, needs a reliable way to gracefully
deactivate a server. One approach is to use a platform-specific mechanism, such as POSIX signals. This works well on
POSIX platforms when the server is prepared to intercept signals and react appropriately. On Windows platforms, it works
less reliably for C++ servers, and not at all for Java servers. For these reasons, the `Process` facet provides an
alternative that is both portable and reliable.

{% callout type="note" %}

Be aware of the [security considerations](../security-considerations-for-administrative-facets) associated with enabling
the `Process` facet.

{% /callout %}

## The `Process` Interface

The Slice interface `Ice::Process` allows an activation service to request a graceful shutdown of the program:

```slice
module Ice
{
    interface Process
    {
        void shutdown();
        void writeMessage(string message, int fd);
    }
}
```

When `shutdown` is invoked, the object implementing this interface is expected to initiate the termination of its
process. The activation service may expect the program to terminate within a certain period of time, after which it may
terminate the program abruptly.

The `writeMessage` operation allows remote clients to print a message to the program's standard output (`fd` == 1) or
standard error (`fd` == 2) channels.

{% language-section name="mapping" /%}

## Integrating the Process Facet with an Activation Service

If the [Ice.Admin.ServerId](../../../property-reference/ice-admin-properties) and
[Ice.Default.Locator](../../../property-reference/ice-default-properties) properties are defined, the communicator
performs the following steps after creating the admin object:

- Obtains proxies for the `Process` facet and the default locator
- Invokes `getRegistry` on the locator proxy to obtain a proxy for the locator registry
- Invokes `setServerProcessProxy` on the locator registry and supplies the value of `Ice.Admin.ServerId` along with a
  proxy for the `Process` facet

The identifier specified by `Ice.Admin.ServerId` must uniquely identify the process within the locator registry.

In the case of [IceGrid](../../../services/icegrid), IceGrid defines the `Ice.Admin.ServerId` and `Ice.Default.Locator`
properties for each deployed server. IceGrid also supplies a value for
[Ice.Admin.Endpoints](../../../property-reference/ice-admin-properties) if neither this property nor Ice.Admin.Enabled
are defined by the server.

## See Also

- [Communicator](../../../runtime/communicator)
- [Versioning](../../../versioning)
- [Security Considerations for Administrative Facets](../security-considerations-for-administrative-facets)
- [Object Adapters](../../../runtime/dispatch)
- [Creating the admin Object](../creating-the-admin-object)
- [Ice.Admin.*](../../../property-reference/ice-admin-properties)
- [IceGrid](../../../services/icegrid)
