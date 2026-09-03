---
id: creating-proxies
language: java
---

{% language-section name="lang-1" %}
The generated proxy class provides a static factory method `createProxy` from a communicator and a [stringified representation](../syntax-for-stringified-proxies) of the proxy, as shown in the following example:

```java
GreeterPrx greeter = GreeterPrx.createProxy(
    communicator, 
    "greeter:tcp -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="lang-2" %}
We can use the `propertyToProxy` method on `Communicator` to convert the property's value into a proxy. A null proxy is returned if no property is found with the specified name.

```java
ObjectPrx greeter = communicator.propertyToProxy("Greeter.Proxy");
```

{% /language-section %}

{% language-section name="lang-3" %}

```java
var greeter = GreeterPrx.createProxy(
    communicator, 
    "greeter:tcp -h localhost -p 4061");
greeter = greeter.ice_endpointSelection(EndpointSelectionType.Ordered);
```

{% /language-section %}

{% language-section name="lang-4" %}

```java
AccountPrx account = bank.findAccount("WXY-123456");
```

{% /language-section %}
