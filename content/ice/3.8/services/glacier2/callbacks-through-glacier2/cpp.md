{% language-section name="lang-1" %}

```cpp
Glacier2::RouterPrx router{...};
optional<Glacier2::SessionPrx> session = router->createSession(...);
// Retrieve the client category after the session is created.
string category = router.getCategoryForClient();
```

{% /language-section %}
