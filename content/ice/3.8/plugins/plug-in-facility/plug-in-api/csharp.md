---
title: Plug-in API
---

## The `Plugin` Interface

A C# plug-in is an instance of a class that implements the `Ice.Plugin` interface:

```csharp
namespace Ice;

public interface Plugin
{
    void initialize();
    void destroy();
}
```

A plug-in object's lifecycle consists of four phases:

- **Construction.** Ice calls the plug-in factory during communicator initialization. Acquire resources here, but defer
  starting threads and using other plug-ins until `initialize`.
- **Initialization.** After constructing all plug-ins, Ice calls `initialize` in construction order. Factories in
  `InitializationData.pluginFactories` run in list order, followed by plug-ins loaded through configuration. Use
  [Ice.PluginLoadOrder](../ice-properties#ice.pluginloadorder) to order the latter. A plug-in can use another plug-in
  after that plug-in has initialized.
- **Active use.** The plug-in provides its services until the communicator is destroyed. Its implementation must handle
  concurrent calls when multiple threads use these services.
- **Destruction.** When the communicator is destroyed, Ice calls `destroy` in reverse initialization order.

If `initialize` fails, Ice calls `destroy` on the plug-ins that initialized successfully, in reverse order, and reports
`PluginInitializationException`. Ice preserves this exception when the plug-in throws it directly and wraps other
exceptions. The failing plug-in must clean up resources acquired by its failed initialization; Ice does not call its
`destroy` method. A plug-in that only reached construction must also arrange to release its resources.

## Plug-in Factory

In C#, a plug-in factory is a class that implements the `PluginFactory` interface:

```csharp
namespace Ice;

public interface PluginFactory
{
    string pluginName { get; }

    Plugin create(Communicator communicator, string name, string[] args);
}
```

The arguments to the create method consist of the communicator that is in the process of being initialized, the name
assigned to the plug-in, and any arguments that were specified in the
[plug-in's configuration](../ice-plugin-properties).

The `pluginName` is the default and preferred name of this plug-in. It’s the name used by Ice when it creates a plug-in
configured using `InitializationData.pluginFactories` (see below).

## Loading a Plug-in using InitializationData

When your application depends on a plug-in, you should load this plug-in into your communicator by adding a factory for
this plug-in to the `pluginFactories` field of your communicator’s `InitializationData`.

For example:

```csharp
var initData = new Ice.InitializationData
{
    properties = new Ice.Properties(ref args),
    pluginFactories = [new IceDiscovery.PluginFactory()]
};

await using Ice.Communicator communicator = Ice.Util.initialize(initData);
```

`pluginFactories` is a list of `PluginFactory`.

Ice uses each factory's preferred name and creates the plug-ins in list order, before the plug-ins loaded through
configuration. A matching `Ice.Plugin.Name` property can supply arguments: use `1` as the entry-point token when
providing the factory yourself. Ice passes the remaining arguments to the factory. For example:

```config
Ice.Plugin.MyPlugin=1 arg1 arg2
```

Keep these names out of `Ice.PluginLoadOrder`: including a plug-in already installed through `pluginFactories` causes
communicator initialization to fail with `PluginInitializationException`.

## Managing Plug-ins

Call `getPluginManager` on the communicator to obtain its `PluginManager`. The manager provides these operations:

| Operation                 | Behavior                                                                                                                                       |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `getPlugins()`            | Return the names of installed plug-ins.                                                                                                        |
| `getPlugin(name)`         | Return the named plug-in, or throw `NotRegisteredException` if the name is unknown.                                                            |
| `addPlugin(name, plugin)` | Register an existing plug-in instance, or throw `AlreadyRegisteredException` if the name is in use. This operation does not call `initialize`. |
| `initializePlugins()`     | Initialize the installed plug-ins in registration order. Calling it after successful initialization throws `InitializationException`.          |

To configure a plug-in through its own API before initialization, set
[Ice.InitPlugins](../ice-properties#ice.initplugins) to `0`. Create the communicator, obtain the plug-in with
`getPlugin`, configure it, and then call `initializePlugins`. You can also call `addPlugin` before `initializePlugins`
to include an application-created instance in initialization and destruction. If you add a plug-in after automatic
initialization, initialize that instance yourself.

Destroy the communicator to destroy its plug-ins. If you defer initialization and never call `initializePlugins`, Ice
does not call their `destroy` methods.

## See Also

- [Plug-in Configuration](../installing-a-plug-in-using-configuration)
- [Ice.Plugin.*](../ice-plugin-properties)
