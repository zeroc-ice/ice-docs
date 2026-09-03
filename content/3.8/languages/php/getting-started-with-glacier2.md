---
id: getting-started-with-glacier2
language: php
---

{% language-section name="lang-1" %}

```php
$router = Glacier2\RouterPrxHelper::createProxy(
    $communicator, 'Glacier2/router:tcp -h localhost -p 4063');
$username = get_current_user();
$session = $router->createSession($username, 'password');
```

{% /language-section %}
