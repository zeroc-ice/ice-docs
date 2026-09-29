{% language-section name="lang-1" %}

```cpp
Ice::RouterFinderPrx finder{
    communicator,
    "Ice/RouterFinder:tcp -p 4063 -h prodhost"};

auto router = finder.getRouter();
communicator->setDefaultRouter(router);
```

{% /language-section %}
