{% language-section name="configuring-invocation-timeouts-for-proxies" %}

```csharp
var greeter = GreeterPrxHelper.createProxy(
    communicator,
    "greeter:tcp -h localhost -p 4061");
greeter = GreeterPrxHelper.uncheckedCast(
    greeter.ice_invocationTimeout(TimeSpan.FromMilliseconds(2500)));
```

{% /language-section %}

{% language-section name="invocation-timeout-failures" %}

```csharp
try
{
    greeting = await greeter.GreetAsync("alice");
    ...
}
catch (Ice.InvocationTimeoutException exception)
{
    Console.WriteLine("invocation timed out");
}
```

{% /language-section %}
