---
title: Installing a Plug-in Using Configuration
---

A plug-in can be installed into a communicator using a
[configuration property](../../../property-reference/ice-plugin-properties) of the following form:

```config
Ice.Plugin.Name=entry_point [arg ...]
```

Most plug-ins accept only one specific name, so make sure to use the plug-in’s name for _Name_.

{% language-section name="mapping" /%}

The [Ice.Plugin.*](../../../property-reference/ice-plugin-properties) property reference describes `entry_point` in
greater detail.

After extracting the plug-in's entry point from the property value, any remaining text is parsed using semantics similar
to that of command-line arguments. Whitespace separates the arguments, and any arguments that contain whitespace must be
enclosed in quotes:

```config
Ice.Plugin.MyPlugin=entry_point --load "C:\Data Files\config.dat"
```

Ice converts arguments of the form `--Name.Property=value` into communicator properties and removes them from the
argument list. It passes the remaining arguments to the plug-in factory during construction. For example:

```config
Ice.Plugin.MyPlugin=entry_point --MyPlugin.Mode=fast input.dat
```

The factory receives `input.dat` in its arguments and can read `MyPlugin.Mode` from the communicator's properties.

## See Also

- [Ice.Plugin.*](../../../property-reference/ice-plugin-properties)
