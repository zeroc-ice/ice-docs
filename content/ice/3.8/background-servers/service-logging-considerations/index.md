---
title: Service Logging Considerations
---

## Default Logging

An Ice service running as a Windows service logs to the Windows event log by default. The event source is the service's
name unless you set [Ice.EventLog.Source](../../property-reference/ice-properties#ice.eventlog.source). The
[Ice service installer](../windows-services/using-the-ice-service-installer) registers this source in the `Application`
log unless you set its `EventLog` property.

On Linux and macOS, an Ice service logs to standard error by default. A service started with
[`--daemon`](../command-line-options#linux-and-macos-daemons) redirects standard error to `/dev/null` unless you also
pass [`--noclose`](../command-line-options#linux-and-macos-daemons).

To keep the log messages of a daemon, set [Ice.StdErr](../../property-reference/ice-properties#ice.stderr) or
[Ice.LogFile](../../property-reference/ice-properties#ice.logfile) to write them to a file,
[Ice.UseSyslog](../../property-reference/ice-properties#ice.usesyslog) to send them to `syslog`, or
[Ice.UseSystemdJournal](../../property-reference/ice-properties#ice.usesystemdjournal) on Linux or
[Ice.UseOSLog](../../property-reference/ice-properties#ice.useoslog) on macOS to send them to the system log.

## Startup Errors

An Ice service creates the logger that its configuration selects when it initializes its communicator. It reports errors
that occur before then to standard error on Linux and macOS, and on Windows when it runs without
[`--service`](../command-line-options#windows-services).

A Windows service reports these errors to the event log. It reads its configuration file before it opens the event log,
however, so it reports an error reading that file to standard error, which a Windows service has no console to show. To
see this error, run the service's command line in a console without `--service`.
