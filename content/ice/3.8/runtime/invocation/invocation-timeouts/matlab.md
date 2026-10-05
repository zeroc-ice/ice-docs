{% language-section name="configuring-invocation-timeouts-for-proxies" %}

```matlab
greeter = GreeterPrx(communicator, 'greeter:tcp -h localhost -p 4061');
greeter = greeter.ice_invocationTimeout(2500);
```

{% /language-section %}

{% language-section name="invocation-timeout-failures" %}

```matlab
try
    greeting = greeter.greet('alice');
    ...
catch ex
    if isa(ex, 'Ice.InvocationTimeoutException')
        fprintf('invocation timed out\n');
    else
        rethrow(ex);
    end
end
```

{% /language-section %}
