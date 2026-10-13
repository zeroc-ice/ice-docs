---
title: Logger Facility
pages:
  - default-logger
  - custom-loggers
  - built-in-loggers
  - per-process-logger
---

The Ice runtime logs trace messages, warnings, and errors through the [Logger](api:Ice/Logger) interface. The
[Ice.Trace.\*](../../property-reference/ice-trace-properties) and
[Ice.Warn.\*](../../property-reference/ice-warn-properties) properties select which trace messages and warnings it logs.

A logger provides one method for each kind of message:

- `print` logs a message as is, without a timestamp or prefix.
- `trace` logs a trace message in a category.
- `warning` logs a warning.
- `error` logs an error.

{% iflang langs="cpp" %}

The `Ice::Print`, `Ice::Trace`, `Ice::Warning`, and `Ice::Error` helper classes let you compose a message with the `<<`
operator. The helper sends the message to the logger when you call `flush` or when the helper is destroyed:

```cpp
Ice::Trace out{communicator->getLogger(), "Greeter"};
out << "greeting " << name;
```

{% /iflang %}

## See Also

- [Properties and Configuration](../../runtime/properties-and-configuration)
- [Ice.Trace.\*](../../property-reference/ice-trace-properties)
- [Ice.Warn.\*](../../property-reference/ice-warn-properties)
- [Middleware](../../runtime/dispatch/middleware)
