{% language-section name="mapping" %}

Implement the logger plug-in in C++ using `Ice::LoggerPlugin`, then load its shared library through configuration:

```config
Ice.Plugin.CustomLogger=customlogger,0:createCustomLoggerPlugin
```

With `customlogger,0`, Ice loads `customlogger0.dll` on Windows and `libcustomlogger.so.0` on Linux. See
[Ice.Plugin.name](../../property-reference/ice-plugin-properties) for the format of this entry point.

The factory creates the logger and passes it to the `Ice::LoggerPlugin` constructor, which installs it in the
communicator. The C++ version of this page shows the factory implementation.

{% /language-section %}
