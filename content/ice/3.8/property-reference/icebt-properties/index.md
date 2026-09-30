---
title: IceBT.*
---

IceBT provides a Java Bluetooth transport plug-in for Android and a C++ Bluetooth transport plug-in for Linux.

## IceBT.RcvSize

### Synopsis

`IceBT.RcvSize=num`

### Description

This property sets the receive buffer size in bytes: the Bluetooth socket buffer on Linux, or the Java transport's
internal buffer on Android.

### Platform Notes

#### Android

The default value is 131,072 bytes (128 KiB).

#### Linux

The default value depends on the configuration of the local Bluetooth stack.

The OS may impose lower and upper limits on the receive buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.

## IceBT.SndSize

### Synopsis

`IceBT.SndSize=num`

### Description

This property sets the send buffer size in bytes: the Bluetooth socket buffer on Linux, or the Java transport's internal
buffer on Android.

### Platform Notes

#### Android

The default value is 131,072 bytes (128 KiB).

#### Linux

The default value depends on the configuration of the local Bluetooth stack.

The OS may impose lower and upper limits on the send buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.
