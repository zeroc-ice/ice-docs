{% language-section name="endpoint-list-syntax-2" %}

If you’re using C++ with a static build, you need to load this transport explicitly as follows:

```cpp
Ice::InitializationData initData;
initData.properties = Ice::createProperties(argc, argv);
initData.pluginFactories = {Ice::udpPluginFactory()};

Ice::CommunicatorPtr communicator = Ice::initialize(initData);
```

{% /language-section %}

{% language-section name="endpoint-list-syntax-3" %}

If you’re using C++ with a static build, you need to load the WebSocket transports (`ws` and `wss`) explicitly as
follows:

```cpp
Ice::InitializationData initData;
initData.properties = Ice::createProperties(argc, argv);
initData.pluginFactories = {Ice::wsPluginFactory()};

Ice::CommunicatorPtr communicator = Ice::initialize(initData);
```

{% /language-section %}

{% language-section name="endpoint-list-syntax-4" %}

If you’re using C++ with a static build, the WebSocket plug-in loaded above for `ws` endpoints provides `wss` as well.

{% /language-section %}

{% language-section name="endpoint-list-syntax-5" %}

A C++ application installs the iAP transport by adding its plug-in factory to the communicator's initialization data:

```cpp
Ice::InitializationData initData;
initData.properties = Ice::createProperties(argc, argv);
initData.pluginFactories = {Ice::iapPluginFactory()};

Ice::CommunicatorPtr communicator = Ice::initialize(initData);
```

{% /language-section %}
