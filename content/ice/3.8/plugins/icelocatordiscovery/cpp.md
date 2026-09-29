{% language-section name="lang-1" %}

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

The IceLocatorDiscovery library is always included in or linked with the Ice C++ support library you’re using.

In order to load the IceLocatorDiscovery plug-in into your communicator, set the property
`Ice.Plugin.IceLocatorDiscovery` to `1`:

```config
Ice.Plugin.IceLocatorDiscovery=1
```

{% /language-section %}
