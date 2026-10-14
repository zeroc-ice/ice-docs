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

On Linux and macOS, and on Windows without `--service`, an Ice service that fails before it initializes its communicator
reports the error to standard error, even if its configuration selects a different logger. Running as a Windows service,
it reports a failure to initialize its communicator to the event log instead. It reads its configuration file before it
opens the event log, however, so an error in reading that file goes to standard error, and a Windows service has no
console to show it.
[Troubleshooting Windows Services](../windows-services/troubleshooting-windows-services#service-fails-to-start)
describes how to see this error.
