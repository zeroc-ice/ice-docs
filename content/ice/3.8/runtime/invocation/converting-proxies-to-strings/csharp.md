{% language-section name="stringifying-a-proxy" %}

You can stringify a proxy by calling `ToString` on this proxy. For example:

```csharp
GreeterPrx greeter = GreeterPrxHelper.createProxy(
    communicator,
    "greeter:tcp -h localhost -p 4061");
string s = greeter.ToString();
```

`ToString` stringifies non-printable ASCII characters and non-ASCII characters in the proxy's identity, facet and object
adapter ID as specified through the [Ice.ToStringMode](../../../property-reference/ice-properties) property.

{% /language-section %}

{% language-section name="proxy-to-property" %}

```csharp
GreeterPrx greeter =
    GreeterPrxHelper.createProxy(communicator, "greeter:tcp -h localhost -p 4061");
Dictionary<string, string> propertyDict =
    communicator.proxyToProperty(greeter, "Greeter");
```

{% /language-section %}
