{% language-section name="using-the-implicit-context" %}

```js
const implicitContext = communicator.getImplicitContext();
implicitContext.put("language", "fr");

// This invocation sends the "language" entry of the implicit context.
const greeting = await greeter.greet(name);
```

{% /language-section %}
