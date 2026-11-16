---
title: The Process Facet
sidebarLabel: Process Facet
---

The `Process` facet lets a location service, such as [IceGrid](../../../services/icegrid), request a graceful shutdown
of a server.{% iflang langs="cpp,csharp,java,python,swift" %} The communicator can register a proxy for this facet with
the location service, as described in
[Registering the Process Facet with the Location Service](#registering-the-process-facet-with-the-location-service).{% /iflang %}

{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}

{% callout type="note" %}

Be aware of the [security considerations](../security-considerations-for-administrative-facets) associated with enabling
the `Process` facet.

{% /callout %}

{% /iflang %}

## The `Process` Interface

The `Process` facet implements the [`Ice::Process`](api:Ice/ProcessPrx) interface:

- `shutdown` initiates a graceful shutdown of the program, which can take some time to complete. An IceGrid node that
  calls `shutdown`
  [terminates the server](../../../services/icegrid/icegrid-and-the-administrative-facility#deactivating-a-deployed-server)
  when the shutdown takes too long.
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

## Registering the Process Facet with the Location Service

If [Ice.Admin.ServerId](../../../property-reference/ice-admin-properties#ice.admin.serverid) is set and the communicator
has a default locator, the communicator registers a proxy for the `Process` facet with the locator registry after
creating the admin object, by calling `setServerProcessProxy` with the value of `Ice.Admin.ServerId`.

With [IceGrid](../../../services/icegrid), this value is the ID of the server in its deployment: IceGrid sets
`Ice.Admin.ServerId` and `Ice.Default.Locator` for each server that it deploys. When the descriptor of the server
defines neither [Ice.Admin.Endpoints](../../../property-reference/ice-admin-properties) nor `Ice.Admin.Enabled`, IceGrid
also sets `Ice.Admin.Endpoints` to `tcp -h 127.0.0.1`.

{% /iflang %}

## See Also

- [Communicator](../../../runtime/communicator)
- [Securing the admin Object](../security-considerations-for-administrative-facets)
- [Creating the admin Object](../creating-the-admin-object)
- [Using the admin Object](../using-the-admin-object)
- [Ice.Admin.*](../../../property-reference/ice-admin-properties)
- [IceGrid](../../../services/icegrid)
