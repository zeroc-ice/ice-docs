---
id: ice-plugin-properties
language: csharp
---

{% language-section name="lang-1" %}

#### Synopsis

`Ice.Plugin.name=assembly:class [args]`

#### Description

Defines a C# plug-in to be installed during communicator initialization. The `assembly` component can be a partially or fully qualified assembly name, or an assembly path name.

The details on how assemblies are load depends on how you define the `assembly` component:

| **Value for**`assembly` | **Examples** | **Description** |
| --- | --- | --- |
| Assembly name | `myplugin,Version=...,Culture=neutral,publicKeyToken=...``myplugin` | The assembly name can be a fully or partially qualified assembly name. The assembly is loaded using [Assembly.Load](https://learn.microsoft.com/en-us/dotnet/api/system.reflection.assembly.load?view=netframework-4.5.1). |
| Assembly path name | `MyPlugin.dll``plugins\MyPlugin.dll``C:\plugins\MyPlugin.dll` | The path name can be an absolute path name or a path name relative to the application's current working directory. The assembly is loaded using [Assembly.LoadFrom](https://learn.microsoft.com/en-us/dotnet/api/system.reflection.assembly.loadfrom?view=netframework-4.5.1). |

The specified `class` must implement the [PluginFactory](https://code.zeroc.com/ice/3.8/api/csharp/api/Ice.PluginFactory.html) interface. Any arguments that follow the class name are passed to the factory's `create` method. For example:

```
Ice.Plugin.MyPlugin=MyFactory,Version=1.2.3.4:MyFactory arg1 arg2
```

Whitespace separates the arguments, and any arguments that contain whitespace must be enclosed in quotes.

If you specify a relative path name in the entry point, the assembly is located relative to the program's current working directory:

```
Ice.Plugin.MyPlugin=..\MyFactory.dll:MyFactory arg1 arg2
```

Enclose the assembly's path name in quotes if it contains spaces:

```
Ice.Plugin.MyPlugin="C:\Program Files\MyPlugin\MyFactory.dll:MyFactory" arg1 arg2
```

{% callout type="info" %}
A full qualified assembly name or a partial qualified assembly name in the plug-in entry point only works when the assembly is listed in the application dependencies file.
{% /callout %}
{% /language-section %}
