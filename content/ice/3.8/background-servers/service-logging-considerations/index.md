---
title: Service Logging Considerations
---

An Ice service running as a Windows service logs to the Windows `Application` event log when no other logger is
configured. The source name for the event log is the service's name unless a different value is specified using the
property `Ice.EventLog.Source`.

On Linux and macOS, an Ice service logs to standard error when no other logger is configured. A service started with
[`--daemon`](../command-line-options#linux-and-macos-daemons) redirects standard error to `/dev/null`, which discards
these log messages, unless `--noclose`, `Ice.StdErr` or `Ice.StdOut` is set. To keep the log messages of a daemon, set
`Ice.StdErr` to send standard error to a file, `Ice.UseSyslog` to log to the `syslog` facility, or `Ice.LogFile` to
write log messages to a file.

The [systemd units](../linux-services) included in the Linux packages start `glacier2router`, `icegridnode` and
`icegridregistry` in the foreground, and the sample configuration files installed with them set
[Ice.UseSystemdJournal](../../property-reference/ice-properties#ice.usesystemdjournal), so these services log to the
systemd journal.

An Ice service that fails before it initializes its communicator logs the error to standard error, or to the
`Application` event log when it runs as a Windows service, even when it is configured to use a different logger.
