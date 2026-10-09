---
title: The Default Logger
---

When you create a communicator without supplying a [logger](..) or selecting a [built-in logger](../built-in-loggers),
the communicator uses the [per-process logger](../per-process-logger) if you installed a custom one, and Ice's default
logger otherwise.{% iflang langs="cpp,java,python,ruby,php,matlab,swift" %} The default logger writes its messages to
the standard error output.{% /iflang %} The `trace` operation accepts a `category` parameter in addition to the error
message; this allows you to separate trace output from different subsystems by sending the output through a filter.

You can obtain the logger that is attached to a communicator using the `getLogger` method on
[Communicator](api:Ice/Communicator).

{% language-section name="mapping" /%}

## See Also

- [Logger Facility](..)
