---
title: Ice.TCP.*
---

# Ice.TCP.Backlog

#### Synopsis

`Ice.TCP.Backlog=num`

#### Description

Specifies the size of the listen queue for each TCP or SSL server endpoint. If not defined, the default value for C++
programs uses the value of `SOMAXCONN` if present, or `511` otherwise. In Java and .NET, the default value is 511.

# Ice.TCP.RcvSize

#### Synopsis

`Ice.TCP.RcvSize=num`

#### Description

This property sets the TCP receive buffer size to the specified value in bytes. The default value depends on the
configuration of the local TCP stack. (A common default values is 65535 bytes.)

The OS may impose lower and upper limits on the receive buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.

# Ice.TCP.SndSize

#### Synopsis

`Ice.TCP.SndSize=num`

#### Description

This property sets the TCP send buffer size to the specified value in bytes. The default value depends on the
configuration of the local TCP stack. (A common default values is 65535 bytes.)

The OS may impose lower and upper limits on the send buffer size or otherwise adjust the buffer size. If a limit is
requested that is lower than the OS-imposed minimum, the value is silently adjusted to the OS-imposed minimum. If a
limit is requested that is larger than the OS-imposed maximum, the value is adjusted to the OS-imposed maximum; in
addition, Ice logs a warning showing the requested size and the adjusted size.
