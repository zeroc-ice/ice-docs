---
id: routers
language: js
---

{% language-section name="lang-1" %}

```js
const router = new Ice.RouterPrx(…);
const greeter = new VisitorCenter.GreeterPrx(...); // normal proxy
const routedGreeter = greeter.ice_router(router);
```

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}
