{% language-section name="configuring-invocation-timeouts-for-proxies" %}

```php
$greeter = GreeterPrxHelper::createProxy(
    $communicator,
    'greeter:tcp -h localhost -p 4061');
$greeter = $greeter->ice_invocationTimeout(2500);
```

{% /language-section %}

{% language-section name="invocation-timeout-failures" %}

```php
try {
    $greeting = $greeter->greet("alice");
    ...
} catch (Ice\InvocationTimeoutException $exception) {
    echo "invocation timed out\n";
}
```

{% /language-section %}
