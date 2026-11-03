{% language-section name="client" %}

```js
const greeting = await greeter.greet(name, new Map([["language", "fr"]]));
```

{% /language-section %}

{% language-section name="server" %}

```js
const language = current.ctx.get("language") || "";
```

The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/js/Ice/context) provides a complete example.

{% /language-section %}
