{% language-section name="mapping" %}

Ice provides a plug-in class, `Ice.LoggerPlugin`, whose constructor installs the given logger into the communicator; its
`initialize` and `destroy` methods do nothing. The communicator takes ownership of the logger and disposes it when the
communicator is destroyed.

Assuming you wrote a `CustomLogger` class that implements `Ice.Logger`, you can create a plug-in factory that creates a
`LoggerPlugin` and installs your logger into the communicator:

```csharp
namespace ClearSky;

public class CustomLoggerPluginFactory : Ice.PluginFactory
{
    public string pluginName => "CustomLogger";

    public Ice.Plugin create(
        Ice.Communicator communicator,
        string name,
        string[] args) =>
        new Ice.LoggerPlugin(communicator, new CustomLogger());
}
```

Then, package your `CustomLogger` implementation and `CustomLoggerPluginFactory` in a .NET assembly, and configure your
communicator to load it at runtime. For example:

```config
Ice.Plugin.CustomLogger=CustomLogger.dll:ClearSky.CustomLoggerPluginFactory
```

{% /language-section %}
