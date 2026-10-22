{% language-section name="mapping" %}

```js
const router = new Glacier2.RouterPrx(...);
const session = await router.createSession(...);
// Retrieve the client category after the session is created.
const clientCategory = await router.getCategoryForClient();
```

{% /language-section %}

{% language-section name="callback-demo" %}

The [Glacier2 callback demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/js/Glacier2/callback) provides a JavaScript
client that runs against the router and server of a callback demo written in another language.

{% /language-section %}
