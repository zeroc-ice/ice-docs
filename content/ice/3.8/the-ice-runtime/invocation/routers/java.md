---
id: routers
language: java
---

{% language-section name="lang-1" %}

```java
var router = RouterPrx.createProxy(…);
var greeter = GreeterPrx.createProxy(...); // normal proxy
var routedGreeter = greeter.ice_router(router);
```

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
