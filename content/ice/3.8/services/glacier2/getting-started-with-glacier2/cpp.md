{% language-section name="mapping" %}

```cpp
Glacier2::RouterPrx router{
    communicator,
    "Glacier2/router:tcp -h 5.6.7.8 -p 4063"};

optional<Glacier2::SessionPrx> session =
    router->createSession(Env::getUsername(), "password");
```

{% /language-section %}

{% language-section name="greeter-demo" %}

The [Glacier2 greeter demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/cpp/Glacier2/greeter) provides a complete
client and server in C++, and the configuration of the Glacier2 router between them.

{% /language-section %}

{% language-section name="session-demo" %}

The [Glacier2 session demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/cpp/Glacier2/session) implements and
configures a session manager in C++.

{% /language-section %}
