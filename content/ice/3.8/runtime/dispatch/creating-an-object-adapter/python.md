{% language-section name="lang-1" %}

```py
adapter = communicator.createObjectAdapter("GreeterAdapter")
```

{% /language-section %}

{% language-section name="lang-2" %}

```py
adapter = communicator.createObjectAdapterWithEndpoints(
    "GreeterAdapter",
    "tcp -p 4061");
```

{% /language-section %}
