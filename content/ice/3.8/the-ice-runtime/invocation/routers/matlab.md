---
id: routers
language: matlab
---

{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

```matlab
router = Ice.RouterPrx(...)
greeter = visitorcenter.GreeterPrx(...) % normal proxy
routedGreeter = greeter.ice_router(router)
```

{% /language-section %}
