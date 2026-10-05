{% language-section name="configuring-a-router-for-client-invocations-2" %}

```py
router = Ice.RouterPrx(...)
greeter = VisitorCenter.GreeterPrx(...) # normal proxy
routedGreeter = greeter.ice_router(router)
```

{% /language-section %}
