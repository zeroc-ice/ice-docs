{% language-section name="configuring-invocation-timeouts-for-proxies" %}

```cpp
VisitorCenter::GreeterPrx greeter{communicator, "greeter:tcp -h localhost -p 4061"};
greeter = greeter.ice_invocationTimeout(2500ms);
```

{% /language-section %}

{% language-section name="invocation-timeout-failures" %}

```cpp
try
{
    auto greeting = greeter.greet("Alice");
    ...
}
catch (const Ice::InvocationTimeoutException&)
{
    cerr << "invocation timed out" << endl;
}
```

{% /language-section %}
