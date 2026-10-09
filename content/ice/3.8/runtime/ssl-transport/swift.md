{% language-section name="using-the-ssl-transport-1" %}

```swift
let greeter = try makeProxy(
    communicator: communicator,
    proxyString: "greeter:ssl -h localhost -p 4061",
    type: GreeterPrx.self)
```

{% /language-section %}

{% language-section name="using-the-ssl-transport-2" %}

```swift
let adapter = try communicator.createObjectAdapterWithEndpoints(
    name: "GreeterAdapter",
    endpoints: "ssl -p 4061")
```

{% /language-section %}

{% language-section name="using-the-ssl-transport-4" %}

```config
# The server's certificate file.
IceSSL.CertFile=server.p12
IceSSL.Password=password

# The name of the keychain in which to import the server's certificate,
# and the keychain password (macOS only).
IceSSL.Keychain=server.keychain
IceSSL.KeychainPassword=password

# Turn on security logging/tracing.
IceSSL.Trace.Security=1
```

{% /language-section %}

{% language-section name="using-the-ssl-transport-5" %}

```config
# The trusted certificate authorities used to validate peer certificates.
IceSSL.CAs=ca_cert.pem
```

{% /language-section %}
