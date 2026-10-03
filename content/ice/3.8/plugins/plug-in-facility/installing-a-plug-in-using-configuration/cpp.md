{% language-section name="lang-1" %}

In C++ and C++-based language mappings, `entry_point` consists of the path name of the shared library or DLL containing
the factory function, along with the name of the factory function.

For example:

```config
Ice.Plugin.CustomLogger=customlogger,0:createCustomLoggerPlugin logLevel=Debug
```

With `customlogger,0`, Ice loads `customlogger0.dll` on Windows and `libcustomlogger.so.0` on Linux. See
[Ice.Plugin.name](../ice-plugin-properties) for the format of this entry point.

{% /language-section %}
