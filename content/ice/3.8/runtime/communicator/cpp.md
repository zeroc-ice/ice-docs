{% language-section name="creating" %}

You create a communicator by calling `Ice::initialize`:

```cpp
#include <Ice/Ice.h>

int
main(int argc, char* argv[])
{
    Ice::CommunicatorPtr communicator = Ice::initialize(argc, argv);
    // ...
}
```

`initialize` takes `argc` by reference and the argument vector `argv`. It
[sets a property](../properties-and-configuration/setting-properties-on-the-command-line) for each argument that names
an Ice property, and removes these arguments from `argc` and `argv`.

{% /language-section %}

{% language-section name="after-destroying" %}

An `Ice::CommunicatorHolder` calls `destroy` on its communicator when it goes out of scope:

```cpp
Ice::CommunicatorPtr communicator = Ice::initialize(argc, argv);
Ice::CommunicatorHolder communicatorHolder{communicator};
```

To take over the destruction of the communicator held by a `CommunicatorHolder`, call `release`.

{% /language-section %}

{% language-section name="initialization-data" %}

`initialize` takes either the command-line arguments or an `InitializationData`. To set properties from the arguments
when you pass initialization data, create the properties from `argc` and `argv` and set them in the initialization data:

```cpp
Ice::InitializationData initData;
initData.properties = std::make_shared<Ice::Properties>(argc, argv);
// ... set other initData fields ...
Ice::CommunicatorPtr communicator = Ice::initialize(std::move(initData));
```

{% /language-section %}
