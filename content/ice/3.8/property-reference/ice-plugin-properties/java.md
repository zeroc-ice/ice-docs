{% language-section name="lang-1" %}

#### Synopsis

`Ice.Plugin.name=[path:]class [args]`

#### Description

Defines a Java plug-in to be installed during communicator initialization. The specified class must implement the
[PluginFactory](https://code.zeroc.com/ice/3.8/api/java/com.zeroc.ice/com/zeroc/Ice/PluginFactory.html) interface. Any
arguments that follow the class name are passed to the `create` method. For example:

```
Ice.Plugin.MyPlugin=MyFactory arg1 arg2
```

Whitespace separates the arguments, and any arguments that contain whitespace must be enclosed in quotes.

If `path` is specified, it may be the path name of a JAR file or class directory, as shown below:

```
Ice.Plugin.MyPlugin=MyFactory.jar:MyFactory
Ice.Plugin.MyOtherPlugin=/classes:MyOtherFactory
```

If `path` contains spaces, it must be enclosed in quotes:

```
Ice.Plugin.MyPlugin="factory classes.jar":MyFactory
```

If `class` is specified without a path, Ice attempts to load the class using class loaders. See
[InitializationData.classLoader](https://code.zeroc.com/ice/3.8/api/java/com.zeroc.ice/com/zeroc/Ice/InitializationData.html#classLoader).

{% /language-section %}
