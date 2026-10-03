{% language-section name="mapping" %}

You should install `IceDiscovery` in your communicator using the `pluginFactories` field of `InitializationData`:

```cpp
#include <IceDiscovery/IceDiscovery.h>

Ice::InitializationData initData;
initData.properties = Ice::createProperties(argc, argv);
initData.pluginFactories = {IceDiscovery::discoveryPluginFactory()};

Ice::CommunicatorPtr communicator = Ice::initialize(initData);
```

Alternatively, you can install the IceDiscovery plug-in at runtime using configuration:

```config
Ice.Plugin.IceDiscovery=IceDiscovery:createIceDiscovery
```

When you use `pluginFactories`, link your application with the IceDiscovery library.

{% callout type="note" %}

The static Ice library registers only the TCP and SSL transports by default. When you link with this library, also add
`Ice::udpPluginFactory()` to `pluginFactories`.

{% /callout %}

{% /language-section %}
