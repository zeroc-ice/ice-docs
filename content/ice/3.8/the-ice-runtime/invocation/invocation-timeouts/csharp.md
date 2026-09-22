---
id: invocation-timeouts
language: csharp
---

{% language-section name="lang-1" %}

```csharp
var greeter = GreeterPrxHelper.createProxy(
    communicator,
    "tcp -h localhost -p 4061");
greeter = greeter.ice_invocationTimeout(TimeSpan.FromMilliseconds(2500));
```

{% /language-section %}

{% language-section name="lang-2" %}

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
