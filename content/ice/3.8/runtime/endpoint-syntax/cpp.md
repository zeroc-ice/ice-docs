{% language-section name="endpoint-list-syntax-2" %}

If you’re using C++ with a static build, you need to load this transport explicitly as follows:

```cpp
Ice::InitializationData initData;
initData.properties = Ice::createProperties(argc, argv);
initData.pluginFactories = {Ice::udpPluginFactory()};

Ice::CommunicatorPtr communicator = Ice::initialize(initData);
```

{% /language-section %}
