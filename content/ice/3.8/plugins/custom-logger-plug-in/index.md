---
title: Custom Logger Plug-in
---

The preferred way to install a custom logger into a communicator is by setting the `logger` field of the communicator's
`InitializationData`.

However, in some situations, you have no access to `InitializationData`, for example:

- you are writing an IceBox service
- you want to install a custom logger without changing any source code

The plug-in facility allows you to inject your custom logger into the communicator at runtime, during communicator
initialization.

# Installing a Custom Logger

{% language-section name="lang-1" /%}

##### See Also

- [Custom Loggers](../custom-loggers)
- [The Per-Process Logger](../per-process-logger)
- [Plug-in Facility](../plug-in-facility)
- [Ice.Plugin.*](../ice-plugin-properties)
