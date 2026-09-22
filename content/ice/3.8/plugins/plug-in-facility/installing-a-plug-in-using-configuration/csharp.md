---
id: installing-a-plug-in-using-configuration
language: csharp
---

{% language-section name="lang-1" %}

In C#, `entry_point` is a path to the assembly containing the plug-in, and the name of the plug-in factory class in this
assembly.

For example:

```
Ice.Plugin.CustomLogger=CustomLogger.dll:ClearSky.CustomLoggerPluginFactory logLevel=Debug
```

{% /language-section %}
