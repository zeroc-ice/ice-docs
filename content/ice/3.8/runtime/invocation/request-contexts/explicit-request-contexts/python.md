{% language-section name="client" %}

```py
greeting = await greeter.greetAsync(name, context={"language": "fr"})
```

{% /language-section %}

{% language-section name="server" %}

```py
language = current.ctx.get("language", "")
```

The [Ice context demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/python/Ice/context) provides a complete example.

{% /language-section %}
