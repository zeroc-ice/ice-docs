{% language-section name="creating-a-proxy-from-a-string" %}

The generated proxy class provides a static factory method `createProxy` from a communicator and a
[stringified representation](../syntax-for-stringified-proxies) of the proxy, as shown in the following example:

```java
GreeterPrx greeter = GreeterPrx.createProxy(
    communicator,
    "greeter:tcp -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="creating-a-proxy-from-a-property-1" %}

We can use the `propertyToProxy` method on `Communicator` to convert the property's value into a proxy. A null proxy is
returned if no property is found with the specified name.

```java
ObjectPrx greeter = communicator.propertyToProxy("Greeter.Proxy");
```

{% /language-section %}

{% language-section name="creating-a-proxy-from-a-property-2" %}

```java
var greeter = GreeterPrx.createProxy(
    communicator,
    "greeter:tcp -h localhost -p 4061");
greeter = greeter.ice_endpointSelection(EndpointSelectionType.Ordered);
```

{% /language-section %}

{% language-section name="receiving-a-proxy-from-an-operation" %}

```java
AccountPrx account = bank.findAccount("WXY-123456");
```

{% /language-section %}
