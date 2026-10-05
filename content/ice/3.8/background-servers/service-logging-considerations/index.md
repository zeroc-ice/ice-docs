---
title: Service Logging Considerations
---

A service that uses a [custom logger](../../administration/logger-facility/custom-loggers) has several ways of
configuring it:

- as a [process-wide logger](../../administration/logger-facility/per-process-logger),
- in the `InitializationData` argument that is passed to `main`,
- by overriding the `initializeCommunicator` member function.

On Windows, `Ice::Service` installs its own logger that uses the Windows `Application` event log if no custom logger is
defined. The source name for the event log is the service's name unless a different value is specified using the
property `Ice.EventLog.Source`.

On Unix, the default Ice logger (which logs to the standard error output) is used when no other logger is configured.
For daemons, this is not appropriate because the output will be lost. To change this, you can either implement a custom
logger or set the `Ice.UseSyslog` property, which selects a logger implementation that logs to the `syslog` facility.
Alternatively, you can set the `Ice.LogFile` property to write log messages to a file.

Note that `Ice::Service` may encounter errors before the communicator is initialized. In this situation, `Ice::Service`
uses its default logger unless a process-wide logger is configured. Therefore, even if a failing service is configured
to use a different logger implementation, you may find useful diagnostic information in the `Application` event log (on
Windows) or sent to standard error (on Linux and macOS).
