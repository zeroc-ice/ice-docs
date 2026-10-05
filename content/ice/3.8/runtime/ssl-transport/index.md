---
title: The SSL Transport
---

The SSL transport provides support for securing Ice connections using the SSL/TLS protocols. It is a built-in transport
available with all supported language mappings and platforms.

The only exception is JavaScript which only supports WSS transport, the secure version of the WS (WebSocket) transport.

The SSL transport is built on top of each platform’s native SSL/TLS engine. This ensures interoperability with
platform-provided features and that any security updates to the SSL/TLS engine also apply to your Ice applications.

## Using the SSL Transport

To use the SSL transport, you must configure `ssl` endpoints for your client and server applications.

Clients use the SSL transport by specifying a `ssl` endpoint when creating a proxy:

{% language-section name="using-the-ssl-transport-1" /%}

Servers enable the SSL transport by using a `ssl` endpoint for their object adapter:

{% language-section name="using-the-ssl-transport-2" /%}

Both client and server must provide additional configuration to use the SSL transport. The configuration can be done
using the SSL transport configuration properties, or programmatically using the platform specific APIs for the SSL
transport.

At a minimum, you need to:

- Specify the server’s certificate and private key.
- Configure the trusted certificate authorities that the client uses to validate the server certificate.

Many additional options are available, but they are optional.

### Configure the SSL Transport Programmatically

The SSL transport configuration APIs provide access to more advanced features and to the underlying SSL engine. Because
they rely on platform-native APIs, you can only use them with **C++**, **Java**, and **C#**, which provide their own SSL
transport implementations. These APIs are not available in language mappings that reuse the C++ SSL transport (such as
Python, PHP, Ruby, MATLAB, and Swift). For those, you must rely on the SSL transport configuration properties described
below.

In C++, three SSL transport implementations are available:

- **OpenSSL** (Linux)
- **Secure Transport** (macOS)
- **Schannel** (Windows)

C# uses the SSL engine provided by .NET, and Java uses the SSL engine provided by the JDK.

In all cases, these APIs allow you to configure the SSL transport:

- **Per Object Adapter** for incoming connections.
- **Per Communicator** for outgoing connections.

These APIs address the following needs:

- Provide certificates and keys programmatically.
- Support hot certificate reload.
- Support custom certificate validation.
- Allow advanced configuration of the platform SSL engine.

{% language-section name="using-the-ssl-transport-3" /%}

### Configure the SSL Transport Using Properties

Sample server-side configuration showing how to set the server’s certificate and private key:

{% language-section name="using-the-ssl-transport-4" /%}

Sample client-side configuration showing how to set the trusted root authorities for validating the server certificate:

{% language-section name="using-the-ssl-transport-5" /%}

For additional details refer to the [IceSSL properties](../../property-reference/icessl-properties) documentation.

## Endpoint Security Considerations

You should avoid creating object adapters that include both secure and non-secure endpoints. For example, having both
TCP and SSL endpoints on the same object adapter defeats the purpose of using SSL, since clients could bypass the secure
connection and access the adapter through the plain TCP endpoint.

For most applications that handle sensitive data or operate on untrusted networks (including the internet or intranets),
the recommended practice is to use **only secure endpoints**.

## Using SSL with Other Transports

You can see the SSL transport as using the SSL/TLS protocol on top of Ice TCP transport, but it is possible to use
SSL/TLS on top of other transports.

Ice supports the following secure transports:

| **Transport** | **Underlying Transport** |
| ------------- | ------------------------ |
| ssl           | tcp                      |
| wss           | ws                       |
| bts           | bt                       |
| iaps          | iap                      |

The configuration for the SSL/TLS protocol for these secure transports is the same as what was described above for the
SSL transport.
