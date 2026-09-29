---
title: Installing a Plug-in using Configuration
---

A plug-in can be installed into a communicator using a [configuration property](../ice-plugin-properties) of the
following form:

```config

Ice.Plugin.Name=entry_point [arg ...]
```

Most plug-ins accept only one specific name, so make sure to use the plug-in’s name for _Name_.

{% language-section name="lang-1" /%}

The [Ice.Plugin.*](../ice-plugin-properties) property reference describes `entry_point` in greater detail.

After extracting the plug-in's entry point from the property value, any remaining text is parsed using semantics similar
to that of command-line arguments. Whitespace separates the arguments, and any arguments that contain whitespace must be
enclosed in quotes:

```config
Ice.Plugin.MyPlugin=entry_point --load "C:\Data Files\config.dat"
```

Ice passes these arguments to the plug-in during construction.

##### See Also

- [Ice.Plugin.*](../ice-plugin-properties)
- [Ice.PluginLoadOrder](../ice-properties)
