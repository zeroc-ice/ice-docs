{% language-section name="mapping" %}

```py
proxy = VisitorCenter.GreeterPrx(
    communicator,
    "greeter:tcp -h 10.0.0.1 -p 4061:tcp -h 10.0.0.2 -p 4061")
proxy = proxy.ice_connectionCached(False)
```

{% /language-section %}
