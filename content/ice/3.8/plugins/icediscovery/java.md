{% language-section name="mapping" %}

You should install `IceDiscovery` in your communicator using the `pluginFactories` field of `InitializationData`:

```java
InitializationData initData = new InitializationData();
initData.properties = new com.zeroc.Ice.Properties(args);
initData.pluginFactories =
    java.util.List.of(new com.zeroc.IceDiscovery.PluginFactory());

try (Communicator communicator = new Communicator(initData)) {
    // Use the communicator.
}
```

Alternatively, you can install the IceDiscovery plug-in at runtime using configuration:

```config
Ice.Plugin.IceDiscovery=com.zeroc.IceDiscovery.PluginFactory
```

{% /language-section %}
