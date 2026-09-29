---
title: Ice.Plugin.*
---

{% iflang langs="js" %}

{% callout type="info" title="JavaScript" %}

Ice for JavaScript does not support the properties on this page. Setting any of them throws `PropertyException`.

{% /callout %}

{% /iflang %}

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

## Ice.Plugin._name_

{% /iflang %}

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

### Synopsis {% id="ice.plugin.name-synopsis" %}

`Ice.Plugin.name=path[,version]:function [args]`

### Description {% id="ice.plugin.name-description" %}

Defines a C++ plug-in to be installed during communicator initialization. The `path` and optional `version` components
are used to construct the path name of a DLL or shared library. If no version is supplied, the Ice version is used. The
`function` component is the name of a function with C linkage. For example, the entry point `MyPlugin,38:create` would
imply a shared library name of `libMyPlugin.so.38` on Linux, `libMyPlugin.38.dylib` on macOS, and `MyPlugin38.dll` on
Windows. Furthermore, if Ice is built on Windows with debugging, a `d` is automatically appended to the version (for
example, `MyPlugin38d.dll`).

Any arguments that follow the entry point are passed to the entry point function. For example:

```config
Ice.Plugin.MyPlugin=MyFactory,38:create arg1 arg2
```

Whitespace separates the arguments, and any arguments that contain whitespace must be enclosed in quotes.

The `path` component may optionally contain a relative or absolute path name, indicated by the presence of a path
separator (`/` or `\`). In this case, the last component of the path is used to construct the version-specific name of
the shared library or DLL. Consider this example:

```config
Ice.Plugin.MyPlugin=./MyFactory,38:create arg1 arg2
```

The use of a relative path means the Ice runtime looks in the current working directory for `libMyFactory.so.38` on
Linux, `libMyFactory.38.dylib` on macOS, or `MyFactory38.dll` on Windows.

If the `path` component contains spaces, the entire entry point must be enclosed in quotes:

```config
Ice.Plugin.MyPlugin="C:\Program Files\MyPlugin\MyFactory,38:create" arg1 arg2
```

If the `path` component does not include a leading path name, Ice delegates to the operating system to locate the shared
library or DLL, which typically means that the plug-in can reside in any of the directories in your shared library or
DLL search path.

{% iflang langs="cpp" %}

{% callout type="info" %}

The `Ice.Plugin.name` property can be used to configure a plug-in installed in the communicator using
`InitializationData::pluginFactories`. In this situation, the `path[,version]:function` component of the property value
is ignored. If `Ice.PluginLoadOrder` includes this plug-in's name, communicator initialization fails with a
`PluginInitializationException`.

{% /callout %}

{% /iflang %}

{% iflang langs="python,ruby,php,matlab,swift" %}

Ice includes the IceDiscovery and IceLocatorDiscovery plug-in factories in this mapping. A non-empty value for either
property enables the corresponding built-in factory; the entry-point token is ignored:

```config
Ice.Plugin.IceDiscovery=1
Ice.Plugin.IceLocatorDiscovery=1
```

Arguments after the first token are still passed to the factory. Ice creates these built-in plug-ins before dynamically
loaded plug-ins. If [Ice.PluginLoadOrder](../ice-properties#ice.pluginloadorder) includes an enabled built-in plug-in's
name, communicator initialization fails with a `PluginInitializationException`.

{% /iflang %}

{% /iflang %}

{% language-section name="lang-1" /%}
