---
id: proxy-based-load-balancing
language: php
---

{% language-section name="lang-1" %}

```php
$proxy = GreeterPrxHelper::createProxy(
    $communicator,
    'greeter:tcp -h localhost -p 4061');
$proxy = $proxy->ice_connectionCached(false);
$proxy = $proxy->ice_endpointSelection(Ice.EndpointSelectionType.Random);
// If also using a locator:
$proxy = $proxy.ice_locatorCacheTimeout(...);
```

{% /language-section %}
