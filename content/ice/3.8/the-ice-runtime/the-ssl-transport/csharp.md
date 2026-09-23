{% language-section name="lang-1" %}

```csharp
var greeter = GreeterPrxHelper.createProxy(
    communicator,
    "greeter:ssl -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="lang-2" %}

```csharp
var adapter = communicator.createObjectAdapterWithEndpoints(
  "GreeterAdapter",
  "ssl -p 4061");
```

{% /language-section %}

{% language-section name="lang-3" %}

The [Ice/secure](https://github.com/zeroc-ice/ice-demos/tree/3.8/csharp/Ice/Secure) demo provides a good starting point
for using these APIs.

The SSL transport for outgoing connections can be configured by setting the
[clientAuthenticationOptions](https://code.zeroc.com/ice/3.8/api/csharp/api/Ice.InitializationData.html#Ice_InitializationData_clientAuthenticationOptions)
property of the [InitializationData](https://code.zeroc.com/ice/3.8/api/csharp/api/Ice.InitializationData.html) used to
create the communicator.

This SSL configuration applies to all SSL outgoing connections created by that communicator.

The SSL transport for incoming connections can be configured by setting the `serverAuthenticationOptions` parameter of
[createObjectAdapter](https://code.zeroc.com/ice/3.8/api/csharp/api/Ice.Communicator.html#Ice_Communicator_createObjectAdapter_System_String_System_Net_Security_SslServerAuthenticationOptions_),
or
[createObjectAdapterWithEndpoints](https://code.zeroc.com/ice/3.8/api/csharp/api/Ice.Communicator.html#Ice_Communicator_createObjectAdapterWithEndpoints_System_String_System_String_System_Net_Security_SslServerAuthenticationOptions_).

This SSL configuration applies to all SSL incoming connections accepted by that object adapter.

{% /language-section %}

{% language-section name="lang-4" %}

```
# The server's certificate file.
IceSSL.CertFile=server.p12
IceSSL.Password=password

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
