{% language-section name="mapping" %}

In C++, you create a communicator by calling the C++ function `Ice::initialize`, for example:

```cpp
int
main(int argc, char* argv[])
{
    Ice::CommunicatorPtr communicator = Ice::initialize(argc, argv);
    // ...
}
```

`initialize` accepts a C++ reference to `argc` and an argument vector `argv`. The function scans the argument vector for
any [command-line options](../../properties-and-configuration/setting-properties-on-the-command-line) that are relevant
to the Ice runtime; any such options are removed from the argument vector so, when `initialize` returns, the only
options and arguments remaining are those that concern your application. If anything goes wrong during initialization,
`initialize` throws an exception.

{% callout type="warning" %}

The other `initialize`
[overload](https://code.zeroc.com/ice/3.8/api/cpp/namespaceIce.html#r_ae7b6bf9c35f1cb30463e15c4d9b4ad4c) accepts an
[InitializationData](api:Ice/InitializationData) to pass other information to the Ice runtime. To combine this
information with the argument vector, create the communicator's properties from `argc` and `argv`:

```cpp
Ice::InitializationData initData;
initData.properties = std::make_shared<Ice::Properties>(argc, argv);
// ... set other initData fields ...
Ice::CommunicatorPtr communicator = Ice::initialize(std::move(initData));
```

{% /callout %}

When you're done with a communicator, call `destroy` on it. `destroy` destroys the communicator's object adapters,
closes its outgoing connections, and waits for all outstanding dispatches to complete before returning.

An `Ice::CommunicatorHolder` destroys the communicator it holds when it goes out of scope, including when the
application throws an exception:

```cpp
#include <Ice/Ice.h>

int
main(int argc, char* argv[])
{
    try
    {
        Ice::CommunicatorPtr communicator = Ice::initialize(argc, argv);
        Ice::CommunicatorHolder communicatorHolder{communicator};

        // ... application code ...
    }
    catch (const std::exception& e)
    {
        std::cerr << e.what() << std::endl;
        return 1;
    }
    return 0;
}
```

### Explicit Lifetime Management

Without a `CommunicatorHolder`, your application calls `destroy` in every path, including when it throws an exception:

```cpp
Ice::CommunicatorPtr communicator = Ice::initialize(argc, argv);
try
{
    // ... application code ...
}
catch (...)
{
    communicator->destroy();
    throw;
}
communicator->destroy();
```

To take over the destruction of a communicator that a `CommunicatorHolder` holds, call `release`: it returns the
communicator and empties the holder, whose destructor then no longer destroys it.

{% /language-section %}
