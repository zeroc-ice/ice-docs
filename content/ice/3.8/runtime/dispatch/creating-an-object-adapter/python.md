{% language-section name="create" %}

```py
adapter = communicator.createObjectAdapter("GreeterAdapter")
```

{% /language-section %}

{% language-section name="create-with-endpoints" %}

```py
adapter = communicator.createObjectAdapterWithEndpoints(
    "GreeterAdapter",
    "tcp -p 4061")
```

{% /language-section %}
