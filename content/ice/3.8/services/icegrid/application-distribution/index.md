---
title: Application Distribution
---

In the section so far, "deployment" has meant the creation of descriptors in the registry. An IceGrid node starts a
server from the executable named by the `exe` attribute of the server descriptor, such as `/opt/ripper/bin/server` in
the [Ripper deployment descriptors](../using-icegrid-deployment#ripper-deployment-descriptors). This executable, its
dependent libraries and its supporting files must already be installed on the node's computer.

Deploying an application on a set of computers therefore also involves:

- Installing the IceGrid binaries and dependent libraries on each computer
- Writing the [registry and node configuration](../using-icegrid-deployment#ripper-registry-and-node-configuration) and
  preparing the data directories on each computer
- Starting the registry or node on each computer, and configuring the computer to launch it automatically, as a
  [Windows service](../../../background-servers/windows-services) or a
  [systemd service on Linux](../../../background-servers/linux-services)
- Copying your server executables, dependent libraries and supporting files to the computers that run them

Large- and small-scale applications often use tools to manage their deployments. The functionality of these tools ranges
from doing basic tasks, like syncing files, to orchestrating complex tasks such as installing packages, configuring
services, etc.
