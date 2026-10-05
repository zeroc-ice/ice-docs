{% language-section name="mapping" %}

In C++ and C++-based language mappings, `entry_point` consists of the path name of the shared library or DLL containing
the factory function, along with the name of the factory function.

For example:

```config
Ice.Plugin.CustomLogger=customlogger:createCustomLogger logLevel=Debug
```

{% /language-section %}
