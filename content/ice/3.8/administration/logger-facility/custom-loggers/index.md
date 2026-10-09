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

- In Node.js, select the file logger, one of the [built-in loggers](../built-in-loggers)
- Supply your own logger implementation in [InitializationData](api:Ice/InitializationData) when you create a
  communicator

{% /iflang %}

{% iflang langs="ruby,php,matlab" %}

- Select one of the other [built-in loggers](../built-in-loggers), such as the file logger
- Load a logger implemented in C++ via the Ice [plug-in facility](../../../plugins/custom-logger-plug-in)

{% /iflang %}

Changing the `Logger` object that is attached to a communicator allows you to integrate Ice messages into your own
message handling system. For example, for a complex application, you might have an existing logging framework. To
integrate Ice messages into that framework, you can create your own `Logger` implementation that logs messages to the
existing framework.

{% iflang langs="cpp,csharp,java,js,python,swift" %}

## Implementing a Logger

A logger implements the `print`, `trace`, `warning`, and `error` methods described in [Logger Facility](..), and
`cloneWithPrefix`, which returns a new logger that logs with the given
prefix{% iflang langs="cpp,csharp,java,python,swift" %}. `getPrefix` returns the prefix of the logger{% /iflang %}.

The Ice runtime calls `print`, `trace`, `warning`, and `error` from contexts where it cannot handle an exception, so
implementations of these methods must not throw exceptions.{% iflang langs="cpp,csharp,java,python,swift" %} The Ice
runtime calls the logger from its own threads, concurrently, so the implementation must be thread-safe.{% /iflang %}

{% /iflang %}

## Logger Lifetime

{% iflang langs="cpp,js,python,ruby,php,matlab,swift" %}

Destroying a communicator leaves its logger usable: you can keep using the logger after you destroy the communicator.

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
`InitializationData` or install with `setProcessLogger` (see [The Per-Process Logger](../per-process-logger)). The
caller of `cloneWithPrefix` disposes the returned logger.

{% /iflang %}

## See Also

- [Built-in Loggers](../built-in-loggers)
- [Custom Logger Plug-in](../../../plugins/custom-logger-plug-in)
