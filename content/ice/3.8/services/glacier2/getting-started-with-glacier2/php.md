{% language-section name="mapping" %}

```php
$router = Glacier2\RouterPrxHelper::createProxy(
    $communicator, 'Glacier2/router:tcp -h 5.6.7.8 -p 4063');
$username = get_current_user();
$session = $router->createSession($username, 'password');
```

{% /language-section %}
