---
id: invocation-timeouts
language: php
---

{% language-section name="lang-1" %}

```php
$greeter = GreeterPrxHelper::createProxy(
    $communicator, 
    'greeter:tcp -h localhost -p 4061');
$greeter = $greeter->ice_invocationTimeout(2500);
```

{% /language-section %}

{% language-section name="lang-2" %}

```php
try {
    $greeting = $greeter>greet("alice");
    ...
} catch (Ice\InvocationTimeoutException $exception) {
    echo "invocation timed out\n";
}
```

{% /language-section %}
