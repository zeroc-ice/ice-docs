---
title: Troubleshooting Windows Services
---

This page describes how to troubleshoot Windows Services.

## Missing Libraries for a Windows Service

One failure that commonly occurs when starting a Windows service is caused by missing DLLs, which usually results in an
error window stating a particular DLL cannot be found. Fixing this problem can often be a trial-and-error process
because the DLL mentioned in the error may depend on other DLLs that are also missing. It is important to understand
that a Windows service is launched by the operating system and can be configured to execute as a different user, which
means the service's environment (most importantly its `PATH`) may not match yours and therefore extra steps are
necessary to ensure that the service can locate its required DLLs.

{% callout type="info" %}

The command-line utility `dumpbin` can be used to discover the dependencies of an executable or DLL.

{% /callout %}

The simplest approach is to copy all of the necessary DLLs to the directory containing the service executable. If this
solution is undesirable, another option is to modify the system `PATH` to include the directory or directories
containing the required DLLs. (Note that modifying the system `PATH` requires restarting the system.) Finally, you can
copy the necessary DLLs to `\WINDOWS\system32`, although we do not recommend this approach.

{% callout type="info" %}

Copying DLLs to `\WINDOWS\system32` often results in subtle problems later when trying to develop using newer versions
of the DLLs. Inevitably you will forget about the DLLs in `\WINDOWS\system32` and struggle to determine why your
application is misbehaving or failing to start.

{% /callout %}

Assuming that DLL issues are resolved, a Windows service can fail to start for a number of other reasons, including

- invalid command-line arguments or configuration properties
- inability to access necessary resources such as file systems and databases, because either the resources do not exist
  or the service does not have sufficient access rights to them
- networking issues, such as attempting to open a port that is already in use, or DNS lookup failures

Failures encountered by the Ice run time prior to initialization of the communicator are reported to the Windows event
log if no other logger implementation is defined, so that should be the first place you look. Typically you will find an
entry in the `System` event log resembling the following message:

```text
The IceBridge service terminated with service-specific error 1.
```

Error code `1` corresponds to `EXIT_FAILURE`, the value used by the `Service` class to indicate a failure during
startup. Additional diagnostic messages may be available in the `Application` event log. See
[Service Logging Considerations](../service-logging-considerations) for more information on configuring a logger for a
Windows service.

As we mentioned earlier, insufficient access rights can also prevent a Windows service from starting successfully. By
default, a Windows service is configured to run under a local system account, in which case the service may not be able
to access resources owned by other users. It may be necessary for you to configure a service to run under a
[different account](../installing-a-windows-service), which you can do using the Services control panel. You should also
review the access rights of files and directories required by the service.

## Windows Firewall Interference

Windows Firewall blocks inbound connections by default, so a service that accepts connections needs an inbound rule that
allows them. Create this rule when you install the service. Windows offers to allow a program that starts listening only
when firewall notifications are enabled and no rule exists for the program. Answering this prompt creates allow rules
only when the interactive user has administrative rights and accepts; in the other cases it creates block rules for the
program.

For example, follow the steps below, using an account with administrative rights, to allow inbound connections to a
Glacier2 router service:

1. Select Start, type `wf.msc`, and press Enter to open the Windows Firewall with Advanced Security console.
2. Select "Inbound Rules" in the navigation pane, then select "Action" and "New Rule...".
3. On the "Rule Type" page, select "Custom", which makes the wizard show all of the following pages.
4. On the "Program" page, select "This program path" and enter the full path of the Glacier2 router executable, such as
   `C:\Program Files\ZeroC\Ice-Services-3.8.3\bin\glacier2router.exe` for an installation with the Ice Services
   installer in its default folder.
5. On the "Protocol and Ports" page, select the protocol type "TCP" and enter as local ports the ports of the router's
   endpoints.
6. On the "Scope" page, enter the remote IP addresses allowed to connect to the router, or keep the rule open to any
   address.
7. On the "Action" page, select "Allow the connection".
8. On the "Profile" page, select the network location types (Domain, Private, Public) to which the rule applies.
9. On the "Name" page, enter a name for the rule and select "Finish".

The `New-NetFirewallRule` PowerShell cmdlet creates an inbound rule from an elevated PowerShell session. In this
example, the rule allows connections to the router on TCP port 4063 in the Domain profile:

```powershell
New-NetFirewallRule -DisplayName "Glacier2 router" -Direction Inbound -Action Allow `
    -Program "C:\Program Files\ZeroC\Ice-Services-3.8.3\bin\glacier2router.exe" `
    -Protocol TCP -LocalPort 4063 -Profile Domain
```

A rule that names the program and leaves the ports open allows connections to every port on which the program listens,
within the rule's profiles and scope. Review the endpoint configurations of your services carefully to ensure that no
unnecessary ports are opened. A rule that names ports and applies to all programs allows connections to any program
listening on these ports.

A block rule takes precedence over a conflicting allow rule. If the service remains unreachable, look in "Inbound Rules"
for the block rules that a prompt added for the service executable, and delete them.

## IceGrid Node Performance Monitoring Issues

The IceGrid node uses Windows' `Perflib` facility to obtain statistics about the CPU utilization of its host for
[load balancing](../load-balancing) purposes. Occasionally, the IceGrid node may log the following warning message when
it starts:

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

Read the error description before you change any permission: the steps below correct an access failure only.

The node initializes performance monitoring when it starts. After logging this warning, the node skips sampling the CPU
utilization and reports a load average of 0 until it exits.

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

After you correct the access rights or the group membership, restart the IceGrid node and check that it no longer logs a
performance counter warning. The [icegridadmin](../icegridadmin-command-line-tool) command `node load NAME` prints the
load averages that the node reports.

## See Also

- [Load Balancing](../load-balancing)
- [Installing a Windows Service](../installing-a-windows-service)
- [Manually Installing a Service as a Windows Service](../manually-installing-a-service-as-a-windows-service)
