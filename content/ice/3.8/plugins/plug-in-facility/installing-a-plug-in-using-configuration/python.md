{% language-section name="mapping" %}

This mapping loads C++ plug-ins. The entry point names a shared library or DLL and its exported factory function:

```config
Ice.Plugin.CustomLogger=customlogger,0:createCustomLoggerPlugin
```

With `customlogger,0`, Ice loads `customlogger0.dll` on Windows, `libcustomlogger.so.0` on Linux, and
`libcustomlogger.0.dylib` on macOS. See [Ice.Plugin.name](../../../property-reference/ice-plugin-properties) for the
format of this entry point.

For the included discovery plug-ins, use `Ice.Plugin.IceDiscovery=1` or `Ice.Plugin.IceLocatorDiscovery=1` to enable the
corresponding built-in factory.

{% /language-section %}
