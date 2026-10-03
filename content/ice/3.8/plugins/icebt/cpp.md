{% language-section name="installing-icebt" %}

You should install IceBT in your communicator using the `pluginFactories` field of `InitializationData`:

```cpp
#include <IceBT/IceBT.h>

Ice::InitializationData initData;
initData.properties = Ice::createProperties(argc, argv);
initData.pluginFactories = {IceBT::btPluginFactory()};

Ice::CommunicatorPtr communicator = Ice::initialize(initData);
```

Alternatively, you can install the IceBT plug-in at runtime using configuration:

```config
# Linux only
Ice.Plugin.IceBT=IceBT:createIceBT
```

{% /language-section %}

{% language-section name="using-icebt-2" %}

On Linux, `IceBT::Plugin` provides `startDiscovery`, `stopDiscovery`, and `getDevices`. Obtain this interface from the
communicator's plug-in manager:

```cpp
auto plugin = std::dynamic_pointer_cast<IceBT::Plugin>(
    communicator->getPluginManager()->getPlugin("IceBT"));
std::string adapterAddress = "01:23:45:67:89:AB";
plugin->startDiscovery(
    adapterAddress,
    [](const std::string& address, const IceBT::PropertyMap& properties)
    {
        // Record or display the discovered device.
    });
```

Replace `adapterAddress` with the address of a local Bluetooth adapter. Both `startDiscovery` and `stopDiscovery`
require that address.

The callback receives the remote device's Bluetooth address and an `IceBT::PropertyMap`, a string-to-string map of
metadata. The plug-in can report the same device more than once. Discovery continues until you stop it with
`plugin->stopDiscovery(adapterAddress)` or the Bluetooth service stops it. Stopping discovery removes the callbacks
registered for that adapter.

`plugin->getDevices()` returns a snapshot of all known remote devices as an `IceBT::DeviceMap`, keyed by Bluetooth
address. The plug-in reads the initial devices from the Bluetooth service at startup and updates its map as devices are
added or removed.

{% /language-section %}
