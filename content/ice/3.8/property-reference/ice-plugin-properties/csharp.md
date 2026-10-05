{% language-section name="mapping" %}

### Synopsis {% id="ice.plugin.name-synopsis" %}

`Ice.Plugin.name=assembly:class [args]`

### Description {% id="ice.plugin.name-description" %}

Defines a C# plug-in to be installed during communicator initialization. The `assembly` component can be a partially or
fully qualified assembly name, or an assembly path name.

The `assembly` component accepts these forms:

| Form          | Examples                                                                |
| ------------- | ----------------------------------------------------------------------- |
| Assembly name | `myplugin,Version=...,Culture=neutral,publicKeyToken=...` or `myplugin` |
| Assembly path | `MyPlugin.dll`, `plugins\MyPlugin.dll` or `C:\plugins\MyPlugin.dll`     |

The specified `class` must implement the
[PluginFactory](https://code.zeroc.com/ice/3.8/api/csharp/api/Ice.PluginFactory.html) interface.

Arguments of the form `--name.X=Y` set the property `name.X` to `Y` and are removed from the argument list passed to the
factory, where `name` is the plug-in name. For example, `--MyPlugin.Mode=fast` sets `MyPlugin.Mode=fast`.

Ice passes the remaining arguments to the factory's `create` method. For example:

```config
Ice.Plugin.MyPlugin=MyFactory,Version=1.2.3.4:MyFactory arg1 arg2
```

Whitespace separates the arguments, and any arguments that contain whitespace must be enclosed in quotes.

If you specify a relative path name in the entry point, the assembly is located relative to the program's current
working directory:

```config
Ice.Plugin.MyPlugin=..\MyFactory.dll:MyFactory arg1 arg2
```

Enclose the assembly's path name in quotes if it contains spaces:

```config
Ice.Plugin.MyPlugin="C:\Program Files\MyPlugin\MyFactory.dll:MyFactory" arg1 arg2
```

Assembly names use the
[.NET assembly-loading rules](https://learn.microsoft.com/en-us/dotnet/core/dependency-loading/loading-managed),
including already-loaded assemblies, probing paths and assembly-resolution callbacks.

{% /language-section %}
