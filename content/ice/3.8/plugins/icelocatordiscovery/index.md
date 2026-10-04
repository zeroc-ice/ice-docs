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

### Configuring IceLocatorDiscovery in IceGrid Administrative Clients

Support for multicast discovery is built into the [command-line](../../services/icegrid/icegridadmin-command-line-tool)
and [graphical](../../services/icegrid/icegrid-gui-tool) IceGrid administrative utilities, therefore you don't need to
install the plug-in. Both utilities read the same
[IceLocatorDiscovery.*](../../property-reference/icelocatordiscovery-properties) properties as the plug-in, for example
to change the multicast address and port.

### Configuring IceLocatorDiscovery in an IceGrid Registry

A slave registry can use the plug-in to find the master registry, in place of setting `Ice.Default.Locator`. Load the
plug-in in the slave registry's configuration file:

```config
Ice.Plugin.IceLocatorDiscovery=IceLocatorDiscovery:createIceLocatorDiscovery
```

The master registry does not need the plug-in.

IceGrid registries listen for multicast discovery queries by default, but you can disable this feature by setting
[IceGrid.Registry.Discovery.Enabled](../../property-reference/icegrid-properties) to `0`.

If you've changed the default multicast address or port for IceLocatorDiscovery, you must also make corresponding
changes to the configuration of each registry. The registry supports properties similar to those of IceLocatorDiscovery:

- [IceGrid.Registry.Discovery.Address](../../property-reference/icegrid-properties)
- [IceGrid.Registry.Discovery.Port](../../property-reference/icegrid-properties)
- [IceGrid.Registry.Discovery.Interface](../../property-reference/icegrid-properties)

These properties influence the endpoint on which the registry listens for multicast discovery queries. If you don't
override the endpoint by setting [IceGrid.Registry.Discovery.Endpoints](../../property-reference/icegrid-properties),
the registry uses these properties to compute its endpoint as follows:

`IceGrid.Registry.Discovery.Endpoints=udp -h address -p port [--interface interface]`

{% callout type="warning" %}

You don't need to define any `IceGrid.Registry.Discovery.*` properties if you want the registry to listen for discovery
queries on its default multicast address and port.

{% /callout %}

### Configuring IceLocatorDiscovery in an IceGrid Node

An IceGrid node can use the plug-in to find its registries, in place of setting `Ice.Default.Locator`. Load the plug-in
in the node's configuration file:

```config
Ice.Plugin.IceLocatorDiscovery=IceLocatorDiscovery:createIceLocatorDiscovery
```

## See Also

- [IceLocatorDiscovery Properties](../../property-reference/icelocatordiscovery-properties)
- [Registry Replication](../../services/icegrid/registry-replication)
- [Plug-in Facility](../plug-in-facility)
