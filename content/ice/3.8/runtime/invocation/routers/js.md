{% language-section name="configuring-a-router-for-client-invocations-1" %}

```js
const router = new Ice.RouterPrx(…);
const greeter = new VisitorCenter.GreeterPrx(...); // normal proxy
const routedGreeter = greeter.ice_router(router);
```

{% /language-section %}
