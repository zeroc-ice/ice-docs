---
title: Plug-in Facility
pages:
  - plug-in-api
  - installing-a-plug-in-using-configuration
---

Ice provides a plug-in facility that allows you to load new features into your application, without changing this
application's code. Depending on the programming language, a plug-in is packaged as a shared library, a set of Java
classes, or a .NET assembly.

Each communicator creates its own plug-ins during initialization. In C++, C#, and Java, you provide plug-in factories in
`InitializationData.pluginFactories`, or you install plug-ins through configuration. Python, Ruby, PHP, MATLAB, and
Swift install C++ plug-ins through configuration. JavaScript does not provide a plug-in facility.

The communicator creates the plug-ins and then initializes them in creation order. A plug-in can read its settings from
the communicator's properties.

This section describes the plug-in facility in more detail {% iflang langs="cpp,csharp,java" %}and demonstrates how to
implement an Ice plug-in{% /iflang %}.
