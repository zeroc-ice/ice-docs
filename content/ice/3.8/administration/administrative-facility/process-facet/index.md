---
title: The Process Facet
sidebarLabel: Process Facet
---

The `Process` facet lets an activation service, such as an [IceGrid](../../../services/icegrid) node, request a graceful
shutdown of a server.{% iflang langs="cpp,csharp,java,python,swift" %} The server registers a proxy for this facet with
the activation service by calling `setServerProcessProxy` on the [locator registry](../../../runtime/locators), as
described in
[Integrating the Process Facet with an Activation Service](#integrating-the-process-facet-with-an-activation-service).{% /iflang %}

{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}

{% callout type="note" %}

Be aware of the [security considerations](../security-considerations-for-administrative-facets) associated with enabling
the `Process` facet.

{% /callout %}

{% /iflang %}

## The `Process` Interface

The `Process` facet implements the [`Ice::Process`](api:Ice/ProcessPrx) interface:

- `shutdown` requests a graceful shutdown of the program. The activation service may expect the program to terminate
  within a certain period, after which it may terminate the program abruptly.
- `writeMessage` prints a message to the program's standard output (`fd` 1) or standard error (`fd` 2).

{% iflang langs="cpp,csharp,java,python,swift" %}

## Graceful Shutdown

The default `Process` facet calls `shutdown` on the [communicator](../../../runtime/communicator), and the application
uses this as the signal to terminate. Typically a thread, often the main thread, calls `waitForShutdown` on the
communicator, which returns once the communicator is shut down; this thread then cleans up and exits the program.

## Replacing the Process Facet

To shut the program down differently, replace the default `Process` facet with a servant that implements `Ice::Process`.
Set [Ice.Admin.DelayCreation](../../../property-reference/ice-admin-properties#ice.admin.delaycreation) to `1`, so that
the communicator does not create the admin object during initialization:

```config
Ice.Admin.DelayCreation=1
```

Then remove the default facet, add your own, and call `getAdmin` to create the admin object:

{% language-section name="mapping" /%}

A servant must not call `destroy` on its communicator while dispatching a request: `destroy` waits for all outstanding
dispatches to complete, including the one that calls it, so this dispatch deadlocks.

## Integrating the Process Facet with an Activation Service

If [Ice.Admin.ServerId](../../../property-reference/ice-admin-properties#ice.admin.serverid) is set and the communicator
has a default locator, the communicator registers a proxy for the `Process` facet with the locator registry after
creating the admin object, by calling `setServerProcessProxy` with the value of `Ice.Admin.ServerId`. This value must
uniquely identify the process within the locator registry.

[IceGrid](../../../services/icegrid) sets `Ice.Admin.ServerId` and `Ice.Default.Locator` for each server that it
deploys, and sets [Ice.Admin.Endpoints](../../../property-reference/ice-admin-properties) unless the server sets this
property or `Ice.Admin.Enabled`.

{% /iflang %}

## See Also

- [Communicator](../../../runtime/communicator)
- [Versioning](../../../versioning)
- [Security Considerations for Administrative Facets](../security-considerations-for-administrative-facets)
- [Object Adapters](../../../runtime/dispatch)
- [Creating the admin Object](../creating-the-admin-object)
- [Using the admin Object](../using-the-admin-object)
- [Ice.Admin.*](../../../property-reference/ice-admin-properties)
- [IceGrid](../../../services/icegrid)
