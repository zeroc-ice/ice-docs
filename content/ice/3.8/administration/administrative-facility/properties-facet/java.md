{% language-section name="mapping" %}

## Receiving Property Updates

An application can register callbacks that the `Properties` facet calls after each `setProperties` invocation. The
servant that implements this facet is a
[NativePropertiesAdmin](https://code.zeroc.com/ice/3.8/api/java/com.zeroc.ice/com/zeroc/Ice/NativePropertiesAdmin.html),
which `findAdminFacet` returns:

```java
com.zeroc.Ice.Object obj = communicator.findAdminFacet("Properties");
if (obj != null) { // It's null when the facet is not enabled
    var propertiesAdmin = (com.zeroc.Ice.NativePropertiesAdmin)obj;
    ...
}
```

Register a `Consumer<Map<String, String>>` with `addUpdateCallback`. Retain the callback to unregister it with
`removeUpdateCallback`:

```java
java.util.function.Consumer<java.util.Map<String, String>> callback =
    changes -> { /* Apply application settings. */ };
propertiesAdmin.addUpdateCallback(callback);
// When notifications are no longer needed:
propertiesAdmin.removeUpdateCallback(callback);
```

{% /language-section %}
