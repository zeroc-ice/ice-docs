---
id: creating-an-object-adapter
language: js
---

{% language-section name="lang-1" %}

```js
const adapter = await communicator.createObjectAdapter("GreeterAdapter");
```

{% /language-section %}

{% language-section name="lang-2" %}
{% callout type="info" %}
The JavaScript mapping does not support incoming connection factories; therefore, you cannot create an object adapter with endpoints.
{% /callout %}
{% /language-section %}
