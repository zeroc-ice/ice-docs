{% language-section name="stringifying-a-proxy" %}

You can stringify a proxy by calling `ice_toString` on this proxy. For example:

```py
greeter = VisitorCenter.GreeterPrx(
    communicator,
    "greeter:tcp -h localhost -p 4061")
s = greeter.ice_toString()

# Or

s = str(greeter)
```

`ice_toString` stringifies non-printable ASCII characters and non-ASCII characters in the proxy's identity, facet and
object adapter ID as specified through the [Ice.ToStringMode](../../../property-reference/ice-properties) property.

{% /language-section %}

{% language-section name="proxy-to-property" %}

```py
greeter = VisitorCenter.GreeterPrx(
    communicator,
    "greeter:tcp -h localhost -p 4061")
propertyDict: dict[str, str] = communicator.proxyToProperty(greeter, "Greeter")
```

{% /language-section %}
