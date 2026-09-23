---
title: The Default Logger
---

A default [logger](../logger-facility) is instantiated when you create a communicator. The default logger writes its
messages to the standard error output. The `trace` operation accepts a `category` parameter in addition to the error
message; this allows you to separate trace output from different subsystems by sending the output through a filter.

You can obtain the logger that is attached to a communicator using the `getLogger` method on
[Communicator](https://code.zeroc.com/manual/Ice/Communicator).

{% language-section name="lang-1" /%}

##### See Also

- [Logger Facility](../logger-facility)
