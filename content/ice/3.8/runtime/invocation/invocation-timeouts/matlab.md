{% language-section name="configuring-invocation-timeouts-for-proxies" %}

```matlab
greeter = GreeterPrx(communicator, 'greeter:tcp -h localhost -p 4061');
greeter = greeter.ice_invocationTimeout(2500);
```

{% /language-section %}
