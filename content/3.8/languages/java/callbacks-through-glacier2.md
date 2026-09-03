---
id: callbacks-through-glacier2
language: java
---

{% language-section name="lang-1" %}

```java
RouterPrx router = ...;
session = router.createSession(...);
// Retrieve the client category after the session is created.
String clientCategory = router.getCategoryForClient();
```

{% /language-section %}
