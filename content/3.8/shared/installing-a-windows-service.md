---
id: installing-a-windows-service
title: Installing a Windows Service
---

The installation of a Windows service varies in complexity with the needs of the application, but usually involves the
following activities:

- Selecting the user account in which the service will run.
- Registering the service and establishing its activation mode and dependencies.
- Creating one or more file system directories to contain executables, libraries, and supporting files or databases.
- Configuring those directories with appropriate permissions so that they are accessible to the user account selected
  for the service.
- Creating keys in the Windows registry.
- Configuring the Windows Event Log so that the service can report status and error messages.

There are many ways to perform these tasks. For example, an administrator can
[execute them manually](../manually-installing-a-service-as-a-windows-service). Another option is to write a script or
program tailored to the needs of your application. Finally, you can build an installer using a developer tool such as
InstallShield.

# Selecting a User Account for the Service

Before installing a service, you should give careful consideration to the user account that will run the service. Unless
your service has special requirements, we recommend that you use the built-in account that Windows provides specifically
for this purpose, `Local Service`.

##### See Also

- [Manually Installing a Service as a Windows Service](../manually-installing-a-service-as-a-windows-service)
