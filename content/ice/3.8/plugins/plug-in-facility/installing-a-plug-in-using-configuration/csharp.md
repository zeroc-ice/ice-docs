{% language-section name="mapping" %}

In C#, `entry_point` names an assembly and a plug-in factory class, separated by a colon. The assembly can be an
assembly name or a file path. The factory class must implement `Ice.PluginFactory` and provide a public parameterless
constructor.

For example:

```config
Ice.Plugin.CustomLogger=CustomLogger.dll:ClearSky.CustomLoggerPluginFactory logLevel=Debug
```

{% /language-section %}
