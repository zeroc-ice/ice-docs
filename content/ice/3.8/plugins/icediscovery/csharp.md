{% language-section name="mapping" %}

You should install `IceDiscovery` in your communicator using the `pluginFactories` field of `InitializationData`:

```csharp
var initData = new Ice.InitializationData
{
    properties = new Ice.Properties(ref args),
    pluginFactories = [new IceDiscovery.PluginFactory()]
};

await using Ice.Communicator communicator = Ice.Util.initialize(initData);
```

Alternatively, you can install the IceDiscovery plug-in at runtime using configuration:

```config
Ice.Plugin.IceDiscovery=IceDiscovery:IceDiscovery.PluginFactory
```

{% /language-section %}
