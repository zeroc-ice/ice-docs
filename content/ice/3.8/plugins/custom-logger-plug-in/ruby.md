{% language-section name="mapping" %}

Implement the logger plug-in in C++ using `Ice::LoggerPlugin`, then load its shared library through configuration:

```config
Ice.Plugin.CustomLogger=customlogger,0:createCustomLoggerPlugin
```

The factory creates the logger and passes it to the `Ice::LoggerPlugin` constructor, which installs it in the
communicator. The C++ version of this page shows the factory implementation.

{% /language-section %}
