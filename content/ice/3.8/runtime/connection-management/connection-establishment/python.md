{% language-section name="mapping" %}

```py
prx = SomePrx(communicator, "ident:tcp -p 10000")
g1 = prx.ice_connectionId("group1")
g2 = prx.ice_connectionId("group2")
await prx.ice_pingAsync() # Opens a new connection
await g1.ice_pingAsync() # Opens a new connection
await g2.ice_pingAsync() # Opens a new connection
i1 = AdminPrx.uncheckedCast(g1.ice_facet("admin"))
await i1.ice_pingAsync() # Reuses g1's connection
i2 = AdminPrx.uncheckedCast(
    prx.ice_connectionId("group2").ice_facet("admin"))
await i2.ice_pingAsync() # Reuses g2's connection
```

{% /language-section %}
