---
title: Custom Loggers
---

You have several options if you wish to install a logger other than the default one:

- Select one of the other [built-in loggers](../built-in-loggers), which allow you to log to a file, to the `syslog` on
  Unix, and to the Windows event log
- Supply your own logger implementation in [InitializationData](https://code.zeroc.com/manual/Ice/InitializationData)
  when you create a communicator
- Load a logger implementation dynamically via the Ice [plug-in facility](../custom-logger-plug-in)

Changing the `Logger` object that is attached to a communicator allows you to integrate Ice messages into your own
message handling system. For example, for a complex application, you might have an existing logging framework. To
integrate Ice messages into that framework, you can create your own `Logger` implementation that logs messages to the
existing framework.

When you destroy a communicator, its logger is _not_ destroyed. This means that you can safely use a logger even beyond
the lifetime of its communicator.

## See Also

- [Built-in Loggers](../built-in-loggers)
- [Custom Logger Plug-in](../custom-logger-plug-in)
