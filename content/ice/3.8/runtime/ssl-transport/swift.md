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

{% language-section name="ssl-connection-information" %}

The SSL connection information class is
[SSLConnectionInfo](https://code.zeroc.com/ice/3.8/api/swift/documentation/ice/sslconnectioninfo). Its `peerCertificate`
property holds the peer's certificate, or `nil` when the peer did not provide a certificate.

```swift
func getSSLConnectionInfo(_ connection: Connection) throws -> SSLConnectionInfo? {
    var info: ConnectionInfo? = try connection.getInfo()
    while let current = info {
        if let sslInfo = current as? SSLConnectionInfo {
            return sslInfo
        }
        info = current.underlying
    }
    return nil
}
```

{% /language-section %}
