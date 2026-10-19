{% language-section name="mapping" %}

```java
RouterPrx router = ...;
session = router.createSession(...);
// Retrieve the client category after the session is created.
String clientCategory = router.getCategoryForClient();
```

{% /language-section %}

{% language-section name="callback-demo" %}

{% callout type="tip" title="Example" %}

The [Glacier2 callback demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/java/Glacier2/callback) shows a Java client
that creates a session with a Glacier2 router and receives callbacks over its connection to the router. Its `README.md`
describes how to run it, and the comments in its `glacier2.conf` describe the router properties.

{% /callout %}

{% /language-section %}
