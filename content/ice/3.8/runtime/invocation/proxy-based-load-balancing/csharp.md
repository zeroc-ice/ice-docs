{% language-section name="lang-1" %}

```csharp
var proxy = GreeterPrxHelper.createProxy(
    communicator,
    "greeter:tcp -h 10.0.0.1 -p 4061:tcp -h 10.0.0.2 -p 4061");
proxy = GreeterPrxHelper.uncheckedCast(proxy.ice_connectionCached(false));
proxy = GreeterPrxHelper.uncheckedCast(
    proxy.ice_endpointSelection(Ice.EndpointSelectionType.Random));
// If also using a locator:
proxy = GreeterPrxHelper.uncheckedCast(proxy.ice_locatorCacheTimeout(...));
```

{% /language-section %}
