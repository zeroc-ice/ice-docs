{% language-section name="using-the-ssl-transport-1" %}

```java
var greeter = GreeterPrx.createProxy(
    communicator,
    "greeter:ssl -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="using-the-ssl-transport-2" %}

```java
var adapter = communicator.createObjectAdapterWithEndpoints(
  "GreeterAdapter",
  "ssl -p 4061");
```

{% /language-section %}

{% language-section name="using-the-ssl-transport-3" %}

The [Ice/secure](https://github.com/zeroc-ice/ice-demos/tree/3.8/java/Ice/secure) demo provides a good starting point
for using these APIs.

The SSL transport for outgoing connections can be configured by setting the
[clientSSLEngineFactory](https://code.zeroc.com/ice/3.8/api/java/com.zeroc.ice/com/zeroc/Ice/InitializationData.html#clientSSLEngineFactory)
field of the
[InitializationData](https://code.zeroc.com/ice/3.8/api/java/com.zeroc.ice/com/zeroc/Ice/InitializationData.html) used
to create the communicator.

This SSL configuration applies to all SSL outgoing connections created by that communicator.

The SSL transport for incoming connections can be configured by setting the `sslEngineFactory` parameter of
[createObjectAdapter](<https://code.zeroc.com/ice/3.8/api/java/com.zeroc.ice/com/zeroc/Ice/Communicator.html#createObjectAdapter(java.lang.String,com.zeroc.Ice.SSL.SSLEngineFactory)>),
or
[createObjectAdapterWithEndpoints](<https://code.zeroc.com/ice/3.8/api/java/com.zeroc.ice/com/zeroc/Ice/Communicator.html#createObjectAdapterWithEndpoints(java.lang.String,java.lang.String,com.zeroc.Ice.SSL.SSLEngineFactory)>).

This SSL configuration applies to all SSL incoming connections accepted by that object adapter.

{% /language-section %}

{% language-section name="using-the-ssl-transport-4" %}

```config
# The keystore containing this server's certificate.
IceSSL.Keystore=server.jks
IceSSL.Password=password

# Turn on security logging/tracing.
IceSSL.Trace.Security=1
```

{% /language-section %}

{% language-section name="using-the-ssl-transport-5" %}

```config
# The keystore containing trusted certificated authorities used to validate
# peer certificates.
IceSSL.Truststore=ca.jks
```

{% /language-section %}
