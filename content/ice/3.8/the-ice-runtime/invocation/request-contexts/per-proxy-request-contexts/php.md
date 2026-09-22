---
id: per-proxy-request-contexts
language: php
---

{% language-section name="lang-1" %}

```php
// setting the context on the proxy.
$context = ["language" => "es"];
$greeterEs = $greeter->ice_context($context);
```

{% /language-section %}
