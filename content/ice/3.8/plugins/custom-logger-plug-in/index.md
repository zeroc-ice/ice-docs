---
title: Custom Logger Plug-in
---

{% iflang langs="cpp,csharp,java,js,python,swift" %}

When you create a communicator in your own code, install a custom logger by setting `InitializationData.logger`.

{% /iflang %}

A logger plug-in installs a custom logger through configuration, during communicator initialization. Use a logger
plug-in when you don't create the communicator yourself, for example in an IceBox service, or when you want to install a
custom logger without changing any source code.

{% iflang langs="cpp,csharp,java" %}

Adding a logger plug-in factory to `InitializationData.pluginFactories` works too, but it is more work for the same
result as setting `InitializationData.logger`.

{% /iflang %}

## Installing a Custom Logger

{% language-section name="mapping" /%}

## See Also

- [Custom Loggers](../../administration/logger-facility/custom-loggers)
- [The Per-Process Logger](../../administration/logger-facility/per-process-logger)
- [Plug-in Facility](../plug-in-facility)
- [Ice.Plugin.*](../../property-reference/ice-plugin-properties)
