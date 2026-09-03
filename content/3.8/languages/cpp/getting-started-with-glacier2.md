---
id: getting-started-with-glacier2
language: cpp
---

{% language-section name="lang-1" %}

```cpp
Glacier2::RouterPrx router{
    communicator, 
    "Glacier2/router:tcp -h localhost -p 4063"};

optional<Glacier2::SessionPrx> session = 
    router->createSession(Env::getUsername(), "password");
```

{% /language-section %}
