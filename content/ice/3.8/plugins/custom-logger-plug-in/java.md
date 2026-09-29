{% language-section name="lang-1" %}

Ice provides a plug-in class, `com.zeroc.Ice.LoggerPlugin`, that installs a logger into the communicator in its
constructor:

```java
package com.zeroc.Ice;

public class LoggerPlugin implements Plugin
{
    public LoggerPlugin(Communicator communicator, Logger logger) {
       ...
    }

    @Override
    public void initialize() {}

    @Override
    public void destroy() {}
}
```

The implementation of `initialize` and `destroy` in `LoggerPlugin` are no-op.

Now, assuming you wrote a `CustomLogger` class that implements `com.zeroc.Ice.Logger`, you can easily create a plug-in
factory that creates a `LoggerPlugin` and installs your logger into the communicator:

```java
package com.example.clearsky;

public class CustomLoggerPluginFactory implements PluginFactory {
    @Override
    public String getPluginName {
        return "CustomLogger";
    }

    @Override
    public Plugin create(Communicator communicator, string name, string[] args) {
        return new LoggerPlugin(communicator, new CustomLogger());
    }
}
```

Then, package your `CustomLogger` implementation and `CustomLoggerPluginFactory` in a JAR file, and configure your
communicator to load it at runtime. For example:

```config
Ice.Plugin.CustomLogger=customlogger.jar:com.example.clearsky.CustomLoggerPluginFactory
```

{% callout type="info" %}

Even though you didn’t implement the plug-in class (`LoggerPlugin`), you are in effect creating a new plug-in since you
choose the logger given to the `LoggerPlugin` constructor. As a result, you can pick any name for the plug-in factory
and the plug-in itself.

{% /callout %}

{% /language-section %}
