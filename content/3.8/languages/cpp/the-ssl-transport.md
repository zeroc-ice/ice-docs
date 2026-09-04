---
id: the-ssl-transport
language: cpp
---

{% language-section name="lang-1" %}

```cpp
GreeterPrx greeter(communicator, "greeter:ssl -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="lang-2" %}

```cpp
auto adapter = communicator->createObjectAdapterWithEndpoints(
    "GreeterAdapter",
    "ssl -p 4061");
```

{% /language-section %}

{% language-section name="lang-3" %}

The [Ice/secure](https://github.com/zeroc-ice/ice-demos/tree/3.8/cpp/Ice/secure) demo provides a good starting point for
using these APIs.

The SSL configuration for outgoing connections can be customized using the platform-specific client authentication
options class:

- On **Linux**, use
  [Ice::SSL::OpenSSLClientAuthenticationOptions](https://code.zeroc.com/ice/3.8/api/cpp/structIce_1_1SSL_1_1OpenSSLClientAuthenticationOptions.html).
- On **macOS**, use
  [Ice::SSL::SecureTransportClientAuthenticationOptions](https://code.zeroc.com/ice/3.8/api/cpp/structIce_1_1SSL_1_1SecureTransportClientAuthenticationOptions.html).
- On **Windows**, use
  [Ice::SSL::SchannelClientAuthenticationOptions](https://code.zeroc.com/ice/3.8/api/cpp/structIce_1_1SSL_1_1SchannelClientAuthenticationOptions.html).

{% callout type="info" %}

[Ice::SSL::ClientAuthenticationOptions](https://code.zeroc.com/ice/3.8/api/cpp/namespaceIce_1_1SSL_a5ed47c735f0c8e9f2e93b0818be8b1d3.html#a5ed47c735f0c8e9f2e93b0818be8b1d3)
is an alias that resolves to the platform-specific class and can be used in cross-platform code.

{% /callout %}

Client authentication options are set in the
[InitializationData](https://code.zeroc.com/ice/3.8/api/cpp/structIce_1_1InitializationData.html) used to create the
communicator.

This SSL configuration applies to all SSL outgoing connections created by that communicator.

The SSL configuration for incoming connections can be customized using the platform-specific server authentication
options class:

- On **Linux**, use
  [Ice::SSL::OpenSSLServerAuthenticationOptions](https://code.zeroc.com/ice/3.8/api/cpp/structIce_1_1SSL_1_1OpenSSLServerAuthenticationOptions.html).
- On **macOS**, use
  [Ice::SSL::SecureTransportServerAuthenticationOptions](https://code.zeroc.com/ice/3.8/api/cpp/structIce_1_1SSL_1_1SecureTransportServerAuthenticationOptions.html).
- On **Windows**, use
  [Ice::SSL::SchannelServerAuthenticationOptions](https://code.zeroc.com/ice/3.8/api/cpp/structIce_1_1SSL_1_1SchannelServerAuthenticationOptions.html).

{% callout type="info" %}

[Ice::SSL::ServerAuthenticationOptions](https://code.zeroc.com/ice/3.8/api/cpp/namespaceIce_1_1SSL_a750cd76e81843f6d699c5f49fb2aad75.html#a750cd76e81843f6d699c5f49fb2aad75)
is an alias that resolves to the platform-specific class and can be used in cross-platform code.

{% /callout %}

Server authentication options are set when creating an object adapter, using the `serverAuthenticationOptions` parameter
of
[createObjectAdapter](https://code.zeroc.com/ice/3.8/api/cpp/classIce_1_1Communicator_a17374c0535b41eebdc8f439ce034e9ce.html#a17374c0535b41eebdc8f439ce034e9ce),
[createObjectAdapterWithEndpoints](https://code.zeroc.com/ice/3.8/api/cpp/classIce_1_1Communicator_a7a81ede15240b9bc2b0e620941b69e5a.html#a7a81ede15240b9bc2b0e620941b69e5a).

This SSL configuration applies to all SSL incoming connections accepted by that object adapter.

{% /language-section %}

{% language-section name="lang-4" %}

```
# The server's certificate file.
IceSSL.CertFile=server.p12
IceSSL.Password=password

# The name of the keychain in which to import the server's certificate,
# and the keychain password (macOS and iOS only).
IceSSL.Keychain=server.keychain
IceSSL.KeychainPassword=password

# Turn on security logging/tracing.
IceSSL.Trace.Security=1
```

{% /language-section %}

{% language-section name="lang-5" %}

```
# The trusted certificated authorities used to validate peer certificates.
IceSSL.CAs=ca_cert.pem
```

{% /language-section %}
