{% language-section name="stringifying-a-proxy" %}

You can stringify a proxy by calling `ice_toString` on this proxy. For example:

```matlab
greeter = GreeterPrx(communicator, 'greeter:tcp -h localhost -p 4061');
s = greeter.ice_toString();
```

`ice_toString` stringifies non-printable ASCII characters and non-ASCII characters in the proxy's identity, facet and
object adapter ID as specified through the [Ice.ToStringMode](../../../property-reference/ice-properties) property.

{% /language-section %}

{% language-section name="proxy-to-property" %}

```matlab
greeter = GreeterPrx(communicator, 'greeter:tcp -h localhost -p 4061');
propertyDict = communicator.proxyToProperty(greeter, 'Greeter');
```

{% /language-section %}
