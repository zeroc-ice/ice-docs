---
title: Plug-in API
---

# The `Plugin` Interface

A Java plug-in is an instance of a class that implements the `com.zeroc.Ice.Plugin` interface:

```java
package com.zeroc.Ice;

public interface Plugin {
    void initialize();
    void destroy();
}
```

A plug-in object's lifecycle consists of four phases:

- Construction The Ice runtime creates the plug-in using a factory (described below). During construction, a plug-in can
  acquire resources but must not spawn new threads or perform activities that depend on other plug-ins.

- Initialization After all plug-ins have been constructed, the Ice runtime invokes `initialize` on each plug-in. The
  order in which plug-ins are initialized is undefined by default but can be customized using the
  [Ice.PluginLoaderOrder](../ice-properties) property. If a plug-in has a dependency on another plug-in, you must
  configure the Ice runtime so that initialization occurs in the proper order. In this phase it is safe for a plug-in to
  spawn new threads; it is also safe for a plug-in to interact with other plug-ins and use their services, as long as
  those plug-ins have already been initialized. If `initialize` throws an exception, the Ice runtime invokes `destroy`
  on all plug-ins that were successfully initialized (in the reverse order of initialization) and throws the original
  exception to the application.

- Active The active phase spans the time between initialization and destruction. Plug-ins must be designed to operate
  safely in the context of multiple threads.

- Destruction The Ice runtime invokes `destroy` on each plug-in in the reverse order of initialization.

This lifecycle is repeated for each new communicator that an application creates and destroys.

# Plug-in Factory

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
[plug-in's configuration](../ice-plugin-properties).

The `pluginName` is the default and preferred name of this plug-in. It’s the name used by Ice when it creates a plug-in
configured using `InitializationData.pluginFactories` (see below).

# Loading a Plug-in using InitializationData

When your application depends on a plug-in, you should load this plug-in into your communicator by adding a factory for
this plug-in to the `pluginFactories` field of your communicator’s `InitializationData`.

For example:

```java
// My application relies on the IceDiscovery plug-in, so I always load it.
InitializationData initData = new InitializationData();
initData.pluginFactories =
    Collections.singletonList(new com.zeroc.IceDiscovery.PluginFactory());

try (Communicator communicator = Util.initialize(initData)) {
    ....
}
```

`pluginFactories` is a list of `com.zeroc.Ice.PluginFactory`.

Plug-ins that are installed in the communicator via `pluginFactories` are created before the plug-ins registered via
configuration.

##### See Also

- [Plug-in Configuration](../installing-a-plug-in-using-configuration)
- [Ice.Plugin.*](../ice-plugin-properties)
