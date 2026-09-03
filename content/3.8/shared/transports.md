---
id: transports
title: Transports
---

In Ice terminology, a *transport* is a conduit for exchanging [Ice protocol](../ice-protocol) messages. Ice supports a number of transports; some of them are built into the Ice core, while others are available as [plug-ins](../plug-in-facility). Your transport selection will be driven by application requirements. For example, the TCP transport might be acceptable for deployment on a trusted intranet, while an Internet-facing application will generally use SSL or WSS (WebSocket Secure).

Most transports have a configuration component, which is often done statically via the application's external configuration file. Some transports also provide an API for accessing special features programmatically. Finally, certain Ice features might not be available with all transports. For example, you can send [oneway invocations](../oneway-invocations) with any transport, whereas twoway invocations require a stream-oriented transport and [datagram invocations](../datagram-invocations) require the UDP transport.

You'll need to choose a transport as soon as you're ready to test your first client-server prototype, if not sooner. The server's [object adapter](../object-adapter-endpoints) and the client's [proxy](../proxy-endpoints) must have at least one matching endpoint, where an endpoint is simply a transport name together with any necessary options. Ice uses a simple text-based [syntax](../endpoint-syntax) for configuring endpoints.

All of Ice's IP-based transports support both IPv4 and IPv6, as long as the underlying platform also supports both. You can set [configuration properties](../property-reference) to enable or disable them, and control whether IPv4 or IPv6 has priority.

The following table summarizes the transports that Ice provides and indicates whether they are built into the Ice core in C++, C#, Java, and indirectly in the C++-based implementations:

| **Transport** | **Core?** | **Connection Oriented?** | **IP-based?** | **Description** |
| --- | --- | --- | --- | --- |
| tcp | Yes | Yes | Yes | This is the default transport in Ice. |
| udp | Yes | No | Yes | Supports unicast and multicast datagram invocations. |
| ssl | Yes | Yes | Yes | Uses your platform's native SSL implementation. |
| ws (WebSocket) | Yes | Yes | Yes | Especially useful when a client needs to communicate with a back-end service from a web browser application. |
| wss(WebSocket Secure) | Yes | Yes | Yes | WebSocket over SSL, uses the platform's native SSL implementation. |
| bt (Bluetooth) | No | Yes | No | Available on Linux and Android. |
| iap  (Apple iAP) | Yes, on iOS. | Yes | No | Use the Apple iAP transport to communicate with accessories over Bluetooth. |

Ice for JavaScript supports a different set of transports:

| **Transport** | **Supported in Browser?** | **Supported with Node.js?** | **Notes** |
| --- | --- | --- | --- |
| tcp | No | Yes | Ice for JavaScript can only create outgoing connections. |
| udp | No | No | |
| ssl | No | No | |
| ws | Yes | Yes (Node.js >= 24) | |
| wss | Yes | Yes (Node.js >= 24) | |
