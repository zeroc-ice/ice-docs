{% language-section name="see-also-1" %}

```java
ObjectAdapter adapter = communicator.createObjectAdapter("GreeterAdapter");
```

{% /language-section %}

{% language-section name="see-also-2" %}

```java
ObjectAdapter adapter = communicator.createObjectAdapterWithEndpoints(
    "GreeterAdapter",
    "tcp -p 4061");
```

{% /language-section %}
