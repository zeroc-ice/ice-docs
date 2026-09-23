{% language-section name="lang-1" %}

```java
var greeter = GreeterPrx.createProxy(communicator, "tcp -h localhost -p 4061");
greeter = greeter.ice_invocationTimeout(Duration.ofMillis(2500));
```

{% /language-section %}

{% language-section name="lang-2" %}

```java
try {
    greeting = greeter.greet("alice");
    ...
} catch (InvocationTimeoutException exception) {
    System.out.println("invocation timed out");
}
```

{% /language-section %}
