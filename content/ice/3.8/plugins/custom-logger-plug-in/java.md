{% language-section name="mapping" %}

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

The `initialize` and `destroy` methods do nothing. The communicator takes ownership of the logger and closes it when the
communicator is destroyed.

Now, assuming you wrote a `CustomLogger` class that implements `com.zeroc.Ice.Logger`, you can create a plug-in factory
that creates a `LoggerPlugin` and installs your logger into the communicator:

```java
package com.example.clearsky;

import com.zeroc.Ice.Communicator;
import com.zeroc.Ice.LoggerPlugin;
import com.zeroc.Ice.Plugin;
import com.zeroc.Ice.PluginFactory;

public class CustomLoggerPluginFactory implements PluginFactory {
    @Override
    public String getPluginName() {
        return "CustomLogger";
    }

    @Override
    public Plugin create(Communicator communicator, String name, String[] args) {
        return new LoggerPlugin(communicator, new CustomLogger());
    }
}
```

Then, package your `CustomLogger` implementation and `CustomLoggerPluginFactory` in a JAR file, and configure your
communicator to load it at runtime. For example:

```config
Ice.Plugin.CustomLogger=customlogger.jar:com.example.clearsky.CustomLoggerPluginFactory
```

{% callout type="note" %}

Even though you didn’t implement the plug-in class (`LoggerPlugin`), you are in effect creating a new plug-in since you
choose the logger given to the `LoggerPlugin` constructor. As a result, you can pick any name for the plug-in factory
and the plug-in itself.

{% /callout %}

{% /language-section %}
