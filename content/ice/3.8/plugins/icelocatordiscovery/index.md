---
title: IceLocatorDiscovery
---

## IceLocatorDiscovery Overview

IceLocatorDiscovery discovers an IceGrid [locator](../../runtime/locators) (registry) using UDP multicast. It installs a
locator in the communicator. This locator discovers the IceGrid registry when the application first resolves an indirect
proxy, and forwards locator requests to it.

This lets clients locate an IceGrid deployment without configuring its registry endpoints, including a
[replicated deployment](../../services/icegrid/registry-replication). IceLocatorDiscovery discovers locators;
[IceDiscovery](../icediscovery) provides a location service for objects and object adapters directly.

## Installing IceLocatorDiscovery

Install the plug-in in each communicator that should discover its locator. IceGrid nodes and slave registries can also
use the plug-in to discover the registry.

{% language-section name="mapping" /%}

## Configuring IceLocatorDiscovery

Applications configure IceLocatorDiscovery with properties. Do not set `Ice.Default.Locator` in an application that
installs the plug-in.

A server deployed with IceGrid does not need to install the plug-in: the IceGrid node that starts this server provides
its locator configuration.

### IceLocatorDiscovery Property Overview

The plug-in and the IceGrid registry have the same default multicast address and port, so the plug-in works without any
configuration when the registry keeps these defaults.

The main properties are:

- [IceLocatorDiscovery.InstanceName](../../property-reference/icelocatordiscovery-properties#icelocatordiscovery.instancename)
  selects the IceGrid deployment with this instance name. When this property is unset, the plug-in keeps the instance
  name of the first locator it discovers.
- [IceLocatorDiscovery.Address](../../property-reference/icelocatordiscovery-properties#icelocatordiscovery.address) and
  [IceLocatorDiscovery.Port](../../property-reference/icelocatordiscovery-properties#icelocatordiscovery.port) set the
  multicast address and port of the queries. They must match the registry's
  [IceGrid.Registry.Discovery.Address](../../property-reference/icegrid-properties#icegrid.registry.discovery.address)
  and [IceGrid.Registry.Discovery.Port](../../property-reference/icegrid-properties#icegrid.registry.discovery.port).
- [IceLocatorDiscovery.Interface](../../property-reference/icelocatordiscovery-properties#icelocatordiscovery.interface)
  restricts the queries to one network interface. By default, the plug-in sends its queries on all interfaces.

For example, to use a different multicast address and port:

```config
IceLocatorDiscovery.Address=239.255.0.99
IceLocatorDiscovery.Port=8000
```

See [IceLocatorDiscovery Properties](../../property-reference/icelocatordiscovery-properties) for the complete list.

### Using IceLocatorDiscovery with IceGrid

An IceGrid node or a slave registry can use the plug-in to find the registry, in place of setting `Ice.Default.Locator`.
Load the plug-in in its configuration file, and set
[IceLocatorDiscovery.InstanceName](../../property-reference/icelocatordiscovery-properties#icelocatordiscovery.instancename)
to the instance name of the deployment:

```config
Ice.Plugin.IceLocatorDiscovery=IceLocatorDiscovery:createIceLocatorDiscovery
IceLocatorDiscovery.InstanceName=IceGrid
```

The master registry does not need the plug-in. IceGrid registries answer multicast discovery queries unless you set
[IceGrid.Registry.Discovery.Enabled](../../property-reference/icegrid-properties#icegrid.registry.discovery.enabled) to
`0`. If you change the multicast address or port of the plug-in, set the same values in each registry with
[IceGrid.Registry.Discovery.Address](../../property-reference/icegrid-properties#icegrid.registry.discovery.address) and
[IceGrid.Registry.Discovery.Port](../../property-reference/icegrid-properties#icegrid.registry.discovery.port);
[IceGrid.Registry.Discovery.Interface](../../property-reference/icegrid-properties#icegrid.registry.discovery.interface)
restricts a registry to one network interface.

The [command-line](../../services/icegrid/icegridadmin-command-line-tool) and
[graphical](../../services/icegrid/icegrid-gui-tool) IceGrid administrative tools have multicast discovery built in, so
they don't need the plug-in. They read the same
[IceLocatorDiscovery.*](../../property-reference/icelocatordiscovery-properties) properties as the plug-in.

## See Also

- [IceLocatorDiscovery Properties](../../property-reference/icelocatordiscovery-properties)
- [Registry Replication](../../services/icegrid/registry-replication)
- [Plug-in Facility](../plug-in-facility)
