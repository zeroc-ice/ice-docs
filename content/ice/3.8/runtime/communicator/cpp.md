{% language-section name="creating" %}

You create a communicator by calling `Ice::initialize`, and give it to an `Ice::CommunicatorHolder`, which destroys it
at the end of the scope:

```cpp
#include <Ice/Ice.h>

int
main(int argc, char* argv[])
{
    Ice::CommunicatorPtr communicator = Ice::initialize(argc, argv);

    // Make sure the communicator is destroyed at the end of this scope.
    Ice::CommunicatorHolder communicatorHolder{communicator};

    // ...
}
```

`initialize` takes `argc` by reference and the argument vector `argv`. It
[sets a property](../properties-and-configuration/setting-properties-on-the-command-line) for each argument that names
an Ice property, and removes these arguments from `argc` and `argv`.

Without a `CommunicatorHolder`, call `destroy` on the communicator when you no longer need it. To take over the
destruction of the communicator of a `CommunicatorHolder`, call `release`.

{% /language-section %}

{% language-section name="initialization-data" %}

To combine initialization data with the command-line arguments, create the communicator's properties from `argc` and
`argv`:

```cpp
Ice::InitializationData initData;
initData.properties = std::make_shared<Ice::Properties>(argc, argv);
// ... set other initData fields ...
Ice::CommunicatorPtr communicator = Ice::initialize(std::move(initData));
Ice::CommunicatorHolder communicatorHolder{communicator};
```

{% /language-section %}
