---
title: IceLocatorDiscovery
---

## IceLocatorDiscovery Overview

IceLocatorDiscovery is an [Ice plug-in](../plug-in-facility) that discovers IceGrid and custom [locators](../locators)
on a network using UDP multicast. Once installed, the plug-in automatically and transparently issues a multicast query
in an attempt to find one or more locators, collects the responses, and configures the Ice runtime accordingly. The
primary advantage of using IceLocatorDiscovery is that it eliminates the need to manually configure and maintain the
`Ice.Default.Locator` property. It's even more helpful in a [replicated IceGrid deployment](../registry-replication)
consisting of a master replica and one or more slave replicas, where the `Ice.Default.Locator` property would normally
include endpoints for some or all of the replicas. Avoiding the need to configure the locator endpoints relieves some of
the administrative burden, simplifies deployment and configuration tasks, and adds more flexibility to your application
designs.

{% callout type="info" %}

You can think of IceLocatorDiscovery as an application-specific version of [IceDiscovery](../icediscovery) geared
primarily toward IceGrid users.

{% /callout %}

## Installing IceLocatorDiscovery

The IceLocatorDiscovery plug-in must be installed in every client that needs to locate objects; you can optionally
install it in IceGrid nodes and registry replicas.

{% language-section name="lang-1" /%}

## Configuring IceLocatorDiscovery

Applications configure the IceLocatorDiscovery plug-in using configuration properties; the plug-in does not provide a
local API.

### IceLocatorDiscovery Property Overview

The IceDiscovery plug-in supports a number of [configuration properties](../icelocatordiscovery-properties), many of
which affect the endpoints that the plug-in uses for its queries:

- Lookup endpoint This is the multicast endpoint on which all lookup queries are broadcast. It must use an IPv4 or IPv6
  address in the multicast range with a fixed port.

- Reply endpoint This is the endpoint on which the plug-in receives replies from locators (an IceGrid registry is the
  most common example of a locator). In general, this endpoint should not use a fixed port.

The plug-in uses sensible default values for all of its configuration properties, such that it's often unnecessary to
define any of the plug-in's properties. However, it's still important to understand how the plug-in derives its endpoint
information.

First, you can override the default endpoint that the plug-in uses to broadcast its queries by defining
[IceLocatorDiscovery.Lookup](../icelocatordiscovery-properties), otherwise the plug-in computes one endpoint for each
multicast-capable interface, as follows:

`udp -h "address" -p port --interface "interface"`

where

- `address` is the value of [IceLocatorDiscovery.Address](../icelocatordiscovery-properties) - defaults to `239.255.0.1`
  if IPv4 is enabled or `ff15::1` if IPv4 is disabled
- `port` is the value of [IceLocatorDiscovery.Port](../icelocatordiscovery-properties) - defaults to `4061`
- `interface` is the value of [IceLocatorDiscovery.Interface](../icelocatordiscovery-properties), or each available
  multicast-capable interface when that property is not set

{% callout type="warning" %}

For IceGrid users, the lookup endpoint must use the same multicast address and port as
[IceGrid.Registry.Discovery.Endpoints](../object-adapter-endpoints) in the registry configuration.

{% /callout %}

IceLocatorDiscovery also creates object adapters in each communicator in which it's installed, including the object
adapter [IceLocatorDiscovery.Reply](../icelocatordiscovery-properties). This object adapter corresponds to the Reply
endpoint mentioned above.

As you can see, the properties `IceLocatorDiscovery.Address`, `IceLocatorDiscovery.Port` and
`IceLocatorDiscovery.Interface` are simply used as convenient shortcuts for customizing the details of the plug-in's
endpoints. For example, suppose we want to use a different multicast address and port:

```config
IceLocatorDiscovery.Address=239.255.0.99
IceLocatorDiscovery.Port=8000
```

With these settings, the plug-in sends its lookup queries to `239.255.0.99` port `8000` on each multicast-capable
interface.

{% callout type="warning" %}

All of the components of an IceGrid application must use the same multicast address and port. You should also consider
defining [IceLocatorDiscovery.InstanceName](../icelocatordiscovery-properties) to avoid any potential collisions from
unrelated IceGrid applications that happen to use the same address and port.

{% /callout %}

### Configuring IceLocatorDiscovery in User Applications

For a client application, remove any existing definition of `Ice.Default.Locator`, then install the plug-in and
optionally configuring its addressing information.

For a server deployed with IceGrid, you normally don't need to install the IceLocatorDiscovery plug-in.

### Configuring IceLocatorDiscovery in IceGrid Administrative Clients

Support for multicast discovery is built into the [command-line](../icegridadmin-command-line-tool) and
[graphical](../icegrid-gui-tool) IceGrid administrative utilities, therefore you don't need to install the plug-in. Both
utilities read the same [IceLocatorDiscovery.*](../icelocatordiscovery-properties) properties as the plug-in, for
example to change the multicast address and port.

### Configuring IceLocatorDiscovery in an IceGrid Registry

An IceGrid registry does not need the plug-in if it's the master replica or the only registry in a deployment, although
there's no harm in installing it. The plug-in is useful for slave replicas because it allows them to locate the current
master without configuring the master's endpoints. Install and configure the plug-in for slave replicas just like you
would for any C++ client.

IceGrid registries listen for multicast discovery queries by default, but you can disable this feature by setting
[IceGrid.Registry.Discovery.Enabled](../icegrid-properties) to `0`.

If you've changed the default multicast address or port for IceLocatorDiscovery, you must also make corresponding
changes to the configuration of each registry. The registry supports properties similar to those of IceLocatorDiscovery:

- [IceGrid.Registry.Discovery.Address](../icegrid-properties)
- [IceGrid.Registry.Discovery.Port](../icegrid-properties)
- [IceGrid.Registry.Discovery.Interface](../icegrid-properties)

These properties influence the endpoint on which the registry listens for multicast discovery queries. If you don't
override the endpoint by setting [IceGrid.Registry.Discovery.Endpoints](../icegrid-properties), the registry uses these
properties to compute its endpoint as follows:

`IceGrid.Registry.Discovery.Endpoints=udp -h address -p port [--interface interface]`

{% callout type="warning" %}

You don't need to define any `IceGrid.Registry.Discovery.*` properties if you want the registry to listen for discovery
queries on its default multicast address and port.

{% /callout %}

### Configuring IceLocatorDiscovery in an IceGrid Node

The plug-in is useful for IceGrid nodes because it allows them to locate the registry without configuring the registry's
endpoints. Install and configure the plug-in in a node just like you would for any C++ client.

## See Also

- [IceLocatorDiscovery Properties](../icelocatordiscovery-properties)
- [Registry Replication](../registry-replication)
- [Plug-in Facility](../plug-in-facility)
