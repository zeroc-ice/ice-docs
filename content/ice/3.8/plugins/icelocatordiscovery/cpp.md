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

Link your application with the IceLocatorDiscovery library when using its factory directly. Dynamic loading requires its
shared library to be available to the operating system's library loader. When linking with the minimal static Ice
library, also add `Ice::udpPluginFactory()` to `pluginFactories`.

{% /language-section %}
