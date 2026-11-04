{% language-section name="mapping" %}

Ice provides a plug-in class, `com.zeroc.Ice.LoggerPlugin`, whose constructor installs the given logger into the
communicator; its `initialize` and `destroy` methods do nothing. The communicator takes ownership of the logger and
closes it when the communicator is destroyed.

Assuming you wrote a `CustomLogger` class that implements `com.zeroc.Ice.Logger`, you can create a plug-in factory that
creates a `LoggerPlugin` and installs your logger into the communicator:

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

{% /language-section %}
