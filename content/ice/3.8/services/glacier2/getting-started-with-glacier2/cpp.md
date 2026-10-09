{% language-section name="mapping" %}

```cpp
Glacier2::RouterPrx router{
    communicator,
    "Glacier2/router:tcp -h 5.6.7.8 -p 4063"};

optional<Glacier2::SessionPrx> session =
    router->createSession(Env::getUsername(), "password");
```

{% /language-section %}
