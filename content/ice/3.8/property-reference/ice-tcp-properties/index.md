---
title: Ice.TCP.*
---

{% iflang langs="js" %}

{% callout type="note" title="JavaScript" %}

Ice for JavaScript does not support the properties on this page. Setting any of them throws `PropertyException`.

{% /callout %}

{% /iflang %}

## Ice.TCP.Backlog

{% synopsis %}

`Ice.TCP.Backlog=num`

{% /synopsis %}

{% description %}

Specifies the size of the listen queue for each TCP-based server endpoint (`tcp`, `ssl`, `ws`, or `wss`). The default
value is `511`.

{% /description %}

## Ice.TCP.RcvSize

{% synopsis %}

`Ice.TCP.RcvSize=num`

{% /synopsis %}

{% description %}

Sets the TCP receive buffer size in bytes for `tcp`, `ssl`, `ws`, and `wss` connections. The default value is `131072`
(128 KiB) on Windows and `0` on other platforms. A value of `0` or less leaves the operating system's buffer size
unchanged.

The OS may impose lower and upper limits on the receive buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.

{% /description %}

## Ice.TCP.SndSize

{% synopsis %}

`Ice.TCP.SndSize=num`

{% /synopsis %}

{% description %}

Sets the TCP send buffer size in bytes for `tcp`, `ssl`, `ws`, and `wss` connections. The default value is `131072` (128
KiB) on Windows and `0` on other platforms. A value of `0` or less leaves the operating system's buffer size unchanged.

The OS may impose lower and upper limits on the send buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.

{% /description %}
