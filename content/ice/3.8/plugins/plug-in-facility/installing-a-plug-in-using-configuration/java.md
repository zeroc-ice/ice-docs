{% language-section name="mapping" %}

In Java, `entry_point` names a public plug-in factory class that implements `com.zeroc.Ice.PluginFactory` and has a
public no-argument constructor. An optional JAR or class-directory path precedes the class name, separated by a colon.
Without a path, Ice uses its configured class loaders to find the class.

For example:

```config
Ice.Plugin.CustomLogger=com.example.clearsky.CustomLoggerPluginFactory logLevel=Debug
```

{% /language-section %}
