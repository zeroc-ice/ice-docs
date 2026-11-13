{% language-section name="create" %}

```java
ObjectAdapter adapter = communicator.createObjectAdapter("GreeterAdapter");
```

{% /language-section %}

{% language-section name="create-with-endpoints" %}

```java
ObjectAdapter adapter = communicator.createObjectAdapterWithEndpoints(
    "GreeterAdapter",
    "tcp -p 4061");
```

{% /language-section %}
