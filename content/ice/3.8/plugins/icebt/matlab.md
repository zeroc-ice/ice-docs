{% language-section name="installing-icebt" %}

On Linux, install the IceBT shared library and load it with:

```config
Ice.Plugin.IceBT=IceBT:createIceBT
```

{% /language-section %}

{% language-section name="using-icebt-2" %}

The IceBT discovery API is available in C++ only. For a client, make the server's device known to the Linux Bluetooth
service before the first connection: discover or pair the device with `bluetoothctl`, then use the device's address in
the proxy endpoint. A server has nothing to discover; clients need the address of the server's Bluetooth adapter, which
`bluetoothctl show` prints.

{% /language-section %}
