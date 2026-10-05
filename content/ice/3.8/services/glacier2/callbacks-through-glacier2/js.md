{% language-section name="mapping" %}

```js
const router = new Glacier2.RouterPrx(...);
const session = await router.createSession(...);
// Retrieve the client category after the session is created.
const clientCategory = await router.getCategoryForClient();
```

{% /language-section %}
