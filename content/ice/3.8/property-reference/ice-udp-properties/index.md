---
title: Ice.UDP.*
---

{% iflang langs="js" %}

{% callout type="note" title="JavaScript" %}

Ice for JavaScript does not support the properties on this page. Setting any of them throws `PropertyException`.

{% /callout %}

{% /iflang %}

## Ice.UDP.RcvSize

### Synopsis {% id="ice.udp.rcvsize-synopsis" %}

`Ice.UDP.RcvSize=num`

### Description {% id="ice.udp.rcvsize-description" %}

This property sets the UDP receive buffer size to the specified value in bytes. Ice discards an incoming datagram larger
than the receive buffer size minus 28 bytes, and logs a warning if [Ice.Warn.Datagrams](../ice-warn-properties) is set.

The OS may impose lower and upper limits on the receive buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.

The default value is `0`, which leaves the operating system's buffer size unchanged.

Note that, on many operating systems, it is possible to set a buffer size greater than 65535. Such settings do not
change the hard limit of 65507 bytes for the payload of a UDP packet, but merely affect how much data can be buffered by
the kernel.

A buffer smaller than 65535 bytes limits the size of Ice datagrams, whether it comes from this property or from the
operating system's default.

## Ice.UDP.SndSize

### Synopsis {% id="ice.udp.sndsize-synopsis" %}

`Ice.UDP.SndSize=num`

### Description {% id="ice.udp.sndsize-description" %}

This property sets the UDP send buffer size to the specified value in bytes. Sending a request or batch request larger
than the send buffer size minus 28 bytes fails with a `DatagramLimitException`.

The OS may impose lower and upper limits on the send buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.

The default value is `0`, which leaves the operating system's buffer size unchanged.

Note that, on many operating systems, it is possible to set a buffer size greater than 65535. Such settings do not
change the hard limit of 65507 bytes for the payload of a UDP packet, but merely affect how much data can be buffered by
the kernel.

A buffer smaller than 65535 bytes limits the size of Ice datagrams, whether it comes from this property or from the
operating system's default.
