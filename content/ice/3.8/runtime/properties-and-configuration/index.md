---
title: Properties and Configuration
sidebarLabel: Configuration
pages:
  - properties-overview
  - using-configuration-files
  - configuration-file-syntax
  - setting-properties-on-the-command-line
  - properties-class
  - alternate-property-stores
---

Ice uses properties to configure the Ice runtime and its services, for example to set the maximum message size, the
connection timeouts, or the network tracing level. You set properties programmatically,
{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}in configuration files, {% /iflang %}or on the command
line, and your application can define its own properties and read them through the same API.
