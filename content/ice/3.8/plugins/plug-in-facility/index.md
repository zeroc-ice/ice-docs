---
title: Plug-in Facility
pages:
  - plug-in-api
  - installing-a-plug-in-using-configuration
---

Ice provides a plug-in facility that allows you to load new features into your application, without changing this
application's code. Depending on the programming language, a plug-in is packaged as a shared library, a set of Java
classes, or a .NET assembly.

You control the loading and initialization of plug-ins with Ice configuration properties, and the plug-ins themselves
are configured through Ice configuration properties.

This section describes the plug-in facility in more detail {% iflang langs="cpp,csharp,java" %}and demonstrates how to
implement an Ice plug-in{% /iflang %}.
