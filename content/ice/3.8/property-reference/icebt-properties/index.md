---
title: IceBT.*
---

IceBT is the Bluetooth transport plug-in for Android and Linux.

# IceBT.RcvSize

#### Synopsis

`IceBT.RcvSize=num`

#### Description

This property sets the receive buffer size to the specified value in bytes.

#### Platform Notes

###### Linux

The default value depends on the configuration of the local Bluetooth stack.

The OS may impose lower and upper limits on the receive buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.

# IceBT.SndSize

#### Synopsis

`IceBT.SndSize=num`

#### Description

This property sets the send buffer size to the specified value in bytes.

#### Platform Notes

###### Linux

The default value depends on the configuration of the local Bluetooth stack.

The OS may impose lower and upper limits on the send buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.
