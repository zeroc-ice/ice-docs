{% language-section name="lang-1" %}

```cpp
VisitorCenter::GreeterPrx greeter{communicator, "tcp -h localhost -p 4061"};
greeter = greeter.ice_invocationTimeout(2500ms);
```

{% /language-section %}

{% language-section name="lang-2" %}

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
