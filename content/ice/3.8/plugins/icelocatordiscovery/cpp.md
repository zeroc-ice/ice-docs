{% language-section name="mapping" %}

When you write a client, you should install `IceLocatorDiscovery` in your communicator using the `pluginFactories` field
of `InitializationData`:

```cpp
#include <IceLocatorDiscovery/IceLocatorDiscovery.h>

Ice::InitializationData initData;
initData.properties = Ice::createProperties(argc, argv);
initData.pluginFactories = {IceLocatorDiscovery::locatorDiscoveryPluginFactory()};

Ice::CommunicatorPtr communicator = Ice::initialize(initData);
```

Alternatively, you can install the IceLocatorDiscovery plug-in at runtime using configuration:

```config
Ice.Plugin.IceLocatorDiscovery=IceLocatorDiscovery:createIceLocatorDiscovery
```

When you use `pluginFactories`, link your application with the IceLocatorDiscovery library.

{% callout type="note" %}

The static Ice library registers only the TCP and SSL transports by default. When you link with this library, also add
`Ice::udpPluginFactory()` to `pluginFactories`.

{% /callout %}

{% /language-section %}
