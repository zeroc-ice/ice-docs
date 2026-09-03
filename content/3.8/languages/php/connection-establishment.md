---
id: connection-establishment
language: php
---

{% language-section name="lang-1" %}

```php
$prx = SomePrx::createProxy($communicator, "ident:tcp -p 10000");
$g1 = $prx->ice_connectionId("group1");
$g2 = $prx->ice_connectionId("group2");
$prx->ice_ping(); // Opens a new connection
$g1->ice_ping(); // Opens a new connection
$g2->ice_ping(); // Opens a new connection
$i1 = AdminPrx::uncheckedCast($g1->ice_facet("admin"));
$i1->ice_ping(); // Reuses g1's connection
$i2 = AdminPrx::uncheckedCast(
    $prx->ice_connectionId("group2")->ice_facet("admin"));
$i2->ice_ping(); // Reuses g2's connection
```

{% /language-section %}
