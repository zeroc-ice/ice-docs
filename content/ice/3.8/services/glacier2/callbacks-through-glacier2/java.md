{% language-section name="mapping" %}

```java
RouterPrx router = ...;
session = router.createSession(...);
// Retrieve the client category after the session is created.
String clientCategory = router.getCategoryForClient();
```

{% /language-section %}
