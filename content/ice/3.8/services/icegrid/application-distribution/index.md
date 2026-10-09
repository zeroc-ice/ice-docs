---
title: Application Distribution
---

In the section so far, "deployment" has meant the creation of descriptors in the registry. A broader definition involves
a number of other tasks:

- Writing IceGrid configuration files and preparing data directories on each computer
- Installing the IceGrid binaries and dependent libraries on each computer
- Starting the registry and/or node on each computer, and possibly configuring the systems to launch them automatically
- Distributing your server executables, dependent libraries and supporting files to the appropriate nodes.

Large- and small-scale applications often use tools to manage their deployments. The functionality of these tools ranges
from doing basic tasks, like syncing files, to orchestrating complex tasks such as installing packages, configuring
services, etc.
