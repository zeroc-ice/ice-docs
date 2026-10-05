{% language-section name="configuring-a-router-for-client-invocations-2" %}

```php
$router = Ice\RouterPrxHelper::createProxy(...);
$greeter = VisitorCenter\GreeterPrxHelper::createProxy(...); // normal proxy
$routedGreeter = $greeter->ice_router($router);
```

{% /language-section %}
