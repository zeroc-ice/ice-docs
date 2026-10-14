---
title: IceBox
pages:
  - developing-icebox-services
  - configuring-icebox-services
  - starting-the-icebox-server
  - icebox-administration
---

IceBox hosts Ice application services in a server process. You implement each service as a dynamically loadable
component, and you configure with properties which services the IceBox server loads and manages. You can also administer
an IceBox server remotely. IceBox is available in C++, C# and Java.

This architecture offers several advantages:

- You compose an application from services by configuration, not by compiling and linking. Because a service does not
  depend on the server that hosts it, you can combine services in one IceBox server or separate them as needed.
- Multiple Java services can be active in a single instance of a Java Virtual Machine (JVM). This conserves operating
  system resources compared with running each service as a separate server in its own JVM.
- Services loaded by the same IceBox server can be configured to take advantage of Ice's
  [collocation optimizations](../../runtime/collocated-invocation-and-dispatch). For example, if one service is a client
  of another service, and those services reside in the same IceBox server, then invocations between them can be
  optimized.
- IceBox support is [integrated into IceGrid](../icegrid/icebox-integration-with-icegrid), the server activation and
  deployment service.
