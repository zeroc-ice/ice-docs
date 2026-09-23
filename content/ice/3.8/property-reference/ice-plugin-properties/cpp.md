{% language-section name="lang-1" %}

#### Synopsis

`Ice.Plugin.name=path[,version]:function [args]`

#### Description

Defines a C++ plug-in to be installed during communicator initialization. The `path` and optional `version` components
are used to construct the path name of a DLL or shared library. If no version is supplied, the Ice version is used. The
`function` component is the name of a function with C linkage. For example, the entry point `MyPlugin,38:create` would
imply a shared library name of `libMyPlugin.so.38` on Unix and `MyPlugin38.dll` on Windows. Furthermore, if Ice is built
on Windows with debugging, a `d` is automatically appended to the version (for example, `MyPlugin38d.dll`).

Any arguments that follow the entry point are passed to the entry point function. For example:

```
Ice.Plugin.MyPlugin=MyFactory,38:create arg1 arg2
```

Whitespace separates the arguments, and any arguments that contain whitespace must be enclosed in quotes.

The `path` component may optionally contain a relative or absolute path name, indicated by the presence of a path
separator (`/` or `\`). In this case, the last component of the path is used to construct the version-specific name of
the shared library or DLL. Consider this example:

```
Ice.Plugin.MyPlugin=./MyFactory,38:create arg1 arg2
```

The use of a relative path means the Ice runtime will look in the current working directory for `libMyPlugin.so.38` on
Unix or `MyPlugin38.dll` on Windows.

If the `path` component contains spaces, the entire entry point must be enclosed in quotes:

```
Ice.Plugin.MyPlugin="C:\Program Files\MyPlugin\MyFactory,38:create" arg1 arg2
```

If the `path` component does not include a leading path name, Ice delegates to the operating system to locate the shared
library or DLL, which typically means that the plug-in can reside in any of the directories in your shared library or
DLL search path.

{% callout type="info" %}

The `Ice.Plugin.name` property can be used to configure a plug-in installed in the communicator using
`InitializationData::pluginFactories`. In this situation, the `path[,version]:function` component of the property value
is ignored.

{% /callout %}

{% /language-section %}
