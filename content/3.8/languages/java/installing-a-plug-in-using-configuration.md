---
id: installing-a-plug-in-using-configuration
language: java
---

{% language-section name="lang-1" %}
In Java, `entry_point` is an optional path to a JAR file containing the plug-in, followed by the name of the plug-in factory class that creates the plug-in.

For example:

```
Ice.Plugin.CustomLogger=com.example.clearsky.CustomLoggerPluginFactory logLevel=Debug
```

{% /language-section %}
