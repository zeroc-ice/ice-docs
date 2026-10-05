{% language-section name="lang-1" %}

```php
$greeter = VisitorCenter\GreeterPrxHelper::createProxy(
    $communicator,
    "greeter:ssl -h localhost -p 4061");
```

{% /language-section %}
