{% language-section name="mapping" %}

```typescript
const prx = new SomePrx(communicator, "ident:tcp -p 10000");
const g1 = prx.ice_connectionId("group1");
const g2 = prx.ice_connectionId("group2");
await prx.ice_ping(); // Opens a new connection
await g1.ice_ping(); // Opens a new connection
await g2.ice_ping(); // Opens a new connection
const i1 = AdminPrx.uncheckedCast(g1.ice_facet("admin"));
await i1.ice_ping(); // Reuses g1's connection
const i2 = AdminPrx.uncheckedCast(
    prx.ice_connectionId("group2").ice_facet("admin"));
await i2.ice_ping(); // Reuses g2's connection
```

{% /language-section %}
