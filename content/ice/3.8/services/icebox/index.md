---
title: IceBox
pages:
  - developing-icebox-services
  - configuring-icebox-services
  - starting-the-icebox-server
  - icebox-administration
---

An IceBox server hosts IceBox services. You implement each service as a dynamically loadable component, and the IceBox
server loads the services that its properties list. You can also administer an IceBox server remotely. You write IceBox
services in C++, C# or Java.

This architecture offers several advantages:

- You compose an application from services by configuration, not by compiling and linking. Because a service does not
  depend on the server that hosts it, you can combine services in one IceBox server or separate them as needed.
- Several services share one process, and in Java and C# one Java Virtual Machine or .NET runtime, which conserves
  operating system resources compared with running each service as a separate server.
- Services that use a [shared communicator](./configuring-icebox-services#using-a-shared-communicator) take advantage of
  Ice's [collocation optimizations](../../runtime/collocated-invocation-and-dispatch): an invocation from one of these
  services to another is a collocated invocation.
- IceBox support is [integrated into IceGrid](../icegrid/icebox-integration-with-icegrid), the server activation and
  deployment service.
