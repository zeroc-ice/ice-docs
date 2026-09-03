---
id: upgrade-guide
language: php
---

{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

```diff
-$proxy = $communicator->stringToProxy("greeter: tcp -h localhost -p 4061");
-$greeter = GreeterPrxHelper::uncheckedCast($proxy);
+$greeter = 
+    GreeterPrxHelper::createProxy($communicator, 'greeter:tcp -h localhost -p 4061');
```

{% /language-section %}

{% language-section name="lang-3" %}

{% /language-section %}
