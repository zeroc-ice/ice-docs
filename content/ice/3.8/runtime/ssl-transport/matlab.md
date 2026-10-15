{% language-section name="using-the-ssl-transport-1" %}

```matlab
greeter = visitorcenter.GreeterPrx( ...
    communicator, ...
    'greeter:ssl -h localhost -p 4061');
```

{% /language-section %}

{% language-section name="using-the-ssl-transport-2" %}

{% callout type="note" %}
Ice for MATLAB is client-only: it cannot create object adapters.
{% /callout %}

{% /language-section %}

{% language-section name="using-the-ssl-transport-4" %}

{% callout type="note" %}
Ice for MATLAB is client-only, so this server-side configuration does not apply.
{% /callout %}

{% /language-section %}

{% language-section name="using-the-ssl-transport-5" %}

```config
# The trusted certificate authorities used to validate peer certificates.
IceSSL.CAs=ca_cert.pem
```

{% /language-section %}

{% language-section name="ssl-connection-information" %}

The SSL connection information class is `Ice.SSL.ConnectionInfo`. Its `peerCertificate` property holds the peer's
certificate, PEM-encoded, or an empty character vector when the peer did not provide a certificate.

{% /language-section %}
