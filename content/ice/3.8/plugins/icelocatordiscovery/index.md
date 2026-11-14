---
title: IceLocatorDiscovery
---

## IceLocatorDiscovery Overview

IceLocatorDiscovery is an Ice plug-in that discovers a [locator](../../runtime/locators) on the local network with UDP
multicast. An application that installs it resolves its indirect proxies through the discovered locator, without setting
`Ice.Default.Locator`.

IceGrid registries answer the plug-in's queries, so an application can use the plug-in to find an IceGrid deployment,
including a [replicated deployment](../../services/icegrid/registry-replication).

IceLocatorDiscovery relies on a location service, such as IceGrid, that runs on your network. The
[IceDiscovery](../icediscovery) plug-in provides a location service with no additional process to run.

## Installing IceLocatorDiscovery

Install the plug-in in each communicator that discovers its default locator.

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

### IceGrid Registries and Administrative Tools

IceGrid registries answer multicast discovery queries unless you set
[IceGrid.Registry.Discovery.Enabled](../../property-reference/icegrid-properties#icegrid.registry.discovery.enabled) to
`0`, and
[IceGrid.Registry.Discovery.Interface](../../property-reference/icegrid-properties#icegrid.registry.discovery.interface)
restricts a registry to one network interface.

The [command-line](../../services/icegrid/icegridadmin-command-line-tool) and
[graphical](../../services/icegrid/icegrid-gui-tool) IceGrid administrative tools discover the registries on the network
and let you choose one. They read `IceLocatorDiscovery.Address`, `IceLocatorDiscovery.Port` and
`IceLocatorDiscovery.Interface` for their multicast settings.

### IceGrid Nodes and Slave Registries

You can also use the plug-in inside an IceGrid deployment, to simplify the configuration of its nodes and slave
registries: a node discovers its registry, and a slave registry discovers the master registry, without
`Ice.Default.Locator`. Install the plug-in in the configuration file of the node or slave registry, and set
[IceLocatorDiscovery.InstanceName](../../property-reference/icelocatordiscovery-properties#icelocatordiscovery.instancename)
to the instance name of the deployment:

```config
Ice.Plugin.IceLocatorDiscovery=IceLocatorDiscovery:createIceLocatorDiscovery
IceLocatorDiscovery.InstanceName=IceGrid
```

## See Also

- [IceLocatorDiscovery Properties](../../property-reference/icelocatordiscovery-properties)
- [Registry Replication](../../services/icegrid/registry-replication)
- [Plug-in Facility](../plug-in-facility)
