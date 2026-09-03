---
id: invocation-timeouts
language: js
---

{% language-section name="lang-1" %}

```js
var greeter = new VisitorCenter.GreeterPrx(
    communicator,
    "tcp -h localhost -p 4061");
greeter = greeter.ice_invocationTimeout(2500);
```

{% /language-section %}

{% language-section name="lang-2" %}

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
