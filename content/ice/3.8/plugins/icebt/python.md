{% language-section name="installing-icebt" %}

On Linux, install the IceBT shared library and load it with:

```config
Ice.Plugin.IceBT=IceBT:createIceBT
```

{% /language-section %}

{% language-section name="using-icebt-2" %}

Use the platform's Bluetooth facilities to discover remote devices and obtain their addresses. The C++ IceBT discovery
API is available to C++ plug-in code.

{% /language-section %}
