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

{% callout type="tip" title="Example" %}

The [Glacier2 greeter demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/cpp/Glacier2/greeter) shows a C++ client
that calls an object in a server behind a Glacier2 router, with the server and the router configuration,
`glacier2.conf`.

{% /callout %}

{% /language-section %}

{% language-section name="session-demo" %}

The [Glacier2 session demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/cpp/Glacier2/session) implements and
configures a session manager in C++.

{% /language-section %}
