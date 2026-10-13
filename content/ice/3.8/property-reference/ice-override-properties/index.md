---
title: Ice.Override.*
---

## Ice.Override.Compress

{% property-synopsis %}

`Ice.Override.Compress=num`

{% /property-synopsis %}

{% property-description %}

{% iflang langs="js" %}

{% callout type="note" title="JavaScript" %}

Ice for JavaScript does not support `Ice.Override.Compress`. Setting it throws `PropertyException`.

{% /callout %}

{% /iflang %}

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

If set, this property overrides the [compression](../../runtime/compression) setting of all proxies and of the endpoints
on which object adapters listen. `1` enables compression and `0` disables it. Published endpoints derived from the
listening endpoints inherit the resulting compression flag; endpoints set with `PublishedEndpoints` keep their own.

{% /iflang %}

{% /property-description %}
