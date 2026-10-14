---
title: Windows Services
pages:
  - installing-a-windows-service
  - using-the-ice-service-installer
  - troubleshooting-windows-services
---

A Windows service is a program that runs in the background and typically does not require user intervention. Similar to
a daemon on Unix platforms, a Windows service is usually launched automatically when the operating system starts and
runs until the system shuts down.

The Ice services `glacier2router`, `icebox`, `icebridge`, `icegridnode` and `icegridregistry` can run as Windows
services. You register an Ice service with Windows using a command line that includes the
[`--service NAME`](../command-line-options#windows-services) option, and Windows uses this command line to start the
service. [Installing a Windows Service](./installing-a-windows-service) lists the tasks an installation involves, and
the [Ice service installer](./using-the-ice-service-installer) performs them for an IceGrid registry, an IceGrid node or
a Glacier2 router.
