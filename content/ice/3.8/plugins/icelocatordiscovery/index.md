---
title: IceLocatorDiscovery
---

## IceLocatorDiscovery Overview

IceLocatorDiscovery discovers an IceGrid or custom [locator](../locators) using UDP multicast. It installs a forwarding
locator in the communicator. When an application needs to resolve an indirect proxy and has no usable locator, the
plug-in sends discovery queries and forwards locator requests to a discovered locator. Application requests then use the
endpoints returned by that locator.

This lets clients locate an IceGrid deployment without configuring its registry endpoints, including a
[replicated deployment](../registry-replication). IceLocatorDiscovery discovers locators;
[IceDiscovery](../icediscovery) provides a location service for objects and object adapters directly.

## Installing IceLocatorDiscovery

Install the plug-in in each communicator that should discover its locator. IceGrid nodes and slave registries can also
use the plug-in to discover the registry.

{% language-section name="lang-1" /%}

## Configuring IceLocatorDiscovery

Applications configure IceLocatorDiscovery through the properties described below.

### IceLocatorDiscovery Property Overview

The plug-in uses a multicast lookup endpoint to send queries and a reply endpoint to receive locator responses.

[IceLocatorDiscovery.Address](../icelocatordiscovery-properties#icelocatordiscovery.address) selects the multicast
address. When unset, it uses `239.255.0.1` if `Ice.IPv4` is enabled and `Ice.PreferIPv6Address` is disabled; otherwise
it uses `ff15::1`. [IceLocatorDiscovery.Port](../icelocatordiscovery-properties#icelocatordiscovery.port) defaults to
`4061`.

[IceLocatorDiscovery.Interface](../icelocatordiscovery-properties#icelocatordiscovery.interface) selects a network
interface. When unset, the plug-in sends queries on the available interfaces for the selected IP version. It builds one
lookup endpoint per selected interface, each with `udp -h address -p port --interface interface`.

The `IceLocatorDiscovery.Reply` object adapter receives responses at `udp -h "*"`, or at `udp -h "interface"` when you
select an interface. Ice chooses its port. The `IceLocatorDiscovery.Locator` object adapter hosts the forwarding locator
and uses collocated calls by default.

For example, to use multicast address `239.255.0.99`, port `8000`, and local interface `192.0.2.10`:

```config
IceLocatorDiscovery.Address=239.255.0.99
IceLocatorDiscovery.Port=8000
IceLocatorDiscovery.Interface=192.0.2.10
```

Replace the interface address with one belonging to the local host. You can override the generated endpoints with
[IceLocatorDiscovery.Lookup](../icelocatordiscovery-properties#icelocatordiscovery.lookup) and
`IceLocatorDiscovery.Reply.Endpoints`. The lookup multicast address and port must match the registry's
[IceGrid.Registry.Discovery.Endpoints](../icegrid-properties#icegrid.registry.discovery.adapterproperty).

Set [IceLocatorDiscovery.InstanceName](../icelocatordiscovery-properties#icelocatordiscovery.instancename) to the
registry's `IceGrid.InstanceName` to select a deployment. Without this setting, ordinary locator requests use the
instance name of the first locator discovered and subsequent lookups stay with that instance.

A lookup waits [300 milliseconds](../icelocatordiscovery-properties#icelocatordiscovery.timeout) by default and retries
up to [three times](../icelocatordiscovery-properties#icelocatordiscovery.retrycount) without a response. After
exhausting these attempts, the plug-in suppresses further discovery for
[2000 milliseconds](../icelocatordiscovery-properties#icelocatordiscovery.retrydelay). A later locator request starts a
new discovery round after this delay. Use
[IceLocatorDiscovery.Trace.Lookup](../icelocatordiscovery-properties#icelocatordiscovery.trace.lookup) to trace lookups.

### Configuring IceLocatorDiscovery in User Applications

For a client application, install the plug-in and configure its multicast settings and instance name as needed.
`Ice.Default.Locator` is optional: when configured, the plug-in uses this locator first. Otherwise it discovers a
locator when the application first needs one. It reuses the locator and can discover another when communication with it
fails.

For a server deployed with IceGrid, you normally don't need to install the IceLocatorDiscovery plug-in.

### Configuring IceLocatorDiscovery in IceGrid Administrative Clients

Support for multicast discovery is built into the [command-line](../icegridadmin-command-line-tool) and
[graphical](../icegrid-gui-tool) IceGrid administrative utilities, therefore you don't need to install the plug-in. Both
utilities read the same [IceLocatorDiscovery.*](../icelocatordiscovery-properties) properties as the plug-in, for
example to change the multicast address and port.

### Configuring IceLocatorDiscovery in an IceGrid Registry

A slave registry can use the plug-in to locate the master without configuring the master's endpoints. Install it as for
a C++ client, and set `IceLocatorDiscovery.InstanceName` to the deployment's `IceGrid.InstanceName`. A master registry
provides the discovery responder itself and does not need the client plug-in.

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

An IceGrid node can use the plug-in to locate its registry without configuring the registry's endpoints. Install it as
for a C++ client, and set `IceLocatorDiscovery.InstanceName` to the registry's `IceGrid.InstanceName`. This setting also
allows the node to determine the IceGrid instance name during startup.

## Discovering Custom Locators

A custom locator needs a multicast responder implementing the Slice interface `IceLocatorDiscovery::Lookup`. Register
this responder with identity `IceLocatorDiscovery/Lookup` on the multicast endpoint used by the clients. Its
`findLocator(instanceName, reply)` operation checks the requested instance name and invokes `foundLocator` on the reply
proxy with the locator's proxy. An empty requested instance name matches any instance.

Use the locator identity's category as its instance name. Replicas of the same locator should use the same identity.
IceGrid registries provide this responder automatically.

{% iflang langs="java" %}

## Discovering Locators Programmatically

Java exposes `com.zeroc.IceLocatorDiscovery.Plugin.getLocators`. For example:

```java
var plugin = (com.zeroc.IceLocatorDiscovery.Plugin)
    communicator.getPluginManager().getPlugin("IceLocatorDiscovery");
java.util.List<com.zeroc.Ice.LocatorPrx> locators = plugin.getLocators("", 300);
```

With an empty first argument, this call starts discovery, waits 300 milliseconds, and returns the locator proxies
collected during that time. The result can be empty. Replies from replicas of one instance contribute endpoints to a
single proxy. The plug-in's configured or previously adopted instance name still limits which replies it accepts.

A nonempty first argument makes the call wait for that instance or for the lookup round to finish. It does not change
the instance-name filter sent in multicast queries; use `IceLocatorDiscovery.InstanceName` to configure that filter.

{% /iflang %}

## See Also

- [IceLocatorDiscovery Properties](../icelocatordiscovery-properties)
- [Registry Replication](../registry-replication)
- [Plug-in Facility](../plug-in-facility)
