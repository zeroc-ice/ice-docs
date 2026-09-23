{% language-section name="lang-1" %}

You can stringify a proxy by calling `ice_toString` on this proxy. For example:

```py
greeter = VisitorCenter.GreeterPrx(
    communicator,
    "greeter:tcp -h localhost -p 4061");
s = greeter.ice_toString();

# Or

s = str(greeter);
```

`ice_toString` stringifies non-printable ASCII characters and non-ASCII characters in the proxy's identity, facet and
object adapter ID as specified through the [Ice.ToStringMode](../ice-properties) property.

{% /language-section %}

{% language-section name="lang-2" %}

```py
greeter = VisitorCenter.GreeterPrx(
    communicator,
    "greeter:tcp -h localhost -p 4061");
propertyDict: dict[str, str] = communicator.proxyToProperty
```

{% /language-section %}
