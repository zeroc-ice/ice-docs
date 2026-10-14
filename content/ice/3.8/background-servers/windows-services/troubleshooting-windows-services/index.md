---
title: Troubleshooting Windows Services
---

This page describes how to diagnose problems with an Ice service that runs as a Windows service.

## Service Fails to Start

An Ice service running as a Windows service can fail to start because of:

- invalid command-line arguments or configuration properties
- a file or directory that does not exist or that the service's account cannot access, such as the configuration file or
  a data directory
- an IceBox service or Ice plug-in whose library Windows cannot find
- networking issues, such as an endpoint whose port is already in use, or a DNS lookup failure

When an Ice service fails after it reports to the Windows service control manager, it stops with the service-specific
exit code `1`, and Windows records an entry in the `System` event log stating that the service terminated with a
service-specific error. The service writes its own error messages to the event log, under the source named by
[Ice.EventLog.Source](../../../property-reference/ice-properties#ice.eventlog.source) or under the service name, until
it initializes its communicator. After that, it writes them with the logger its configuration selects, such as the file
named by [Ice.LogFile](../../../property-reference/ice-properties#ice.logfile), or to the event log when the
configuration selects no logger. The [Ice service installer](../using-the-ice-service-installer) registers the event log
source in the `Application` event log unless you set its `EventLog` property.

An Ice service that cannot read its configuration file exits earlier, before it reports to the service control manager
or opens the event log: Windows records no service-specific error, and the service writes no message to the event log.
To see the error, run the service's command line in a console without the `--service NAME` option: the service prints
the error to standard error. The console uses your account and environment, not the service's, so an error caused by the
service account's access rights may not occur there.

The Ice service installer installs a service to run under the `NT Authority\LocalService` account unless you set its
`ObjectName` property. It grants this account read access to the configuration file and full access to the data
directory of an IceGrid registry or node. If you change the account of the service, for example with the Services
control panel, or move these files, grant the account the same access rights, or uninstall and reinstall the service
with the installer.

## Windows Firewall Interference

Windows Firewall blocks inbound connections by default, so a service that accepts connections needs an inbound rule that
allows them. Create this rule when you install the service; `iceserviceinstall` does not create it. For example, this
`New-NetFirewallRule` command, in an elevated PowerShell session, allows connections to a Glacier2 router on TCP port
4063:

```powershell
New-NetFirewallRule -DisplayName "Glacier2 router" -Direction Inbound -Action Allow `
    -Program "C:\Program Files\ZeroC\Ice-Services-3.8.3\bin\glacier2router.exe" `
    -Protocol TCP -LocalPort 4063
```

A block rule takes precedence over an allow rule. If the service remains unreachable, look in the Inbound Rules of the
Windows Firewall with Advanced Security console (`wf.msc`) for block rules on the service executable, and delete them.
See
[Windows Firewall rules](https://learn.microsoft.com/en-us/windows/security/operating-system-security/network-security/windows-firewall/rules)
for the rule types and their precedence.

## IceGrid Node Performance Monitoring Issues

The IceGrid node uses Windows' `Perflib` facility to obtain statistics about the CPU utilization of its host for
[load balancing](../../../services/icegrid/load-balancing) purposes. Occasionally, the IceGrid node may log the
following warning message when it starts:

```text
warning: Unable to lookup the performance counter name:
<error description>
This usually occurs when you do not have sufficient privileges
```

The second line is the description Windows provides for the error. One cause is that the node's user account cannot read
the following key in the Windows registry:

```text
HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Perflib
```

After logging this warning, the node reports a load average of 0 until you restart it.

As part of its installation procedure, the [iceserviceinstall](../using-the-ice-service-installer) utility modifies the
permissions of this registry key to grant read access to the node's designated user account. If you are trying to change
the node's user account, we recommend using the `iceserviceinstall` utility to uninstall and reinstall the node. If you
wish to modify the permissions of this registry key manually, follow these steps:

1. Start `regedit` and navigate to the `Perflib` key.
2. Right click on `Perflib` and select `Permissions`.
3. If the desired user account is not already present, click `Add` to add the user account. Enter `LOCAL SERVICE` if you
   wish to run the node in the Local Service account, otherwise enter the name of the user account. Press `OK`.
4. Check the `Read` box in the `Allow` column to grant read access to the registry key and press `OK` to apply the
   changes.

Another way to grant the node's user account with the necessary access rights is to add it to the
`Performance Monitor Users` group.

After you correct the access rights, restart the IceGrid node and check that it no longer logs this warning. The
[icegridadmin](../../../services/icegrid/icegridadmin-command-line-tool) command `node load NAME` prints the load
averages the node reports.

## See Also

- [Load Balancing](../../../services/icegrid/load-balancing)
- [Installing a Windows Service](../installing-a-windows-service)
