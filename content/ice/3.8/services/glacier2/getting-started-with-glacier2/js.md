{% language-section name="mapping" %}

```js
const router = new Glacier2.RouterPrx(
    communicator,
    "Glacier2/router:tcp -h 5.6.7.8 -p 4063");
const session = await router.createSession(name, "password");
```

{% /language-section %}
