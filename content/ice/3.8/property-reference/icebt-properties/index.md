---
title: IceBT.*
---

IceBT is the Bluetooth transport plug-in for Android and Linux.

## IceBT.RcvSize

### Synopsis {% id="icebt.rcvsize-synopsis" %}

`IceBT.RcvSize=num`

### Description {% id="icebt.rcvsize-description" %}

This property sets the receive buffer size to the specified value in bytes.

### Platform Notes {% id="icebt.rcvsize-platform-notes" %}

#### Linux {% id="icebt.rcvsize-linux" %}

The default value depends on the configuration of the local Bluetooth stack.

The OS may impose lower and upper limits on the receive buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.

## IceBT.SndSize

### Synopsis {% id="icebt.sndsize-synopsis" %}

`IceBT.SndSize=num`

### Description {% id="icebt.sndsize-description" %}

This property sets the send buffer size to the specified value in bytes.

### Platform Notes {% id="icebt.sndsize-platform-notes" %}

#### Linux {% id="icebt.sndsize-linux" %}

The default value depends on the configuration of the local Bluetooth stack.

The OS may impose lower and upper limits on the send buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.
