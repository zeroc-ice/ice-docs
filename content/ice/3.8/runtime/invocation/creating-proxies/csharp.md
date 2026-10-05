{% language-section name="creating-a-proxy-from-a-string" %}

The generated helper class for a proxy provides a static factory method `createProxy` that creates a proxy from a
communicator and a [stringified representation](../syntax-for-stringified-proxies) of the proxy, as shown in the
following example:

```csharp
GreeterPrx greeter = GreeterPrxHelper.createProxy(
    communicator,
    "greeter:tcp -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="creating-a-proxy-from-a-property-1" %}

We can use the `propertyToProxy` method on `Communicator` to convert the property's value into a proxy. A null proxy is
returned if no property is found with the specified name.

```csharp
ObjectPrx? greeter = communicator.propertyToProxy("Greeter.Proxy");
```

{% /language-section %}

{% language-section name="creating-a-proxy-from-a-property-2" %}

```csharp
var greeter = GreeterPrxHelper.createProxy(
    communicator,
    "greeter:tcp -h localhost -p 4061");
greeter = GreeterPrxHelper.uncheckedCast(
    greeter.ice_endpointSelection(EndpointSelectionType.Ordered));
```

{% /language-section %}

{% language-section name="receiving-a-proxy-from-an-operation" %}

```csharp
AccountPrx? account = await bank.findAccountAsync("WXY-123456");
```

{% /language-section %}
