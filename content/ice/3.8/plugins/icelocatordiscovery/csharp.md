{% language-section name="mapping" %}

When you write a client, you should install `IceLocatorDiscovery` in your communicator using the `pluginFactories` field
of `InitializationData`:

```csharp
var initData = new Ice.InitializationData
{
    properties = new Ice.Properties(ref args),
    pluginFactories = [new IceLocatorDiscovery.PluginFactory()]
};

await using Ice.Communicator communicator = Ice.Util.initialize(initData);
```

Alternatively, you can install the IceLocatorDiscovery plug-in at runtime using configuration:

```config
Ice.Plugin.IceLocatorDiscovery=IceLocatorDiscovery:IceLocatorDiscovery.PluginFactory
```

{% /language-section %}
