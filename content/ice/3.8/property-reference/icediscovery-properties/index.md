---
title: IceDiscovery.*
---

This page describes the properties supported by the [IceDiscovery](../icediscovery) plug-in.

These properties configure the C++, C# and Java plug-ins, and the C++ plug-in loaded through `Ice.Plugin.*` in the
C++-based language mappings. JavaScript does not support this plug-in.

## IceDiscovery.Address

### Synopsis {% id="icediscovery.address-synopsis" %}

`IceDiscovery.Address=addr`

### Description {% id="icediscovery.address-description" %}

Specifies the multicast IP address to use for sending or receiving [multicast discovery queries](../icediscovery). If
not defined, the default value depends on other property settings:

- If [Ice.PreferIPv6Address](../ice-properties) is enabled or [Ice.IPv4](../ice-properties) is disabled, IceDiscovery
  uses the IPv6 address `ff15::1`
- Otherwise IceDiscovery uses `239.255.0.1`

This property is used to compose the value of [IceDiscovery.Lookup](../icediscovery-properties#icediscovery.lookup) and
[IceDiscovery.Multicast.Endpoints](../icediscovery-properties#icediscovery.multicast.adapterproperty).

## IceDiscovery.DomainId

### Synopsis {% id="icediscovery.domainid-synopsis" %}

`IceDiscovery.DomainId=id`

### Description {% id="icediscovery.domainid-description" %}

Specifies the domain ID used to locate objects and object adapters. The IceDiscovery plug-in only responds to requests
from clients with the same domain ID and ignores requests from clients with a different domain ID. If not defined, the
default domain ID is an empty string.

## IceDiscovery.Interface

### Synopsis {% id="icediscovery.interface-synopsis" %}

`IceDiscovery.Interface=intf`

### Description {% id="icediscovery.interface-description" %}

Specifies the IP address of the interface to use for sending or receiving
[multicast discovery queries](../icediscovery). If not defined, the discovery will use all the network interfaces
available on the system to send and receive UDP multicast datagrams. This property is used to compose the value of
[IceDiscovery.Lookup](../icediscovery-properties#icediscovery.lookup),
[IceDiscovery.Reply.Endpoints](../icediscovery-properties#icediscovery.reply.adapterproperty) and
[IceDiscovery.Multicast.Endpoints](../icediscovery-properties#icediscovery.multicast.adapterproperty).

## IceDiscovery.Lookup

### Synopsis {% id="icediscovery.lookup-synopsis" %}

`IceDiscovery.Lookup=endpoints`

### Description {% id="icediscovery.lookup-description" %}

Specifies the multicast endpoints used to send [discovery queries](../icediscovery). The plug-in sends each query on
every endpoint in this list.

When this property is not set, the plug-in creates one endpoint per multicast-capable interface selected by
[IceDiscovery.Interface](../icediscovery-properties#icediscovery.interface), or per available multicast-capable
interface if that property is not set. It joins these endpoints with colons. Each endpoint has the form:

`udp -h "addr" -p port --interface "intf"`

Here, `addr` is the value of [IceDiscovery.Address](../icediscovery-properties#icediscovery.address), `port` is the
value of [IceDiscovery.Port](../icediscovery-properties#icediscovery.port), and `intf` identifies the interface.

## IceDiscovery.Multicast._AdapterProperty_

### Synopsis {% id="icediscovery.multicast.adapterproperty-synopsis" %}

`IceDiscovery.Multicast.AdapterProperty=value`

### Description {% id="icediscovery.multicast.adapterproperty-description" %}

IceDiscovery creates an object adapter named `IceDiscovery.Multicast` for receiving discovery queries from clients. If
not otherwise defined by `IceDiscovery.Multicast.Endpoints`, the endpoint for this object adapter is composed as
follows:

`udp -h "addr" -p port [--interface "intf"]`

where `addr` is the value of [IceDiscovery.Address](../icediscovery-properties#icediscovery.address), `port` is the
value of [IceDiscovery.Port](../icediscovery-properties#icediscovery.port), and `intf` is the value of
[IceDiscovery.Interface](../icediscovery-properties#icediscovery.interface).

You don't normally need to set [other properties](../object-adapter-properties) for this object adapter.

## IceDiscovery.LatencyMultiplier

### Synopsis {% id="icediscovery.latencymultiplier-synopsis" %}

`IceDiscovery.LatencyMultiplier=num`

### Description {% id="icediscovery.latencymultiplier-description" %}

Specifies the multiplier to apply to the latency of the first discovery request-reply for replica groups. When
IceDiscovery receives a reply for a discovery request and this reply indicates that the adapter identifier is a replica
group, it waits for an additional time interval for other responses from replicated servers. This time interval is based
on the latency of the first request-reply and the latency multiplier. For example, if the first reply is received after
15 milliseconds and the multiplier is set to 4, IceDiscovery will wait for an additional 60 milliseconds for replies
from other servers. If not defined, the default is `1`. `num` must be `1` or greater.

## IceDiscovery.Port

### Synopsis {% id="icediscovery.port-synopsis" %}

`IceDiscovery.Port=port`

### Description {% id="icediscovery.port-description" %}

Specifies the multicast port to use for sending or receiving multicast requests. If not set, the default value is
`4061`.

## IceDiscovery.Reply._AdapterProperty_

### Synopsis {% id="icediscovery.reply.adapterproperty-synopsis" %}

`IceDiscovery.Reply.AdapterProperty=value`

### Description {% id="icediscovery.reply.adapterproperty-description" %}

IceDiscovery creates an object adapter named `IceDiscovery.Reply` for receiving replies to
[multicast requests](../icediscovery). If not otherwise defined by `IceDiscovery.Reply.Endpoints`, the endpoint for this
object adapter is composed as follows:

`udp [-h intf]`

where `intf` is the value of [IceDiscovery.Interface](../icediscovery-properties#icediscovery.interface). A fixed port
is not necessary for this endpoint.

You don't normally need to set [other properties](../object-adapter-properties) for this object adapter.

## IceDiscovery.RetryCount

### Synopsis {% id="icediscovery.retrycount-synopsis" %}

`IceDiscovery.RetryCount=num`

### Description {% id="icediscovery.retrycount-description" %}

Specifies the maximum number of times that the plug-in will retry sending UDP multicast requests before giving up. The
[IceDiscovery.Timeout](../icediscovery-properties#icediscovery.timeout) property determines how long the plug-in waits
for a reply before trying again. If not defined, the default retry count is `3`, for a total of four attempts. A value
of 0 sends only the initial query.

## IceDiscovery.Timeout

### Synopsis {% id="icediscovery.timeout-synopsis" %}

`IceDiscovery.Timeout=num`

### Description {% id="icediscovery.timeout-description" %}

Specifies the time interval in milliseconds to wait for replies to UDP multicast requests. If no server replies during
this time interval, the client will retry the request the number of times specified by
[IceDiscovery.RetryCount](../icediscovery-properties#icediscovery.retrycount). If not defined, the default timeout is
`300`. `num` must be greater than `0`.
