{% language-section name="mapping" %}

When you write a client, you should install `IceLocatorDiscovery` in your communicator using the `pluginFactories` field
of `InitializationData`:

```java
InitializationData initData = new InitializationData();
initData.properties = new com.zeroc.Ice.Properties(args);
initData.pluginFactories =
    java.util.List.of(new com.zeroc.IceLocatorDiscovery.PluginFactory());

try (Communicator communicator = new Communicator(initData)) {
    // Use the communicator.
}
```

Alternatively, you can install the IceLocatorDiscovery plug-in at runtime using configuration:

```config
Ice.Plugin.IceLocatorDiscovery=com.zeroc.IceLocatorDiscovery.PluginFactory
```

{% /language-section %}
