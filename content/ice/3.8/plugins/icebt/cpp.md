{% language-section name="lang-1" %}

You should install IceBT in your communicator using the `pluginFactories` field of `InitializationData`:

```cpp
#include <IceBT/IceBT.h>

Ice::InitializationData initData;
initData.properties = Ice::createProperties(argc, argv);
initData.pluginFactories = {IceBT::btPluginFactory()};

Ice::CommunicatorPtr communicator = Ice::initialize(initData);
```

Alternatively, you can install the IceBT plug-in at runtime using configuration:

```
# Linux only
Ice.Plugin.IceBT=IceBT:createIceBT
```

{% /language-section %}

{% language-section name="lang-2" %}

{% /language-section %}

{% language-section name="lang-3" %}

On Linux, the IceBT plug-in provides a C++ API for device discovery:

```cpp
namespace IceBT
{
    using PropertyMap = std::map<std::string, std::string>;

    class Plugin : public Ice::Plugin
    {
    public:
        void startDiscovery(
            const std::string& address,
            std::function<void(const std::string& addr,
                               const PropertyMap& props)> cb);

        void stopDiscovery(const std::string& address);
        ...
    };
}
```

An application must implement a callback function pass it to `startDiscovery`:

```cpp
#include <IceBT/IceBT.h>
...

CommunicatorPtr communicator = ...
auto plugin = communicator->getPluginManager()->getPlugin("IceBT");
auto btplugin = dynamic_pointer_cast<IceBT::Plugin>(plugin);
btplugin->startDiscovery(
   "",
   [](const std::string& addr, const PropertyMap& props) { ... });
```

For each nearby device discovered by the Bluetooth stack, the plug-in will invoke the provided callback. The arguments
to the callback are the Bluetooth address of the nearby device and a string map of properties containing metadata about
that device. As shown in the example above, the application can pass an empty string to `startDiscovery` and the plug-in
will use the default Bluetooth adapter. Otherwise, the application can pass the device address of the desired adapter.

Discovery will continue until `stopDiscovery` is called or a Bluetooth connection is initiated.

{% /language-section %}
