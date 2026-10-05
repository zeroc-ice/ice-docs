{% language-section name="configuring-invocation-timeouts-for-proxies" %}

```java
var greeter = GreeterPrx.createProxy(communicator, "greeter:tcp -h localhost -p 4061");
greeter = greeter.ice_invocationTimeout(Duration.ofMillis(2500));
```

{% /language-section %}

{% language-section name="invocation-timeout-failures" %}

```java
try {
    greeting = greeter.greet("alice");
    ...
} catch (InvocationTimeoutException exception) {
    System.out.println("invocation timed out");
}
```

{% /language-section %}
