{% language-section name="mapping" %}

You implement a logger plug-in in C++, as shown in the [C++ version of this page](../custom-logger-plug-in?lang=cpp),
and load its shared library through configuration:

```config
Ice.Plugin.CustomLogger=customlogger,0:createCustomLoggerPlugin
```

With `customlogger,0`, Ice loads `customlogger0.dll` on Windows, `libcustomlogger.so.0` on Linux, and
`libcustomlogger.0.dylib` on macOS. See [Ice.Plugin.name](../../property-reference/ice-plugin-properties) for the format
of this entry point.

{% /language-section %}
