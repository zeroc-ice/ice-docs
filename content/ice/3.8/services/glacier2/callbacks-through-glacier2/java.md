{% language-section name="mapping" %}

```java
RouterPrx router = ...;
session = router.createSession(...);
// Retrieve the client category after the session is created.
String clientCategory = router.getCategoryForClient();
```

{% /language-section %}

{% language-section name="callback-demo" %}

The [Glacier2 callback demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/java/Glacier2/callback) provides a complete
client and server in Java, and the configuration of the Glacier2 router between them: the client receives callbacks from
the server through its session with the router.

{% /language-section %}
