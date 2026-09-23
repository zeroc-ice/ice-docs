---
title: IceBox
---

IceBox is an easy-to-use framework for Ice application services. With IceBox, services are developed as
dynamically-loadable components that can be configured into a general purpose "super server" in whatever combinations
are necessary. IceBox is an implementation of the Service Configurator pattern.

A generic IceBox server replaces the typical monolithic Ice server you normally write. The IceBox server is configured
via properties with the application-specific services it is responsible for loading and managing, and it can be
administered remotely. There are several advantages in using this architecture:

- Composing an application consisting of various services is done by configuration, not by compiling and linking. This
  decouples the service from the server, allowing services to be combined or separated as needed.
- Multiple Java services can be active in a single instance of a Java Virtual Machine (JVM). This conserves operating
  system resources when compared to running several monolithic servers, each in its own JVM.
- Services loaded by the same IceBox server can be configured to take advantage of Ice's
  [collocation optimizations](../collocated-invocation-and-dispatch). For example, if one service is a client of another
  service, and those services reside in the same IceBox server, then invocations between them can be optimized.
- IceBox support is [integrated into IceGrid](../icebox-integration-with-icegrid), the server activation and deployment
  service.

IceBox offers a refreshing change of perspective: developers focus on writing services, not applications. The definition
of an application changes as well; using IceBox, an application becomes a collection of discrete services whose
composition is determined dynamically by configuration, rather than statically by the linker.
