---
title: Windows Services
pages:
  - installing-a-windows-service
  - using-the-ice-service-installer
  - troubleshooting-windows-services
---

A Windows service is a program that runs in the background and typically does not require user intervention. Windows
usually starts a service when the system starts, and the service runs until the system shuts down.

The Ice services `glacier2router`, `icebox`, `icebridge`, `icegridnode` and `icegridregistry` run as Windows services
when their command line includes the [`--service`](../command-line-options#windows-services) option. Windows starts a
service only after it is installed: [Installing a Windows Service](./installing-a-windows-service) describes what an
installation involves, and the [Ice service installer](./using-the-ice-service-installer) performs these steps for the
IceGrid registry, the IceGrid node and the Glacier2 router.
