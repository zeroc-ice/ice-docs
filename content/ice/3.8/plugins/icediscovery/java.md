---
id: icediscovery
language: java
---

{% language-section name="lang-1" %}

You should install `IceDiscovery` in your communicator using the `pluginFactories` field of `InitializationData`:

```java
InitializationData initData = new InitializationData();
initData.pluginFactories =
    Collections.singletonList(new com.zeroc.IceDiscovery.PluginFactory());

try (Communicator communicator = Util.initialize(args)) {
    ....
}
```

Alternatively, you can install the IceDiscovery plug-in at runtime using configuration:

```
Ice.Plugin.IceDiscovery=IceDiscovery:com.zeroc.IceDiscovery.PluginFactory
```

{% /language-section %}
