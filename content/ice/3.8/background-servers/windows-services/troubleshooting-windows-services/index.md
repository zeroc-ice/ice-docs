---
title: Troubleshooting Windows Services
sidebarLabel: Troubleshooting
---

This page covers the problems that commonly prevent an Ice service from starting or from working as a Windows service.

## Startup Failures

When an Ice service stops during startup, look in the Windows event logs:

- The `System` log holds the entry of the Service Control Manager, which says that the service terminated with a
  service-specific error.
- The `Application` log holds the messages of the service itself, such as the exception that stopped it, unless you
  configured the service to log elsewhere. See [Service Logging Considerations](../../service-logging-considerations).

An error reading the configuration file does not reach the event log: the service reports it to standard error. To see
this error, run the command line of the service without the `--service` option in a console. `sc.exe qc NAME` shows the
command line of the service named `NAME`. The console runs under your account, not the account of the service, so an
error caused by the access rights of the service account does not occur there.

A Windows service commonly fails to start because of:

- invalid command-line arguments or configuration properties
- a configuration file, data directory or other resource that does not exist or that the service account cannot access
- networking issues, such as a port that is already in use or a DNS lookup failure
- an IceBox server that cannot load the DLL of one of its services, or a DLL this DLL depends on: the service runs with
  its own account and environment, so its `PATH` can differ from yours

A Windows service runs under the account selected when it is
[installed](../using-the-ice-service-installer#iceserviceinstall-properties), which may not have access to resources
owned by other users. Check the access rights of this account to the files and directories the service uses, or select a
different account in the Services control panel.

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
- [Using the Ice Service Installer](../using-the-ice-service-installer)
