{% language-section name="using-the-ssl-transport-1" %}

```py
greeter = VisitorCenter.GreeterPrx(
    communicator,
    "greeter:ssl -h localhost -p 4061");
```

{% /language-section %}

{% language-section name="using-the-ssl-transport-2" %}

```py
adapter = communicator.createObjectAdapterWithEndpoints(
    "GreeterAdapter",
    "ssl -p 4061")
```

{% /language-section %}
