---
title: Plug-in API
---

# The `Plugin` Base Class

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

- Construction The Ice runtime creates the plug-in using a factory function (described below). During construction, a
  plug-in can acquire resources but must not spawn new threads or perform activities that depend on other plug-ins.

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

# Plug-in Factory Function

In C++, a plug-in factory is a function with the following signature:

```cpp
using PluginFactoryFunc = Plugin* (*)(const CommunicatorPtr& communicator,
                                      const std::string& name,
                                      const StringSeq& args);
```

You can choose any name for the factory function of your plug-in. If you want to load this plug-in at runtime, you will
need to provide this name in configuration files and you should use a function with C linkage to avoid name-mangling.
For example:

```cpp
extern "C" Ice::Plugin* createPlugin(
    const Ice::CommunicatorPtr& communicator,
    const std::string& name,
    const Ice::StringSeq& args);
```

The arguments to the function consist of the communicator that is in the process of being initialized, the name assigned
to the plug-in, and any arguments that were specified in the [plug-in's configuration](../ice-plugin-properties).

The Ice runtime is responsible for deleting the plug-in returned by this factory function. This usually occurs when the
communicator is destroyed, immediately after all the plug-ins have been destroyed.

# Loading a Plug-in using InitializationData

When your application depends on a plug-in, you should load this plug-in into your communicator by adding a factory for
this plug-in to the `pluginFactories` field of your communicator’s `InitializationData`.

For example:

```cpp
// My application relies on the IceDiscovery plug-in, so I always load it.
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
    PluginFactoryFunc factoryFunc;
};
```

Plug-ins that are installed in the communicator via `pluginFactories` are created before the plug-ins registered via
configuration.

##### See Also

- [Plug-in Configuration](../installing-a-plug-in-using-configuration)
- [Ice.Plugin.*](../ice-plugin-properties)
