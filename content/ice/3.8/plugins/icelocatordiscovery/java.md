{% language-section name="mapping" %}

When you write a client, you should install `IceLocatorDiscovery` in your communicator using the `pluginFactories` field
of `InitializationData`:

```java
InitializationData initData = new InitializationData();
initData.pluginFactories =
    Collections.singletonList(new com.zeroc.IceLocatorDiscovery.PluginFactory());

try (Communicator communicator = Util.initialize(args)) {
    ....
}
```

Alternatively, you can install the IceLocatorDiscovery plug-in at runtime using configuration:

```config
Ice.Plugin.IceLocatorDiscovery=IceLocatorDiscovery:com.zeroc.IceLocatorDiscovery.PluginFactory
```

{% /language-section %}
