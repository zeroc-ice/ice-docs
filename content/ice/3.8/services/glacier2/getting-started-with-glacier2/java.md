{% language-section name="mapping" %}

```java
RouterPrx router = RouterPrx.createProxy(
    communicator, "Glacier2/router:tcp -h 5.6.7.8 -p 4063");

SessionPrx session;
try {
    session = router.createSession(System.getProperty("user.name"), "password");
} catch (PermissionDeniedException | CannotCreateSessionException e) {
    System.out.println("Could not create session: " + e.getMessage());
    return;
}
```

{% /language-section %}

{% language-section name="greeter-demo" %}

{% callout type="tip" title="Example" %}

The [Glacier2 greeter demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/java/Glacier2/greeter) shows a Java client
that calls an object in a server behind a Glacier2 router, with the server and the router configuration,
`glacier2.conf`.

{% /callout %}

{% /language-section %}

{% language-section name="session-demo" %}

The [Glacier2 session demo](https://github.com/zeroc-ice/ice-demos/tree/3.8/java/Glacier2/session) implements and
configures a session manager in Java.

{% /language-section %}
