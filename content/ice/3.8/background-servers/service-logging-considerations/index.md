---
title: Service Logging Considerations
---

A C++ service that derives from `Ice::Service` and uses a [custom logger](../../administration/logger-facility/custom-loggers) has several ways of
configuring it:

- as a [process-wide logger](../../administration/logger-facility/per-process-logger),
- in the `InitializationData` argument that is passed to `main`,
- by overriding the `initializeCommunicator` member function.

On Windows, `Ice::Service` installs its own logger that uses the Windows `Application` event log if no custom logger is
defined. The source name for the event log is the service's name unless a different value is specified using the
property `Ice.EventLog.Source`.

On Linux and macOS, the default Ice logger (which logs to the standard error output) is used when no other logger is
configured. A service started with [`--daemon`](../command-line-options#linux-daemons) redirects standard error to
`/dev/null`, which discards these log messages, unless `--noclose`, `Ice.StdErr` or `Ice.StdOut` is set. To keep the log
messages of a daemon, you can set the `Ice.StdErr` property to send standard error to a file, implement a custom logger,
or set the `Ice.UseSyslog` property, which selects a logger implementation that logs to the `syslog` facility.
Alternatively, you can set the `Ice.LogFile` property to write log messages to a file.

The systemd units included in the Linux packages start `glacier2router`, `icegridnode` and `icegridregistry` without
`--daemon`: these services run in the foreground and keep the standard error stream that systemd gives them.

Note that `Ice::Service` may encounter errors before the communicator is initialized. In this situation, `Ice::Service`
uses its default logger unless a process-wide logger is configured. Therefore, even if a failing service is configured
to use a different logger implementation, you may find useful diagnostic information in the `Application` event log (on
Windows) or sent to standard error (on Linux and macOS).
