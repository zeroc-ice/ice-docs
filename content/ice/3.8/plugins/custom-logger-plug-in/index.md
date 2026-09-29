---
title: Custom Logger Plug-in
---

A logger plug-in installs a custom logger while Ice initializes a communicator.

{% iflang langs="cpp,csharp,java,js,python,swift" %}

When you create the communicator in your own code, set `InitializationData.logger` to install a custom logger directly.

{% /iflang %}

However, in some situations, you have no access to `InitializationData`, for example:

- you are writing an IceBox service
- you want to install a custom logger without changing any source code

In mappings that support plug-ins, the plug-in facility allows you to inject your custom logger into the communicator at
runtime, during communicator initialization.

## Installing a Custom Logger

{% language-section name="mapping" /%}

## See Also

- [Custom Loggers](../../administration/logger-facility/custom-loggers)
- [The Per-Process Logger](../../administration/logger-facility/per-process-logger)
- [Plug-in Facility](../plug-in-facility)
- [Ice.Plugin.*](../../property-reference/ice-plugin-properties)
