{% language-section name="mapping" %}

```cpp
Glacier2::RouterPrx router{
    communicator,
    "Glacier2/router:tcp -h localhost -p 4063"};

optional<Glacier2::SessionPrx> session =
    router->createSession(Env::getUsername(), "password");
```

{% /language-section %}
