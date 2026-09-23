{% language-section name="lang-1" %}

```java
RouterPrx router = RouterPrx.createProxy(
    communicator, "Glacier2/router:tcp -h localhost -p 4063");

SessionPrx session;
try {
    session = router.createSession(System.getProperty("user.name"), "password");
} catch (PermissionDeniedException | CannotCreateSessionException e) {
    System.out.println("Could not create session: " + e.getMessage());
    return;
}
```

{% /language-section %}
