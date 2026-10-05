{% language-section name="configuring-a-router-for-client-invocations-1" %}

```java
var router = RouterPrx.createProxy(…);
var greeter = GreeterPrx.createProxy(...); // normal proxy
var routedGreeter = greeter.ice_router(router);
```

{% /language-section %}
