---
title: Plug-in API
---

## The `Plugin` Interface

A Java plug-in is an instance of a class that implements the `com.zeroc.Ice.Plugin` interface:

```java
package com.zeroc.Ice;

public interface Plugin {
    void initialize();
    void destroy();
}
```

A plug-in object's lifecycle consists of four phases:

- **Construction.** Ice calls the plug-in factory during communicator initialization. Acquire resources here, but defer
  starting threads and using other plug-ins until `initialize`.
- **Initialization.** After constructing all plug-ins, Ice calls `initialize` in construction order. Factories in
  `InitializationData.pluginFactories` run in list order, followed by plug-ins loaded through configuration. Use
  [Ice.PluginLoadOrder](../../../property-reference/ice-properties#ice.pluginloadorder) to order the latter. A plug-in
  can use another plug-in after that plug-in has initialized.
- **Active use.** The plug-in provides its services until the communicator is destroyed. Its implementation must handle
  concurrent calls when multiple threads use these services.
- **Destruction.** When the communicator is destroyed, Ice calls `destroy` in reverse initialization order.

If the `initialize` method of a plug-in throws an exception, communicator initialization fails with
`PluginInitializationException`. Ice does not call `destroy` on this plug-in: `initialize` must release the resources it
acquired before throwing.

## Plug-in Factory

In Java, a plug-in factory is a class that implements the `PluginFactory` interface:

```java
package com.zeroc.Ice;

public interface PluginFactory {
    String getPluginName();
    Plugin create(Communicator communicator, String name, String[] args);
}
```

The arguments to the create method consist of the communicator that is in the process of being initialized, the name
assigned to the plug-in, and any arguments that were specified in the
[plug-in's configuration](../../../property-reference/ice-plugin-properties).

Ice uses the value returned by `getPluginName()` as the name of the plug-in when it creates a plug-in configured using
`InitializationData.pluginFactories` (see below).

## Loading a Plug-in Using InitializationData

When your application depends on a plug-in, you should load this plug-in into your communicator by adding a factory for
this plug-in to the `pluginFactories` field of your communicator’s `InitializationData`.

For example:

```java
InitializationData initData = new InitializationData();
initData.properties = new com.zeroc.Ice.Properties(args);
initData.pluginFactories =
    java.util.List.of(new com.zeroc.IceDiscovery.PluginFactory());

try (Communicator communicator = new Communicator(initData)) {
    // Use the communicator.
}
```

`pluginFactories` is a list of `com.zeroc.Ice.PluginFactory`.

Ice creates the plug-ins in list order, each with the name given by its factory, before the plug-ins loaded through
configuration. To pass arguments to one of these plug-ins, set the `Ice.Plugin.Name` property, where `Name` is the
plug-in's name. Ice ignores the first token of the value, which holds the entry point of a plug-in loaded through
configuration, and passes the remaining tokens to the factory. By convention, this first token is `1`. For example:

```config
Ice.Plugin.MyPlugin=1 arg1 arg2
```

## Managing Plug-ins

The plug-in manager of a communicator gives access to its plug-ins: call `getPluginManager` on the communicator, then
`getPlugin` with the name of the plug-in. See [PluginManager](https://code.zeroc.com/manual/Ice/PluginManager) in the
API reference.

To configure a plug-in through its own API before Ice initializes it, set
[Ice.InitPlugins](../../../property-reference/ice-properties#ice.initplugins) to `0`. Create the communicator, obtain
the plug-in with `getPlugin`, configure it, and then call `initializePlugins` on the plug-in manager.

## See Also

- [Plug-in Configuration](../installing-a-plug-in-using-configuration)
- [Ice.Plugin.*](../../../property-reference/ice-plugin-properties)
