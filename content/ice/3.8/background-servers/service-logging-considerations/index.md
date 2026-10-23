---
title: Service Logging Considerations
---

## Default Logging

An Ice service running as a Windows service logs to the Windows event log by default. The event source is the service's
name unless you set [Ice.EventLog.Source](../../property-reference/ice-properties#ice.eventlog.source). The
[Ice service installer](../windows-services/using-the-ice-service-installer) registers this source in the `Application`
log unless you set its `EventLog` property.

On Linux and macOS, an Ice service logs to standard error by default. A service managed by systemd or launchd runs in
the foreground: systemd collects this output in its journal, and launchd writes it to the file named by the
`StandardErrorPath` key of the job's property list, or discards it when this key is not set. To send the log messages
elsewhere:

- Set [Ice.StdErr](../../property-reference/ice-properties#ice.stderr) or
  [Ice.LogFile](../../property-reference/ice-properties#ice.logfile) to write them to a file.
- Set [Ice.UseSyslog](../../property-reference/ice-properties#ice.usesyslog) to `1` to send them to `syslog`.
- Set [Ice.UseSystemdJournal](../../property-reference/ice-properties#ice.usesystemdjournal) to `1` on Linux, or
  [Ice.UseOSLog](../../property-reference/ice-properties#ice.useoslog) to `1` on macOS, to send them to the system log.

A service started with [`--daemon`](../command-line-options#linux-and-macos-daemons) discards standard error unless
`Ice.StdErr` is set or `--noclose` is passed.

## Startup Errors

An Ice service creates the logger that its configuration selects when it initializes its communicator. It reports errors
that occur before then to standard error on Linux and macOS, and on Windows when it runs without
[`--service`](../command-line-options#windows-services).

A Windows service reports these errors to the event log, except an error reading its configuration file: the service
reads this file before it opens the event log, so this error goes to standard error.
