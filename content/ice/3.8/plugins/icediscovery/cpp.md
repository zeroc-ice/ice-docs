{% language-section name="lang-1" %}

You should install `IceDiscovery` in your communicator using the `pluginFactories` field of `InitializationData`:

```cpp
#include <IceDiscovery/IceDiscovery.h>

Ice::InitializationData initData;
initData.properties = Ice::createProperties(argc, argv);
initData.pluginFactories = {IceDiscovery::discoveryPluginFactory()};

Ice::CommunicatorPtr communicator = Ice::initialize(initData);
```

Alternatively, you can install the IceDiscovery plug-in at runtime using configuration:

```
Ice.Plugin.IceDiscovery=IceDiscovery:createIceDiscovery
```

The IceDiscovery library is always included in or linked with the Ice C++ support library you’re using.

In order to load the IceDiscovery plug-in into your communicator, set the property `Ice.Plugin.IceDiscovery` to `1`:

```
Ice.Plugin.IceDiscovery=1
```

{% /language-section %}
