---
title: IceLocatorDiscovery.*
---

This page describes the properties supported by the IceLocatorDiscovery plug-in.

These properties configure the C++, C# and Java plug-ins, and the C++ plug-in loaded through `Ice.Plugin.*` in the
C++-based language mappings. JavaScript does not support this plug-in.

## IceLocatorDiscovery.Address

### Synopsis {% id="icelocatordiscovery.address-synopsis" %}

`IceLocatorDiscovery.Address=addr`

### Description {% id="icelocatordiscovery.address-description" %}

Specifies the multicast IP address to use for sending [multicast discovery queries](../icelocatordiscovery). If not
defined, the default value depends on other property settings:

- If [Ice.PreferIPv6Address](../ice-properties) is enabled or [Ice.IPv4](../ice-properties) is disabled,
  IceLocatorDiscovery uses the IPv6 address `ff15::1`
- Otherwise IceLocatorDiscovery uses `239.255.0.1`

This property is used to compose the value of
[IceLocatorDiscovery.Lookup](../icelocatordiscovery-properties#icelocatordiscovery.lookup).

## IceLocatorDiscovery.InstanceName

### Synopsis {% id="icelocatordiscovery.instancename-synopsis" %}

`IceLocatorDiscovery.InstanceName=name`

### Description {% id="icelocatordiscovery.instancename-description" %}

Specifies the name of a locator instance. If you have multiple unrelated locators deployed that use the same multicast
address and port, you can define this property to limit your discovery results only to those locators deployed for the
given instance. If not defined, the plug-in adopts the instance name of the first locator to respond to a query; if a
subsequent query discovers a locator with a different instance name, the plug-in ignores the result. It traces the
mismatch when `IceLocatorDiscovery.Trace.Lookup` is 3 or greater.

The instance name is the category of the discovered locator's identity. The plug-in also uses the configured name as the
identity category of its own locator object, or a UUID if this property is not set.

## IceLocatorDiscovery.Interface

### Synopsis {% id="icelocatordiscovery.interface-synopsis" %}

`IceLocatorDiscovery.Interface=intf`

### Description {% id="icelocatordiscovery.interface-description" %}

Specifies the IP address of the interface to use for sending [multicast discovery queries](../icelocatordiscovery). If
not defined, the discovery will use all the network interfaces available on the system to send UDP multicast datagrams.
This property is used to compose the value of
[IceLocatorDiscovery.Lookup](../icelocatordiscovery-properties#icelocatordiscovery.lookup) and
[IceLocatorDiscovery.Reply.Endpoints](../icelocatordiscovery-properties#icelocatordiscovery.reply.adapterproperty).

## IceLocatorDiscovery.Locator._AdapterProperty_

### Synopsis {% id="icelocatordiscovery.locator.adapterproperty-synopsis" %}

`IceLocatorDiscovery.Locator.AdapterProperty=value`

### Description {% id="icelocatordiscovery.locator.adapterproperty-description" %}

IceLocatorDiscovery creates an object adapter named `IceLocatorDiscovery.Locator`, therefore all of the
[object adapter properties](../object-adapter-properties) can be set.

You don't normally need to set properties for this object adapter.

## IceLocatorDiscovery.Lookup

### Synopsis {% id="icelocatordiscovery.lookup-synopsis" %}

`IceLocatorDiscovery.Lookup=endpoints`

### Description {% id="icelocatordiscovery.lookup-description" %}

Specifies the multicast endpoints used to send [discovery queries](../icelocatordiscovery). The plug-in sends each query
on every endpoint in this list.

When this property is not set, the plug-in creates one endpoint per multicast-capable interface selected by
[IceLocatorDiscovery.Interface](../icelocatordiscovery-properties#icelocatordiscovery.interface), or per available
multicast-capable interface if that property is not set. It joins these endpoints with colons. Each endpoint has the
form:

`udp -h "addr" -p port --interface "intf"`

Here, `addr` is the value of
[IceLocatorDiscovery.Address](../icelocatordiscovery-properties#icelocatordiscovery.address), `port` is the value of
[IceLocatorDiscovery.Port](../icelocatordiscovery-properties#icelocatordiscovery.port), and `intf` identifies the
interface.

## IceLocatorDiscovery.Port

### Synopsis {% id="icelocatordiscovery.port-synopsis" %}

`IceLocatorDiscovery.Port=port`

### Description {% id="icelocatordiscovery.port-description" %}

Specifies the multicast port to use for sending multicast queries. If not set, the default value is `4061`.

## IceLocatorDiscovery.Reply._AdapterProperty_

### Synopsis {% id="icelocatordiscovery.reply.adapterproperty-synopsis" %}

`IceLocatorDiscovery.Reply.AdapterProperty=value`

### Description {% id="icelocatordiscovery.reply.adapterproperty-description" %}

IceLocatorDiscovery creates an object adapter named `IceLocatorDiscovery.Reply` for receiving replies to
[multicast discovery queries](../icelocatordiscovery). If not otherwise defined by
`IceLocatorDiscovery.Reply.Endpoints`, the endpoint for this object adapter is composed as follows:

`udp [-h intf]`

where `intf` is the value of
[IceLocatorDiscovery.Interface](../icelocatordiscovery-properties#icelocatordiscovery.interface). A fixed port is not
necessary for this endpoint.

You don't normally need to set [other properties](../object-adapter-properties) for this object adapter.

## IceLocatorDiscovery.RetryCount

### Synopsis {% id="icelocatordiscovery.retrycount-synopsis" %}

`IceLocatorDiscovery.RetryCount=num`

### Description {% id="icelocatordiscovery.retrycount-description" %}

Specifies the maximum number of times that the plug-in will retry sending UDP multicast queries before giving up. The
[IceLocatorDiscovery.Timeout](../icelocatordiscovery-properties#icelocatordiscovery.timeout) property determines how
long the plug-in waits for a reply before trying again. If not defined, the default retry count is `3`, for a total of
four attempts. A value of 0 sends only the initial query.

## IceLocatorDiscovery.RetryDelay

### Synopsis {% id="icelocatordiscovery.retrydelay-synopsis" %}

`IceLocatorDiscovery.RetryDelay=num`

### Description {% id="icelocatordiscovery.retrydelay-description" %}

If the plug-in fails to receive any responses to a query after retrying the number of times specified by
[IceLocatorDiscovery.RetryCount](../icelocatordiscovery-properties#icelocatordiscovery.retrycount), the plug-in waits at
least `num` milliseconds before starting another round of query attempts. If not defined, the default value is `2000`.

## IceLocatorDiscovery.Trace.Lookup

### Synopsis {% id="icelocatordiscovery.trace.lookup-synopsis" %}

`IceLocatorDiscovery.Trace.Lookup=num`

### Description {% id="icelocatordiscovery.trace.lookup-description" %}

Controls lookup tracing in the `Lookup` trace category:

| Value | Description                                                                   |
| ----- | ----------------------------------------------------------------------------- |
| 0     | No lookup trace (default).                                                    |
| 1     | Trace lookup success, failure and timeout.                                    |
| 2     | Like 1, and trace lookup invocations.                                         |
| 3     | Like 2, and trace replies ignored because their instance name does not match. |

## IceLocatorDiscovery.Timeout

### Synopsis {% id="icelocatordiscovery.timeout-synopsis" %}

`IceLocatorDiscovery.Timeout=num`

### Description {% id="icelocatordiscovery.timeout-description" %}

Specifies the time interval in milliseconds to wait for replies to UDP multicast queries. If no server replies during
this time interval, the client will retry the request the number of times specified by
[IceLocatorDiscovery.RetryCount](../icelocatordiscovery-properties#icelocatordiscovery.retrycount). If not defined, the
default timeout is `300`. `num` must be greater than `0`.
