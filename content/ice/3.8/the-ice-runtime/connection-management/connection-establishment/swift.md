{% language-section name="lang-1" %}

```swift
let prx = try makeProxy(
    communicator: communicator,
    proxyString: "ident:tcp -p 10000",
    type: SomePrx.self)
let g1 = prx.ice_connectionId("group1")
let g2 = prx.ice_connectionId("group2")
try await prx.ice_ping() // Opens a new connection
try await g1.ice_ping() // Opens a new connection
try await g2.ice_ping() // Opens a new connection
let i1 = uncheckedCast(prx: g1.ice_facet("admin"), type: AdminPrx.self)
try await i1.ice_ping() // Reuses g1's connection
let i2 = uncheckedCast(
    prx: prx.ice_connectionId("group2").ice_facet("admin"), type: AdminPrx.self)
try await i2.ice_ping() // Reuses g2's connection
```

{% /language-section %}
