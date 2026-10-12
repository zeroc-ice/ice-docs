---
title: Transports
---

In Ice terminology, a _transport_ is a conduit for exchanging [Ice protocol](../../protocol) messages. Ice supports a
number of transports; some of them are built into the Ice core, while others are available as
[plug-ins](../../plugins/plug-in-facility). Your transport selection will be driven by application requirements. For
example, the TCP transport might be acceptable for deployment on a trusted intranet, while an Internet-facing
application will generally use SSL or WSS (WebSocket Secure).

Most transports have a configuration component, which is often done statically via the application's external
configuration file. Some transports also provide an API for accessing special features programmatically. Finally,
certain Ice features might not be available with all transports. For example, you can send
[oneway invocations](../invocation/invocation-mode/oneway-invocations) with any transport, whereas twoway invocations
require a stream-oriented transport and [datagram invocations](../invocation/invocation-mode/datagram-invocations)
require the UDP transport.

You'll need to choose a transport as soon as you're ready to test your first client-server prototype, if not sooner. The
server's [object adapter](../dispatch/object-adapter-endpoints) and the client's [proxy](../invocation/proxy-endpoints)
must have at least one matching endpoint, where an endpoint is simply a transport name together with any necessary
options. Ice uses a simple text-based [syntax](../endpoint-syntax) for configuring endpoints.

All of Ice's IP-based transports support both IPv4 and IPv6, as long as the underlying platform also supports both. Both
are enabled by default; you can disable one of them with the
[Ice.IPv4](../../property-reference/ice-properties#ice.ipv4) or
[Ice.IPv6](../../property-reference/ice-properties#ice.ipv6) property, and make Ice try the IPv6 addresses of a host
name first with [Ice.PreferIPv6Address](../../property-reference/ice-properties#ice.preferipv6address). These properties
are not available in JavaScript.

The following table summarizes the transports that Ice provides and indicates whether they are built into the Ice core
in C++, C#, Java, and indirectly in the C++-based implementations:

| **Transport** | **Core?**    | **Connection Oriented?** | **IP-based?** | **Description**                                                                                                                              |
| ------------- | ------------ | ------------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| tcp, ssl      | Yes          | Yes                      | Yes           | tcp is the default transport in Ice; ssl is tcp with TLS, using your platform's native SSL implementation.                                   |
| udp           | Yes          | No                       | Yes           | Supports unicast and multicast datagram invocations.                                                                                         |
| ws, wss       | Yes          | Yes                      | Yes           | WebSocket and secure WebSocket, especially useful when a client needs to communicate with a back-end service from a web browser application. |
| bt, bts       | No           | Yes                      | No            | Bluetooth, available on Linux and Android.                                                                                                   |
| iap, iaps     | Yes, on iOS. | Yes                      | No            | Communicates with accessories over Bluetooth or the Lightning connector; C++ applications install it explicitly.                             |

Ice for JavaScript supports a different set of transports:

| **Transport** | **Supported in Browser?** | **Supported with Node.js?** | **Notes**                                                |
| ------------- | ------------------------- | --------------------------- | -------------------------------------------------------- |
| tcp           | No                        | Yes                         | Ice for JavaScript can only create outgoing connections. |
| udp           | No                        | No                          |                                                          |
| ssl           | No                        | No                          |                                                          |
| ws            | Yes                       | Yes (Node.js >= 24)         |                                                          |
| wss           | Yes                       | Yes (Node.js >= 24)         |                                                          |

## Endpoint and Connection Information

The Ice runtime describes an endpoint or a connection with an information object. An endpoint's `getInfo` method returns
an [EndpointInfo](api:Ice/EndpointInfo), and a connection's `getInfo` method returns a
[ConnectionInfo](api:Ice/ConnectionInfo). You get endpoints from a proxy with `ice_getEndpoints` and from a connection
with `getEndpoint`, and you get the connection of a proxy with `ice_getConnection`.

Each transport provides its own subclass of these two classes, with fields specific to that transport, such as the host
and port of a TCP endpoint or the local and remote addresses of a TCP connection:

| **Transport**           | **Endpoint Information** | **Connection Information**                                                |
| ----------------------- | ------------------------ | ------------------------------------------------------------------------- |
| tcp                     | `TCPEndpointInfo`        | `TCPConnectionInfo`                                                       |
| udp                     | `UDPEndpointInfo`        | `UDPConnectionInfo`                                                       |
| ws                      | `WSEndpointInfo`         | `WSConnectionInfo`                                                        |
| [ssl](../ssl-transport) | SSL endpoint information | [SSL connection information](../ssl-transport#ssl-connection-information) |

The SSL classes are `SSLEndpointInfo` and `SSLConnectionInfo` in Python, Swift, Ruby, and PHP, and `EndpointInfo` and
`ConnectionInfo` in the `SSL` namespace or package in the other language mappings.

A transport that runs over another transport wraps the information of that transport: the `underlying` field holds the
information object of the transport below, and holds no object for a transport that does not run over another transport.
For example, the information of a `wss` connection is a `WSConnectionInfo` whose `underlying` field holds the SSL
connection information, whose `underlying` field holds a `TCPConnectionInfo`. To read the fields of one transport, walk
the `underlying` chain until you reach an object of the class you need. The
[SSL transport](../ssl-transport#ssl-connection-information) page shows this for the SSL connection information.

{% iflang langs="cpp,java" %}

The Bluetooth transport provides the `EndpointInfo` and `ConnectionInfo` classes of the `IceBT` namespace or package.

{% /iflang %}

{% iflang langs="cpp,swift" %}

The iAP transport provides `IAPEndpointInfo` and `IAPConnectionInfo`.

{% /iflang %}

{% iflang langs="js" %}

Ice for JavaScript provides no UDP classes.

{% /iflang %}
