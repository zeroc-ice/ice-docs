---
id: the-ssl-transport
language: python
---

{% language-section name="lang-1" %}

```py
greeter = VisitorCenter.GreeterPrx(
    communicator,
    "greeter:ssl -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="lang-2" %}

```py
adapter = communicator.createObjectAdapterWithEndpoints(
    "GreeterAdapter",
    "ssl -p 4061")
```

{% /language-section %}

{% language-section name="lang-3" %}

{% /language-section %}

{% language-section name="lang-4" %}

{% /language-section %}

{% language-section name="lang-5" %}

{% /language-section %}
