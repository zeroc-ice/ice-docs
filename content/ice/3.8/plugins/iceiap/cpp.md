---
id: iceiap
language: cpp
---

{% language-section name="lang-1" %}

The IceIAP plug-in is included in all builds of the Ice C++ library for iOS. You enable (“load”) the plug-in by adding
it to the `pluginFactories` field of `InitializationData`:

```cpp
Ice::InitializationData initData;
initData.properties = Ice::createProperties(argc, argv);
initData.pluginFactories = {Ice::iapPluginFactory()};

Ice::CommunicatorPtr communicator = Ice::initialize(initData);
```

{% /language-section %}
