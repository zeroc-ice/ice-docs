{% language-section name="creating" %}

You create a communicator with the `Ice.Communicator` constructor:

```matlab
communicator = Ice.Communicator(args);
```

The constructor takes the command-line arguments and
[sets a property](../properties-and-configuration/setting-properties-on-the-command-line) for each argument that names
an Ice property. The constructor also accepts the `Properties` and `SliceLoader` name-value arguments; when you pass
both the command-line arguments and `Properties`, the properties set by the arguments override those in `Properties`.

The constructor leaves `args` unchanged. To get the remaining arguments, create the properties yourself and pass them to
the constructor:

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
