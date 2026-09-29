---
title: Windows Services
pages:
  - installing-a-windows-service
  - using-the-ice-service-installer
  - manually-installing-a-service-as-a-windows-service
  - troubleshooting-windows-services
---

A Windows service is a program that runs in the background and typically does not require user intervention. Similar to
a daemon on Unix platforms, a Windows service is usually launched automatically when the operating system starts and
runs until the system shuts down.

Ice for C++ includes the `Ice::Service` class that simplifies the task of writing an Ice-based Windows service. Writing
the service is only the first step, however, as it is also critically important that the service be installed and
configured correctly for successful operation. Service installation and configuration is outside the scope of the
`Service` class because these tasks are generally not performed by the service itself but rather as part of a larger
administrative effort to deploy an application. Furthermore, there are security implications to consider when a service
is able to install itself: such a service typically needs administrative rights to perform the installation, but does
not necessarily need those rights while it is running. A better strategy is to grant administrative rights to a separate
installer program and not to the service itself.
