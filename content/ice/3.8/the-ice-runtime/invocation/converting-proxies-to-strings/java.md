{% language-section name="lang-1" %}

You can stringify a proxy by calling `toString` on this proxy. For example:

```java
GreeterPrx greeter = GreeterPrx.createProxy(
    communicator,
    "greeter:tcp -h localhost -p 4061");
String s = greeter.toString();
```

`toString` stringifies non-printable ASCII characters and non-ASCII characters in the proxy's identity, facet and object
adapter ID as specified through the [Ice.ToStringMode](../ice-properties) property.

{% /language-section %}

{% language-section name="lang-2" %}

```java
GreeterPrx greeter = GreeterPrx.createProxy(
    communicator,
    "greeter:tcp -h localhost -p 4061");
Map<String, String> propertyDict =
    communicator.proxyToProperty(greeter, "Greeter");
```

{% /language-section %}
