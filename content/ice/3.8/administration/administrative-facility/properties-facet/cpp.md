{% language-section name="mapping" %}

The servant that implements this facet is a
[NativePropertiesAdmin](https://code.zeroc.com/ice/3.8/api/cpp/classIce_1_1NativePropertiesAdmin.html). You can retrieve
this servant by calling `findAdminFacet`:

```cpp
// It's nullptr when the facet is not enabled
Ice::NativePropertiesAdminPtr propertiesAdmin =
    communicator->findAdminFacet<Ice::NativePropertiesAdmin>("Properties");
```

`addUpdateCallback` accepts a `std::function<void(const Ice::PropertyDict&)>` and returns a function that unregisters
the callback:

```cpp
auto removeCallback = propertiesAdmin->addUpdateCallback(
    [](const Ice::PropertyDict& changes) { /* Apply application settings. */ });
// When notifications are no longer needed:
removeCallback();
```

{% /language-section %}
