{% language-section name="configuring-invocation-timeouts-for-proxies" %}

```js
var greeter = new VisitorCenter.GreeterPrx(
    communicator,
    "greeter:tcp -h localhost -p 4061");
greeter = greeter.ice_invocationTimeout(2500);
```

{% /language-section %}

{% language-section name="invocation-timeout-failures" %}

```js
try {
    greeting = await greeter.greet("alice");
    ...
} catch (exception) {
    if (exception instanceof Ice.InvocationTimeoutException) {
        console.log("invocation timed out");
    } else {
        throw exception;
    }
}
```

{% /language-section %}
