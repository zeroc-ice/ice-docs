---
title: The Process Facet
sidebarLabel: Process Facet
---

The `Process` facet lets an activation service, such as an [IceGrid](../../../services/icegrid) node, request a graceful
shutdown of a server.{% iflang langs="cpp,csharp,java,python,swift" %} The communicator can register a proxy for this
facet with the activation service, as described in
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

The default `Process` facet calls `shutdown` on the [communicator](../../../runtime/communicator). This shuts down the
server through a convention that Ice servers follow: the shutdown of the communicator is the signal to exit. The main
thread of the server waits for this shutdown, for example by calling `waitForShutdown`, then cleans up and exits.

## Replacing the Process Facet

To shut the program down differently, replace the default `Process` facet with a servant that implements `Ice::Process`.
Set [Ice.Admin.DelayCreation](../../../property-reference/ice-admin-properties#ice.admin.delaycreation) to `1`, so that
the communicator does not create the admin object during initialization:

```config
Ice.Admin.DelayCreation=1
```

Then remove the default facet, add your own, and call `getAdmin` to create the admin object:

{% language-section name="mapping" /%}

## Integrating the Process Facet with an Activation Service

If [Ice.Admin.ServerId](../../../property-reference/ice-admin-properties#ice.admin.serverid) is set and the communicator
has a default locator, the communicator registers a proxy for the `Process` facet with the locator registry after
creating the admin object, by calling `setServerProcessProxy` with the value of `Ice.Admin.ServerId`. This value must
uniquely identify the process within the locator registry.

[IceGrid](../../../services/icegrid) sets `Ice.Admin.ServerId` and `Ice.Default.Locator` for each server that it
deploys. It also sets [Ice.Admin.Endpoints](../../../property-reference/ice-admin-properties) to `tcp -h 127.0.0.1`,
unless the descriptor of the server defines this property or `Ice.Admin.Enabled`, with any value.

{% /iflang %}

## See Also

- [Communicator](../../../runtime/communicator)
- [Securing the admin Object](../security-considerations-for-administrative-facets)
- [Creating the admin Object](../creating-the-admin-object)
- [Using the admin Object](../using-the-admin-object)
- [Ice.Admin.*](../../../property-reference/ice-admin-properties)
- [IceGrid](../../../services/icegrid)
