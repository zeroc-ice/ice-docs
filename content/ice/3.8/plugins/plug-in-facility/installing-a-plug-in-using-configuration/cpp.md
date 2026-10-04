{% language-section name="mapping" %}

In C++ and C++-based language mappings, `entry_point` consists of the path name of the shared library or DLL containing
the factory function, along with the name of the factory function.

For example:

```config
Ice.Plugin.CustomLogger=customlogger,0:createCustomLoggerPlugin logLevel=Debug
```

With `customlogger,0`, Ice loads `customlogger0.dll` on Windows, `libcustomlogger.so.0` on Linux, and
`libcustomlogger.0.dylib` on macOS. See [Ice.Plugin.name](../../../property-reference/ice-plugin-properties) for the
format of this entry point.

{% /language-section %}
