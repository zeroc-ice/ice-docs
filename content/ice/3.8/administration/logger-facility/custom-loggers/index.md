---
title: Custom Loggers
---

You have several options if you wish to install a logger other than the default one:

{% iflang langs="cpp,csharp,java,python,swift" %}

- Select one of the other [built-in loggers](../built-in-loggers), such as the file logger
- Supply your own logger implementation in [InitializationData](api:Ice/InitializationData) when you create a
  communicator
- Load a logger implementation dynamically via the Ice [plug-in facility](../../../plugins/custom-logger-plug-in)

{% /iflang %}

{% iflang langs="js" %}

- In Node.js, select the [file logger](../built-in-loggers)
- Supply your own logger implementation in [InitializationData](api:Ice/InitializationData) when you create a
  communicator

{% /iflang %}

{% iflang langs="ruby,php,matlab" %}

- Select one of the other [built-in loggers](../built-in-loggers), such as the file logger
- Load a logger implemented in C++ via the Ice [plug-in facility](../../../plugins/custom-logger-plug-in)

{% /iflang %}

A custom logger lets you integrate the messages the Ice runtime logs into your application's logging framework: your
`Logger` implementation forwards each log message to this framework.

{% iflang langs="cpp,csharp,java,js,python,swift" %}

## Implementing a Logger

A custom logger implements the [Logger](api:Ice/Logger) interface, whose methods are described in
[Logger Facility](..).{% iflang langs="cpp,csharp,java,python,swift" %} The Ice runtime calls the logger from its own
threads, concurrently, so the implementation must be thread-safe.{% /iflang %}

{% /iflang %}

{% iflang langs="csharp,java" %}

## Logger Lifetime

{% /iflang %}

{% iflang langs="java" %}

`Logger` extends `AutoCloseable`. When you destroy a communicator, the communicator closes the logger it created from
[Ice.LogFile](../../../property-reference/ice-properties) or
[Ice.UseSyslog](../../../property-reference/ice-properties), and the logger installed by a
[logger plug-in](../../../plugins/custom-logger-plug-in). You manage the lifetime of a logger you supply in
`InitializationData` or install with `setProcessLogger` (see [The Per-Process Logger](../per-process-logger)).

{% /iflang %}

{% iflang langs="csharp" %}

`Logger` extends `IDisposable`. When you destroy a communicator, the communicator disposes the logger it created, either
from [Ice.LogFile](../../../property-reference/ice-properties) or as its default logger, and the logger installed by a
[logger plug-in](../../../plugins/custom-logger-plug-in). You manage the lifetime of a logger you supply in
`InitializationData` or install with `setProcessLogger` (see [The Per-Process Logger](../per-process-logger)).

{% /iflang %}

## See Also

- [Built-in Loggers](../built-in-loggers)
- [Custom Logger Plug-in](../../../plugins/custom-logger-plug-in)
