{% language-section name="lang-1" %}

```cpp
SomePrx prx{communicator, "ident:tcp -p 10000"};
auto g1 = prx.ice_connectionId("group1");
auto g2 = prx.ice_connectionId("group2");
prx.ice_ping(); // Opens a new connection
g1.ice_ping(); // Opens a new connection
g2.ice_ping(); // Opens a new connection
auto i1 = g1.ice_facet<AdminPrx>("admin");
i1.ice_ping(); // Reuses g1's connection
auto i2 = prx.ice_connectionId("group2").ice_facet<AdminPrx>("admin");
i2.ice_ping(); // Reuses g2's connection
```

{% /language-section %}
