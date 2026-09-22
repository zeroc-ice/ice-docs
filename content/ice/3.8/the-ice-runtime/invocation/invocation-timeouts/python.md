---
id: invocation-timeouts
language: python
---

{% language-section name="lang-1" %}

```py
greeter = GreeterPrx(communicator, "greeter:tcp -h localhost -p 4061")
greeter = greeter.ice_invocationTimeout(2500)
```

{% /language-section %}

{% language-section name="lang-2" %}

```py
try:
    greeting = await greeter.greetAsync("alice")
    ...
except Ice.InvocationTimeoutException as exception:
    print("invocation timed out")
```

{% /language-section %}
