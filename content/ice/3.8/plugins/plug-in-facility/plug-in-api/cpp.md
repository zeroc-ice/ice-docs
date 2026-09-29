---
title: Plug-in API
---

## The `Plugin` Base Class

A C++ plug-in is an instance of a class that implements the `Ice::Plugin` abstract base class:

```cpp
namespace Ice
{
    class Plugin
    {
    public:
        virtual ~Plugin();
        virtual void initialize() = 0;
        virtual void destroy() = 0;
    };
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

## Plug-in Factory Function

In C++, a plug-in factory is a function with the following signature:

```cpp
using PluginFactoryFunc = Ice::Plugin* (*)(const Ice::CommunicatorPtr& communicator,
                                          const std::string& name,
                                          const Ice::StringSeq& args);
```

You can choose any name for the factory function of your plug-in. If you want to load this plug-in at runtime, you will
need to export this function from the library and provide its name in configuration. Use C linkage to avoid
name-mangling. For example:

```cpp
extern "C" ICE_DECLSPEC_EXPORT Ice::Plugin* createPlugin(
    const Ice::CommunicatorPtr& communicator,
    const std::string& name,
    const Ice::StringSeq& args);
```

The arguments to the function consist of the communicator that is in the process of being initialized, the name assigned
to the plug-in, and any arguments that were specified in the [plug-in's configuration](../ice-plugin-properties).

Ice takes ownership of the returned pointer in a `std::shared_ptr<Ice::Plugin>`. Communicator destruction calls the
plug-in's `destroy` method and releases Ice's reference. A reference held by the application can keep the C++ object
alive after this call.

## Loading a Plug-in Using InitializationData

When your application depends on a plug-in, you should load this plug-in into your communicator by adding a factory for
this plug-in to the `pluginFactories` field of your communicator’s `InitializationData`.

For example:

```cpp
#include <Ice/Ice.h>
#include <IceDiscovery/IceDiscovery.h>

Ice::InitializationData initData;
initData.properties = Ice::createProperties(argc, argv);
initData.pluginFactories = {IceDiscovery::discoveryPluginFactory()};

Ice::CommunicatorPtr communicator = Ice::initialize(initData);
```

`pluginFactories` is a vector of:

```cpp
struct PluginFactory
{
    /// The default and preferred name for plug-ins created by this factory.
    std::string pluginName;

    /// The factory function.
    Ice::PluginFactoryFunc factoryFunc;
};
```

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

## Transport Factories and Static Linking

The Ice C++ shared library includes the TCP, SSL, UDP, and WebSocket transports automatically. When linking with the
minimal static Ice library, add `Ice::udpPluginFactory()` or `Ice::wsPluginFactory()` to `pluginFactories` for the UDP
or WebSocket transports you need. The static library includes TCP and SSL automatically. An IceDiscovery or
IceLocatorDiscovery plug-in needs UDP, so include `Ice::udpPluginFactory()` when using either with this static library.

## See Also

- [Plug-in Configuration](../installing-a-plug-in-using-configuration)
- [Ice.Plugin.*](../ice-plugin-properties)
