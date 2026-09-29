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

```config
Ice.Plugin.IceDiscovery=IceDiscovery:createIceDiscovery
```

Link your application with the IceDiscovery library when using its factory directly. Dynamic loading requires its shared
library to be available to the operating system's library loader. When linking with the minimal static Ice library, also
add `Ice::udpPluginFactory()` to `pluginFactories`.

{% /language-section %}
