{% language-section name="configuring-invocation-timeouts-for-proxies" %}

```cpp
VisitorCenter::GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
greeter = greeter.ice_invocationTimeout(2500ms);
```

{% /language-section %}
