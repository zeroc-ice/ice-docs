{% language-section name="mapping" %}

```cpp
Glacier2::RouterPrx router{...};
optional<Glacier2::SessionPrx> session = router->createSession(...);
// Retrieve the client category after the session is created.
string category = router.getCategoryForClient();
```

{% /language-section %}

{% language-section name="callback-demo" %}

The [Glacier2 callback demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/cpp/Glacier2/callback) provides a complete
client and server in C++, and the configuration of the Glacier2 router between them: the client receives callbacks from
the server through its session with the router.

{% /language-section %}
