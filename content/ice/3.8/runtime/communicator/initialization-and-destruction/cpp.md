{% language-section name="mapping" %}

In C++, you create a communicator with `Ice::CommunicatorHolder`, which calls `Ice::initialize` with the arguments you
give it and destroys the communicator when the holder goes out of scope, including when your application throws an
exception:

```cpp
#include <Ice/Ice.h>

int
main(int argc, char* argv[])
{
    Ice::CommunicatorHolder communicatorHolder{argc, argv};
    auto proxy = communicatorHolder->stringToProxy("greeter:tcp -h localhost -p 4061");
    // ...
}
```

`Ice::initialize` accepts a C++ reference to `argc` and an argument vector `argv`. The function scans the argument
vector for any [command-line options](../../properties-and-configuration/setting-properties-on-the-command-line) that
are relevant to the Ice runtime; any such options are removed from the argument vector so, when `initialize` returns,
the only options and arguments remaining are those that concern your application. If anything goes wrong during
initialization, `initialize` throws an exception.

The other `initialize`
[overload](https://code.zeroc.com/ice/3.8/api/cpp/namespaceIce.html#r_ae7b6bf9c35f1cb30463e15c4d9b4ad4c) accepts an
[InitializationData](api:Ice/InitializationData). To combine it with the argument vector, create the communicator's
properties from `argc` and `argv`:

```cpp
Ice::InitializationData initData;
initData.properties = std::make_shared<Ice::Properties>(argc, argv);
// ... set other initData fields ...
Ice::CommunicatorHolder communicatorHolder{std::move(initData)};
```

`Ice::initialize` returns an `Ice::CommunicatorPtr`; if you call it directly, call `destroy` on the communicator when
you no longer need it. To take over the destruction of the communicator of a `CommunicatorHolder`, call `release`.

{% /language-section %}
