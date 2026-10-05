---
title: Ice.Override.*
---

## Ice.Override.Compress

### Synopsis {% id="ice.override.compress-synopsis" %}

`Ice.Override.Compress=num`

### Description {% id="ice.override.compress-description" %}

{% iflang langs="js" %}

{% callout type="note" title="JavaScript" %}

Ice for JavaScript does not support `Ice.Override.Compress`. Setting it throws `PropertyException`.

{% /callout %}

{% /iflang %}

{% iflang langs="cpp,csharp,java,python,ruby,php,matlab,swift" %}

If set, this property overrides [compression](../../protocol/protocol-compression) settings in all proxies and in object
adapter listening endpoints. `1` enables compression and `0` disables it. Published endpoints derived from the listening
endpoints inherit the resulting compression flag.

Note that, if a client sets `Ice.Override.Compress=1` and sends a compressed request to a server that does not support
compression, the server will close the connection and the client will receive `ConnectionLostException`.

If a client does not support compression and `Ice.Override.Compress=1`, the setting is ignored and a warning message is
printed on `stderr`.

Regardless of the setting of this property, requests smaller than 100 bytes are never compressed.

{% /iflang %}
