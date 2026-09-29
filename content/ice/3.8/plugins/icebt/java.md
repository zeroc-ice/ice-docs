{% language-section name="lang-1" %}

You should install IceBT in your communicator using the `pluginFactories` field of `InitializationData`:

```java
// Android only
InitializationData initData = new InitializationData();
initData.pluginFactories = Collections.singletonList(
    new com.zeroc.IceBT.PluginFactory());

try (Communicator communicator = new Communicator(args)) {
    ....
}
```

Alternatively, you can install the IceBT plug-in at runtime using configuration:

```config
# Android only
Ice.Plugin.IceBT=com.zeroc.IceBT.PluginFactory
```

{% /language-section %}

{% language-section name="lang-2" %}

```java
var greeter = GreeterPrx.createProxy(
  communicator,
  "greeter:bt -u 4f140cef-d75e-4c93-b4e4 -a \"01:23:45:67:89:AB\"");
```

{% /language-section %}

{% language-section name="lang-3" %}

On Android, an app can use the APIs in `android.bluetooth` to initiate discovery and receive intent notifications about
nearby devices.

{% /language-section %}
