{% language-section name="creating" %}

You create a communicator with the `Ice.Communicator` constructor:

```matlab
communicator = Ice.Communicator(args);
```

The constructor accepts an argument vector and parses the
[command-line options](../properties-and-configuration/setting-properties-on-the-command-line) that are relevant to the
Ice runtime into the properties of the new communicator. If anything goes wrong during initialization, it throws an
exception.

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

MATLAB clears `cleanup` when the function returns, which calls `destroy` on the communicator.

{% /language-section %}

{% language-section name="initialization-data" %}

The `Ice.Communicator` constructor accepts the fields of `InitializationData` as the `Properties` and `SliceLoader`
name-value arguments. When you pass both an argument vector and `Properties`, the Ice options in the argument vector
override these properties.

{% /language-section %}
