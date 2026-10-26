---
title: Windows Services
pages:
  - installing-a-windows-service
  - using-the-ice-service-installer
  - troubleshooting-windows-services
---

A Windows service is a program that runs in the background without user interaction. Depending on how a service is
configured, Windows starts it when the system starts or when it is requested.

The Ice services `glacier2router`, `icebox`, `icebridge`, `icegridnode` and `icegridregistry` can run as Windows
services. To run one of them as a Windows service, install it with the
[`--service NAME`](../command-line-options#windows-services) option on its command line, where `NAME` is the name of the
installed service.

[Installing a Windows Service](./installing-a-windows-service) describes the installation. The
[Ice service installer](./using-the-ice-service-installer) automates it for the IceGrid registry, the IceGrid node and
the Glacier2 router, and adds `--service NAME` to the command line it registers.
