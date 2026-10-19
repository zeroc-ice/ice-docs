{% language-section name="mapping" %}

```js
const router = new Glacier2.RouterPrx(...);
const session = await router.createSession(...);
// Retrieve the client category after the session is created.
const clientCategory = await router.getCategoryForClient();
```

{% /language-section %}

{% language-section name="callback-demo" %}

{% callout type="tip" title="Example" %}

The [Glacier2 callback demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/js/Glacier2/callback) provides a JavaScript
client that creates a session with a Glacier2 router and receives callbacks over its connection to the router. It runs
against the router and server of the callback demo of a language with full server-side support; its `README.md`
describes how.

{% /callout %}

{% /language-section %}
