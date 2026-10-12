{% language-section name="using-the-ssl-transport-1" %}

```php
$greeter = VisitorCenter\GreeterPrxHelper::createProxy(
    $communicator,
    "greeter:ssl -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="using-the-ssl-transport-2" %}

{% callout type="note" %}
Ice for PHP is client-only: it cannot create object adapters.
{% /callout %}

{% /language-section %}

{% language-section name="using-the-ssl-transport-4" %}

{% callout type="note" %}
Ice for PHP is client-only, so this server-side configuration does not apply.
{% /callout %}

{% /language-section %}

{% language-section name="using-the-ssl-transport-5" %}

```config
# The trusted certificate authorities used to validate peer certificates.
IceSSL.CAs=ca_cert.pem
```

{% /language-section %}

{% language-section name="ssl-connection-information" %}

The SSL connection information class is `Ice\SSLConnectionInfo`. Its `peerCertificate` property holds the peer's
certificate, PEM-encoded, or an empty string when the peer did not provide a certificate.

```php
function getSSLConnectionInfo($connection)
{
    for ($info = $connection->getInfo(); $info != null; $info = $info->underlying) {
        if ($info instanceof Ice\SSLConnectionInfo) {
            return $info;
        }
    }
    return null;
}
```

{% /language-section %}
