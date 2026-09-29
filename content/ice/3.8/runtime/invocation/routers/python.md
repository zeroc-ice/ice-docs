{% language-section name="lang-1" %}

{% /language-section %}

{% language-section name="lang-2" %}

```py
router = Ice.RouterPrx(...)
greeter = VisitorCenter.GreeterPrx(...) # normal proxy
routedGreeter = greeter.ice_router(router)
```

{% /language-section %}
