---
id: custom-logger-plug-in
language: csharp
---

{% language-section name="lang-1" %}
Ice provides a plug-in class, `Ice.LoggerPlugin`, that installs a logger into the communicator in its constructor:

```csharp
namespace Ice;

public class LoggerPlugin : Plugin
{
    public LoggerPlugin(Communicator communicator, Logger logger)
    {
       ...
    }
    
    public void initialize()
    {
    }

    public void destroy()
    {
    }
}
```

The implementation of `initialize` and `destroy` in `LoggerPlugin` are no-op.

Now, assuming you wrote a `CustomLogger` class that implements `Ice.Logger`, you can easily create a plug-in factory that creates a `LoggerPlugin` and installs your logger into the communicator:

```csharp
namespace ClearSky;

public class CustomLoggerPluginFactory : Ice.PluginFactory
{
    public string pluginName => "CustomLogger";

    public Ice.Plugin create(
        Ice.Communicator communicator, 
        string name,
        string[] args) =>
        new Ice.LoggerPlugin(communicator, new CustomLogger());
}
```

Then, package your `CustomLogger` implementation and `CustomLoggerPluginFactory` in a .NET assembly, and configure your communicator to load it at runtime. For example:

```
Ice.Plugin.CustomLogger=CustomLogger.dll:ClearSky.CustomLoggerPluginFactory
```

{% callout type="info" %}
Even though you didn’t implement the plug-in class (`Ice.LoggerPlugin`), you are in effect creating a new plug-in since you choose the logger given to the `LoggerPlugin` constructor. As a result, you can pick any name for the plug-in factory and the plug-in itself.
{% /callout %}
{% /language-section %}
