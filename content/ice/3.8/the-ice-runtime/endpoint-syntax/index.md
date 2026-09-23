---
title: Endpoint Syntax
---

Ice uses endpoints for two similar but distinct purposes:

1. In a client context (that is, in a proxy), endpoints determine how Ice establishes a connection to a server.
2. In a server context (that is, in an object adapter's configuration), endpoints define the addresses and transport
   protocols over which new incoming connections are accepted.

{% callout type="tip" %}

Endpoint is an overloaded term - many things are “endpoints”. Think of an Ice endpoint as a “server address”. Not so
coincidentally, that’s the term we’ve adopted for IceRPC.

{% /callout %}

This page presents the addressing component of endpoints, as well as the transport protocols and their options.

# Endpoint List Syntax

#### Synopsis

`endpoint : endpoint`

#### Description

An endpoint list comprises one or more endpoints separated by a colon (`:`).

An endpoint has the following format:

`transport option`

`transport` can be any of the Ice transport protocols described on this page (`tcp`, `ssl`, `udp` etc.), or `default`.
When `default` is used, it is replaced by the value of the [Ice.Default.Protocol](../ice-default-properties) property
(default protocol means default _transport_ protocol). If an endpoint is malformed, or an unknown transport protocol is
specified, the application receives a `ParseException`.

{% callout type="info" %}

See [Object Adapter Endpoints](../object-adapter-endpoints) for examples.

{% /callout %}

## IP Address Syntax

#### Synopsis

`host : hostname | x.x.x.x | ":x:x:x:x:x:x:x"`

#### Description

Ice supports Internet Protocol (IP) versions 4 and 6 in all language mappings.

Support for these transport protocols is configured using the properties [Ice.IPv4](../ice-ipv6) and
[Ice.IPv6](../ice-properties) (both enabled by default).

In the endpoint descriptions below, the `host` parameter represents either a host name that is resolved via the Domain
Name System (DNS), an IPv4 address in dotted quad notation, or an IPv6 address in 128-bit hexadecimal format and
enclosed in double quotes. Due to limitation of the DNS infrastructure, host and domain names are restricted to the
ASCII character set.

The presence (or absence) of the `host` parameter has a significant influence on the behavior of the Ice runtime. The
table below describes these semantics:

| Value            | Client Semantics                                                                                                                                                                           | Server Semantics                                                                                                                                                                                                                                                                     |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| None             | If `host` is not specified in a proxy, Ice uses the value of the `Ice.Default.Host` property. If that property is not defined, outgoing connections are attempted over loopback addresses. | If `host` is not specified in an object adapter endpoint, Ice uses the value of the `Ice.Default.Host` property. If that property is not defined, the adapter behaves as if the wildcard symbol * was specified (see below).                                                         |
| Host name        | The host name is resolved via DNS. Outgoing connections are attempted to each address returned by the DNS query.                                                                           | noteYou should avoid using DNS names in object adapter endpoints. You should avoid using DNS names in object adapter endpoints. The host name is resolved via DNS, and the object adapter listens on the network interfaces corresponding to each address returned by the DNS query. |
| IPv4 address     | An outgoing connection is attempted to the given address.                                                                                                                                  | The object adapter listens on the network interface corresponding to the address.                                                                                                                                                                                                    |
| IPv6 address     | An outgoing connection is attempted to the given address.                                                                                                                                  | The object adapter listens on the network interface corresponding to the address.                                                                                                                                                                                                    |
| `0.0.0.0` (IPv4) | A "wildcard" IPv4 address that causes Ice to try all local interfaces when establishing an outgoing connection.                                                                            | The adapter listens on all IPv4 network interfaces (including the loopback interface), that is, binds to INADDR_ANY for IPv4.                                                                                                                                                        |
| `"::"` (IPv6)    | A "wildcard" IPv6 address that causes Ice to try all local interfaces when establishing an outgoing connection.                                                                            | Equivalent to * (see below).                                                                                                                                                                                                                                                         |
| `*` (IPv4, IPv6) | Not supported in proxies.                                                                                                                                                                  | The adapter listens on all network interfaces (including the loopback interface), that is, binds to INADDR_ANY for the enabled transport protocols (IPv4 and/or IPv6).                                                                                                               |

When IPv4 and IPv6 are enabled, an object adapter endpoint that uses an IPv6 (or * wildcard) address can accept both
IPv4 and IPv6 connections.

{% language-section name="lang-1" /%}

## TCP Endpoint Syntax

#### Synopsis

`tcp -h host -p port -t timeout -z --sourceAddress addr`

#### Availability

The TCP transport protocol is a built-in transport protocol: it's always available.

#### Description

A `tcp` endpoint supports the following options:

| Option                 | Description                                                                                                               | Client Semantics                                                                                                                                                                                                                                                                                                                                                                                  | Server Semantics                                                                                                                                                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-h` `host`            | Specifies the host name or IP address of the endpoint. If not specified, the value of `Ice.Default.Host` is used instead. | See [IP Address Syntax](../endpoint-syntax#ip-address-syntax).                                                                                                                                                                                                                                                                                                                                    | See [IP Address Syntax](../endpoint-syntax#ip-address-syntax).                                                                                                                                                          |
| `-p` `port`            | Specifies the port number of the endpoint.                                                                                | Determines the port to which a connection attempt is made (required).                                                                                                                                                                                                                                                                                                                             | The port will be selected by the operating system if this option is not specified or `port` is zero.                                                                                                                    |
| `-t` `timeout`         | Specifies the endpoint timeout in milliseconds.                                                                           | The value for `timeout` must either be `infinite` to specify no timeout, or an integer greater than zero representing the timeout in milliseconds. Endpoint timeouts are deprecated. They have no effect as of Ice 3.8.                                                                                                                                                                           | The value for `timeout` must either be `infinite` to specify no timeout, or an integer greater than zero representing the timeout in milliseconds. Endpoint timeouts are deprecated. They have no effect as of Ice 3.8. |
| `-z`                   | Specifies bzip2 compression.                                                                                              | Determines whether requests are compressed during sending.                                                                                                                                                                                                                                                                                                                                        | Determines whether compression is advertised in proxies created by the adapter.                                                                                                                                         |
| `--sourceAddress ADDR` | Specifies the source address used by the connection.                                                                      | The value for `ADDR` must be a numeric IPv4 or IPv6 address. If this option is not specified, it defaults to the value of [Ice.Default.SourceAddress](../ice-default-properties).This option allows to specify the source address set in the IP packet. It doesn't necessarily imply that the operating system will use the network interface matching this IP address to send out the IP packet. | Not supported                                                                                                                                                                                                           |

## UDP Endpoint Syntax

#### Synopsis

`udp -h host -p port -z --ttl TTL --interface INTF --sourceAddress addr`

#### Availability

The UDP transport protocol is a built-in transport protocol that is always available.

{% language-section name="lang-2" /%}

#### Description

A `udp` endpoint supports either unicast or multicast delivery; the address resolved by `host` argument determines the
delivery mode. To use multicast in IPv4, select an IP address in the range `233.0.0.0 to 239.255.255.255`. In IPv6, use
an address that begins with `ff`, such as `ff01::1:1`.

A `udp` endpoint supports the following options:

| Option                 | Description                                                                                                               | Client Semantics                                                                                                                                                                                                                                                                                                                                                                                                                                           | Server Semantics                                                                                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-h` `host`            | Specifies the host name or IP address of the endpoint. If not specified, the value of `Ice.Default.Host` is used instead. | See [IP Address Syntax](../endpoint-syntax#ip-address-syntax).                                                                                                                                                                                                                                                                                                                                                                                             | See [IP Address Syntax](../endpoint-syntax#ip-address-syntax).                                                                                                |
| `-p` `port`            | Specifies the port number of the endpoint.                                                                                | Determines the port to which datagrams are sent (required).                                                                                                                                                                                                                                                                                                                                                                                                | The port will be selected by the operating system if this option is not specified or port is zero.                                                            |
| `-z`                   | Specifies bzip2 compression.                                                                                              | Determines whether requests are compressed during sending.                                                                                                                                                                                                                                                                                                                                                                                                 | Determines whether compression is advertised in proxies created by the adapter.                                                                               |
| `--ttl` `TTL`          | Specifies the time-to-live (also known as "hops") of multicast messages.                                                  | Determines whether multicast messages are forwarded beyond the local network. If not specified, or the value of `TTL` is `-1`, multicast messages are not forwarded. The maximum value is `255`.                                                                                                                                                                                                                                                           | N/A                                                                                                                                                           |
| `--interface` `INTF`   | Specifies the network interface or group for multicast messages (see below).                                              | Selects the network interface for outgoing multicast messages. If not specified, multicast messages are sent using the default interface.                                                                                                                                                                                                                                                                                                                  | Selects the network interface to use when joining the multicast group. If set to * or not specified, the group is joined on all the local network interfaces. |
| `--sourceAddress ADDR` | Binds outgoing socket connections to the network interface associated with `ADDR`.                                        | The value for `ADDR` must be a numeric IPv4 or IPv6 address. If this option is not specified, it defaults to the value of [Ice.Default.SourceAddress](../ice-default-properties).This option allows to specify the source address set in the IP packet. It doesn't necessarily imply that the operating system will use the network interface matching this IP address to send out the IP packet.This feature is not supported on Universal Windows (UWP). | Not supported                                                                                                                                                 |

{% callout type="warning" title="Deprecated options" %}

With the 1.0 encoding, UDP endpoints supported 2 additional options: the `-e major.minor` and `-v major.minor` options.
These 2 options specified which encoding and protocol was supported by the endpoint. These two options are deprecated
with the 1.1 encoding and are ignored (a deprecation warning will be emitted when parsed by the communicator
`stringToProxy` method). The supported protocol and encoding is specified on the proxy with the 1.1 encoding.

{% /callout %}

### Multicast Interfaces

When `host` denotes a multicast address, the `--interface` `INTF` option selects a particular network interface to be
used for communication. The format of `INTF` depends on the language and IP version:

- C++ and .NET `INTF` can be an interface name, such as `eth0`, or an IP address. If using IPv6, it can also be an
  interface index. Interface names on Windows may contain spaces, such as `Local Area Connection`, therefore they must
  be enclosed in double quotes.
- Java `INTF` can be an interface name, such as `eth0`, or an IP address. On Windows, Java maps interface names to
  Unix-style nicknames.

## SSL Endpoint Syntax

#### Synopsis

`ssl -h host -p port -t timeout -z --sourceAddress addr`

#### Description

An `ssl` endpoint supports the same options as for [tcp endpoints](../endpoint-syntax).

## WS Endpoint Syntax

#### Synopsis

`ws -r resource -h host -p port -t timeout -z --sourceAddress addr`

#### Description

A `ws` (WebSocket) endpoint supports all [tcp endpoint](../endpoint-syntax) options in addition to the following:

| Option          | Description                                                                                              | Client Semantics                                                                             | Server Semantics                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `-r` `resource` | A URI specifying the resource associated with this endpoint. If not specified, the default value is `/`. | The value for `resource` is passed as the target for `GET` in the WebSocket upgrade request. | The web server configuration must direct the given `resource` to this endpoint. |

## WSS Endpoint Syntax

#### Synopsis

`wss -r resource -h host -p port -t timeout -z --sourceAddress addr`

#### Description

A `wss` (Secure WebSocket) endpoint supports all [ssl endpoint](../endpoint-syntax) options in addition to the
following:

| Option          | Description                                                                                              | Client Semantics                                                                             | Server Semantics                                                                |
| --------------- | -------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `-r` `resource` | A URI specifying the resource associated with this endpoint. If not specified, the default value is `/`. | The value for `resource` is passed as the target for `GET` in the WebSocket upgrade request. | The web server configuration must direct the given `resource` to this endpoint. |

## Bluetooth Endpoint Syntax

#### Synopsis

`bt -a addr -u uuid -c channel -t timeout -z --name name` `bts -a addr -u uuid -c channel -t timeout -z --name name`

#### Availability

The Bluetooth transport protocol is provided by a separate [IceBT plug-in](../icebt).

#### Description

Support for Bluetooth endpoints is provided by the [IceBT](../icebt) transport plug-in. The plug-in enables the `bt`
transport protocol by default; if the [IceSSL](../the-ssl-transport) plug-in is also installed, IceBT enables the `bts`
transport protocol as well. A Bluetooth endpoint supports the following options:

| Option         | Description                                                                                                                                                                                                                                                     | Client Semantics                                                                                                                                                                                                        | Server Semantics                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-a` `addr`    | Specifies the Bluetooth device address in the form `xx:xx:xx:xx:xx:xx`. The address must be enclosed in quotes because the colon (`:`) character is also a separator in the endpoint syntax. If not specified, the value of `Ice.Default.Host` is used instead. | An address is required for proxy endpoints. The plug-in will throw `EndpointParseException` if no address is specified via the `-a` option or `Ice.Default.Host`.                                                       | On Linux, the plug-in uses the address to select the Bluetooth adapter on which to listen for new connections. If no address is specified via the `-a` option or `Ice.Default.Host`, the plug-in uses the system's default adapter.On Android, the plug-in ignores this setting and always uses the system's default adapter.In addition to a Bluetooth device address, `addr` can also be `*` (e.g., `bt -a * ...`) to force the endpoint to use the system's default adapter without having to specify its address directly. The plug-in ignores the setting for `Ice.Default.Host` in this case. |
| `-u uuid`      | Specifies the UUID of a service.                                                                                                                                                                                                                                | A UUID is required for proxy endpoints. The plug-in uses the UUID to search for a matching service at the specified device address.                                                                                     | A UUID is optional (but recommended) for object adapter endpoints. If this option is not specified, the plug-in generates a random UUID. The plug-in registers the service with its UUID in the local SDP registry so that clients can locate it.                                                                                                                                                                                                                                                                                                                                                   |
| `-c` `channel` | Specifies the RFCOMM channel number of the endpoint.                                                                                                                                                                                                            | Not supported in proxy endpoints – the plug-in always uses the service UUID to connect to a server.                                                                                                                     | This setting is optional on Linux. The value for `channel` must be in the range 0-30. An available channel will be selected automatically if this setting is not specified or `channel` is zero.This setting is ignored on Android – the system always selects the channel.                                                                                                                                                                                                                                                                                                                         |
| `-t` `timeout` | Specifies the endpoint timeout in milliseconds.                                                                                                                                                                                                                 | The value for `timeout` must either be `infinite` to specify no timeout, or an integer greater than zero representing the timeout in milliseconds. Endpoint timeouts are deprecated. They have no effect as of Ice 3.8. | The value for `timeout` must either be `infinite` to specify no timeout, or an integer greater than zero representing the timeout in milliseconds. Endpoint timeouts are deprecated. They have no effect as of Ice 3.8.                                                                                                                                                                                                                                                                                                                                                                             |
| `-z`           | Specifies bzip2 compression.                                                                                                                                                                                                                                    | Determines whether requests are compressed during sending.                                                                                                                                                              | Determines whether compression is advertised in proxies created by the adapter.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `--name name`  | Specifies the service name.                                                                                                                                                                                                                                     | Ignored in proxy endpoints.                                                                                                                                                                                             | Associates a human-friendly name with the service's entry in the SDP registry. If not specified, the default name is `Ice Service`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |

## iAP Endpoint Syntax

#### Synopsis

`iap -p protocol -n name -m manufacturer -o model number -t timeout -z`
`iaps -p protocol -n name -m manufacturer -o model number -t`

#### Availability

The iAP transport protocol is provided by a separate [IceIAP plug-in](../iceiap).

#### Description

The iAP transport protocol allows applications running on iOS to communicate with accessories connected to the iOS
device either through Bluetooth or the lightning connector. The iAP transport protocol is a client-side transport
protocol: there's no server-side support. An iAP endpoint supports the following options to allow selecting the
accessory to connect to:

| Option              | Description                                          | Client Semantics                                                                                                                                                                                                        |
| ------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `-p` `protocol`     | Specifies the protocol implemented by the accessory. | The iAP transport protocol will only connect to accessories that advertise the specified iAP protocol. The default value for protocol is `com.zeroc.ice`.                                                               |
| `-n name`           | Specifies the name of the accessory.                 | When specified, the iAP transport protocol will only connect to accessories that match the specified accessory name.                                                                                                    |
| `-m` `manufacturer` | Specifies the manufacturer of the accessory.         | When specified, the iAP transport protocol will only connect to accessories that match the specified accessory manufacturer.                                                                                            |
| `-o` `model number` | Specifies the model number of the accessory.         | When specified, the iAP transport protocol will only connect to accessories that match the specified accessory model number.                                                                                            |
| `-t` `timeout`      | Specifies the endpoint timeout in milliseconds.      | The value for `timeout` must either be `infinite` to specify no timeout, or an integer greater than zero representing the timeout in milliseconds. Endpoint timeouts are deprecated. They have no effect as of Ice 3.8. |
| -z                  | Specifies bzip2 compression.                         | Determines whether requests are compressed during sending.                                                                                                                                                              |

## Opaque Endpoint Syntax

#### Synopsis

`opaque -t type -e encoding -v value`

#### Description

Proxies can contain endpoints that are not universally understood by Ice processes. For example, a proxy can contain an
endpoint for a transport that the receiver does not know.

Ice preserves such unknown endpoints when they are received over the wire. If an Ice process stringifies a proxy
containing an unknown endpoint, it writes the endpoint as an opaque endpoint.

An `opaque` endpoint supports the following options:

| Option        | Description                                                                                                     |
| ------------- | --------------------------------------------------------------------------------------------------------------- |
| `-t` `type`   | Specifies the endpoint type (also known as transport code) for the endpoint. TCP is 1, SSL is 2, UDP is 3, etc. |
| `-e encoding` | Specifies the encoding version used to encode the endpoint marshaled data.                                      |
| `-v` `value`  | Specifies the marshaled encoding of the endpoint in base-64 encoding.                                           |

Exactly one each of the `-t` and `-v` options must be present in an opaque endpoint. If `-e` is not specified, the
default encoding used by the Ice runtime is assumed.

##### See Also

- [Syntax for Stringified Proxies](../syntax-for-stringified-proxies)
- [Object Adapter Endpoints](../object-adapter-endpoints)
