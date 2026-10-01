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
