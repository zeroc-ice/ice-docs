{% language-section name="installing-icebt" %}

You should install IceBT in your communicator using the `pluginFactories` field of `InitializationData`:

```java
// Android only
InitializationData initData = new InitializationData();
initData.properties = new com.zeroc.Ice.Properties(args);
initData.pluginFactories = java.util.List.of(
    new com.zeroc.IceBT.PluginFactory());

try (Communicator communicator = new Communicator(initData)) {
    // Use the communicator.
}
```

Alternatively, you can install the IceBT plug-in at runtime using configuration:

```config
# Android only
Ice.Plugin.IceBT=com.zeroc.IceBT.PluginFactory
```

{% /language-section %}

{% language-section name="using-icebt-1" %}

```java
var greeter = GreeterPrx.createProxy(
  communicator,
  "greeter:bt -u 4f140cef-d75e-4c93-b4e4-20ac111d36d1 -a \"01:23:45:67:89:AB\"");
```

{% /language-section %}

{% language-section name="using-icebt-2" %}

On Android, an app can use the APIs in `android.bluetooth` to initiate discovery and receive intent notifications about
nearby devices. IceBT cancels Android device discovery before opening an outgoing connection.

The app must obtain the Bluetooth permissions required by its Android version and target SDK. See
[Android Bluetooth permissions](https://developer.android.com/develop/connectivity/bluetooth/bt-permissions).

{% /language-section %}
