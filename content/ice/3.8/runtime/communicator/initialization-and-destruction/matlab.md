{% language-section name="mapping" %}

You create a communicator with the `Ice.Communicator` constructor:

```matlab
communicator = Ice.Communicator(args);
```

The constructor accepts an argument vector and parses the
[command-line options](../../properties-and-configuration/setting-properties-on-the-command-line) that are relevant to
the Ice runtime into the properties of the new communicator. If anything goes wrong during initialization, it throws an
exception. The constructor also accepts the `Properties` and `SliceLoader` name-value arguments; when you pass both an
argument vector and `Properties`, the Ice options in the argument vector override these properties.

The constructor leaves `args` unchanged. To get the arguments that remain once the Ice options are removed, create the
properties yourself and pass them to the constructor:

```matlab
[props, remArgs] = Ice.Properties(args);
communicator = Ice.Communicator(Properties = props);
```

To destroy the communicator when the function that created it returns, schedule the call to `destroy` with `onCleanup`:

```matlab
cleanup = onCleanup(@() communicator.destroy());
```

MATLAB clears `cleanup` when the function returns, which calls `destroy` on the communicator. The `destroy` method is
responsible for cleaning up the communicator: it closes network connections and reclaims operating system resources,
such as file descriptors and memory.

{% /language-section %}
