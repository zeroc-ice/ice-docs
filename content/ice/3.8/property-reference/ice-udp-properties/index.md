---
title: Ice.UDP.*
---

{% iflang langs="js" %}

{% callout type="info" title="JavaScript" %}

Ice for JavaScript does not support the properties on this page. Setting any of them throws `PropertyException`.

{% /callout %}

{% /iflang %}

# Ice.UDP.RcvSize

#### Synopsis

`Ice.UDP.RcvSize=num`

#### Description

This property sets the UDP receive buffer size to the specified value in bytes. Ice messages larger than `num - 28`
bytes cause a `DatagramLimitException`. The default value depends on the configuration of the local UDP stack. (Common
default values are 65535 and 8192 bytes.)

The OS may impose lower and upper limits on the receive buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.

Values less than 28 are ignored.

Note that, on many operating systems, it is possible to set a buffer size greater than 65535. Such settings do not
change the hard limit of 65507 bytes for the payload of a UDP packet, but merely affect how much data can be buffered by
the kernel.

Settings less than 65535 limit the size of Ice datagrams as well as adjust the kernel buffer sizes.

# Ice.UDP.SndSize

#### Synopsis

`Ice.UDP.SndSize=num`

#### Description

This property sets the UDP send buffer size to the specified value in bytes. Ice messages larger than `num - 28` bytes
cause a `DatagramLimitException`. The default value depends on the configuration of the local UDP stack. (Common default
values are 65535 and 8192 bytes.)

The OS may impose lower and upper limits on the send buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.

Values less than 28 are ignored.

Note that, on many operating systems, it is possible to set a buffer size greater than 65535. Such settings do not
change the hard limit of 65507 bytes for the payload of a UDP packet, but merely affect how much data can be buffered by
the kernel.

Settings less than 65535 limit the size of Ice datagrams as well as adjust the kernel buffer sizes.
