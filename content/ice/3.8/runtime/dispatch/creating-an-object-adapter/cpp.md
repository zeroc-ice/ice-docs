{% language-section name="see-also-1" %}

```cpp
Ice::ObjectAdapterPtr adapter = communicator->createObjectAdapter(
    "GreeterAdapter");
```

{% /language-section %}

{% language-section name="see-also-2" %}

```cpp
Ice::ObjectAdapterPtr adapter = communicator->createObjectAdapterWithEndpoints(
    "GreeterAdapter",
    "tcp -p 4061");
```

{% /language-section %}
