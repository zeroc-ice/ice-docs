{% language-section name="configuring-a-router" %}

```java
var router = RouterPrx.createProxy(...);
var greeter = GreeterPrx.createProxy(...); // normal proxy
var routedGreeter = greeter.ice_router(router);
```

{% /language-section %}
