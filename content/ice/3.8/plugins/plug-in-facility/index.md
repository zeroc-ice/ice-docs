---
title: Plug-in Facility
pages:
  - plug-in-api
  - installing-a-plug-in-using-configuration
---

Ice provides a plug-in facility that allows you to load new features into your application, without changing this
application's code. Depending on the programming language, a plug-in is packaged as a shared library, a set of Java
classes, or a .NET assembly.

In C++, C#, and Java, you can install factories through `InitializationData.pluginFactories` or load plug-ins through
configuration. Python, Ruby, PHP, MATLAB, and Swift load C++ plug-ins through configuration. JavaScript does not support
plug-ins.

Each communicator has its own plug-in instances. Ice constructs the plug-ins during communicator initialization and then
initializes them in construction order. Plug-ins can read their settings from the communicator's properties.

This section describes the plug-in facility in more detail {% iflang langs="cpp,csharp,java" %}and demonstrates how to
implement an Ice plug-in{% /iflang %}.
