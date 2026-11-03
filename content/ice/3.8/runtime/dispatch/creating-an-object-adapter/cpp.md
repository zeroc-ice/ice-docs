{% language-section name="create" %}

```cpp
Ice::ObjectAdapterPtr adapter = communicator->createObjectAdapter(
    "GreeterAdapter");
```

{% /language-section %}

{% language-section name="create-with-endpoints" %}

```cpp
Ice::ObjectAdapterPtr adapter = communicator->createObjectAdapterWithEndpoints(
    "GreeterAdapter",
    "tcp -p 4061");
```

{% /language-section %}
