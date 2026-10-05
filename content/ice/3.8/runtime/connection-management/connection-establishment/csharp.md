{% language-section name="mapping" %}

```csharp
var prx = SomePrxHelper.createProxy(communicator, "ident:tcp -p 10000");
var g1 = prx.ice_connectionId("group1");
var g2 = prx.ice_connectionId("group2");
await prx.ice_pingAsync(); // Opens a new connection
await g1.ice_pingAsync(); // Opens a new connection
await g2.ice_pingAsync(); // Opens a new connection
var i1 = AdminPrxHelper.uncheckedCast(g1.ice_facet("admin"));
await i1.ice_pingAsync(); // Reuses g1's connection
var i2 = AdminPrxHelper.uncheckedCast(
    prx.ice_connectionId("group2").ice_facet("admin"));
await i2.ice_pingAsync(); // Reuses g2's connection
```

{% /language-section %}
