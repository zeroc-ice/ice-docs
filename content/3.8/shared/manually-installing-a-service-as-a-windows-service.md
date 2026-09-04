---
id: manually-installing-a-service-as-a-windows-service
title: Manually Installing a Service as a Windows Service
---

This page describes how to manually install and configure an Ice service as a Windows Service using the
[IceBridge](../icebridge) service as a case study. For the purposes of this discussion, we assume that Ice is installed
in the directory `C:\Program Files\ZeroC\Ice-3.8.2`. We also assume that you have administrative access to your system,
which is required by many of the installation steps discussed below.

# Selecting a User Account for the IceBridge Service

The IceBridge service can run in a regular user account, therefore we will follow
[our own recommendation](../installing-a-windows-service) and use the Local Service account.

# Configuration File for the IceBridge Service

IceBridge requires a minimal set of configuration properties. We could specify them on the service's command line, but
if we later want to modify those properties we would have to reinstall the service. Defining the properties in a file
simplifies the task of modifying the service's configuration.

Our sample IceBridge configuration is quite simple:

```
IceBridge.Source.Endpoints=tcp -p 10000
IceBridge.Target.Endpoints=tcp -h localhost -p 21112
Ice.Trace.Network=2
```

We will save our configuration properties into the following file:

```
C:\ProgramData\Ice\icebridge.cfg
```

We must also ensure that the service has permission to access its configuration file. The Ice run time never modifies a
configuration file, therefore read access is sufficient. The configuration file likely already has the necessary access
rights, which we can verify using the `icacls` utility:

```powershell
icacls C:\ProgramData\Ice\icebridge.cfg
```

# Creating the IceBridge Service

We will use Microsoft's Service Control (`sc`) utility in a command window to create the service.

{% callout type="info" %}

See
[https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/sc-create](https://learn.microsoft.com/en-us/windows-server/administration/windows-commands/sc-create)
for more information about the `SC` utility.

{% /callout %}

Our first `sc` command does the majority of the work (the command is formatted for readability but must be typed on a
single line):

```powershell
sc create icebridge binPath= "C:\Program Files\ZeroC\Ice-3.8.2\bin\icebridge.exe
  --Ice.Config=C:\ProgramData\Ice\icebridge.cfg --service icebridge"
  DisplayName= "IceBridge Server" start= auto obj= "NT Authority\LocalService"
  password= ""
```

There are several important aspects of this command:

- You must execute this command in an Administrator command prompt.
- The service name is `icebridge`. You can use whatever name you like, as long as it does not conflict with an existing
  service. Note however that this name is used in other contexts, such as in the `--service` option discussed below,
  therefore you must use it consistently.
- Following the service are several options. Note that all of the option names end with an equals sign and are separated
  from their arguments with at least one space.
- The `binPath=` option is required. We supply the full path name of the IceBridge server executable, as well as
  command-line arguments that define the location of the configuration file and the name of the service, all enclosed in
  quotes.
- The `DisplayName=` option sets a friendly name for the service.
- The `start=` option configures the start up behavior for the service. We used the argument `auto` to indicate the
  service should be started automatically when Windows boots.
- The `obj=` option selects the user account in which this service runs. As we
  [explained](../installing-a-windows-service), the `Local Service` account is appropriate for most services.
- The `password=` option supplies the password associated with the user account indicated by `obj=`. The `Local Service`
  account has an empty password.

The `sc` utility should report success if it was able to create the service as specified. You can verify that the new
service was created with this command:

```powershell
sc qc icebridge
```

Alternatively, you can start the Services administrative control panel and inspect the properties of the IceBridge
service.

If you start the control panel, you will notice that the entry for IceBridge does not have a description. To add a
description for the service, use the following command:

```powershell
sc description icebridge "Simple IceBridge Server"
```

After refreshing the list of services, you should see the new description.

# Creating the Event Log for the IceBridge Service

By default, programs such as the IceBridge service that utilize the C++ `Ice::Service` class log messages to the
`Application` event log. Below we describe how to prepare the Windows registry for the service's default behavior, and
we also show how to use a custom event log instead. We make use of Microsoft's Registry (`reg`) utility to modify the
registry, although you could also use the interactive `regedit` tool. As always, caution is recommended whenever you
modify the registry.

## Using the Application Log for the IceBridge Service

We must configure an event log source for events to display properly. The first step is to create a registry key with
the name of the source. Since the `Service` class uses the service name as the source name by default, we add the key
icebridge as shown below:

```powershell
reg add HKLM\SYSTEM\CurrentControlSet\Services\EventLog\Application\icebridge
```

Inside this key we must add a value specifies the location of the Ice run time DLL:

```powershell
reg add HKLM\SYSTEM\CurrentControlSet\Services\EventLog\Application\icebridge
  /v EventMessageFile /t REG_EXPAND_SZ
  /d "C:\Program Files\ZeroC\Ice-3.8.2\bin\ice37.dll"
```

We will also add a value indicating the types of events that the source supports:

```powershell
reg add HKLM\SYSTEM\CurrentControlSet\Services\EventLog\Application\icebridge
  /v TypesSupported /t REG_DWORD /d 7
```

The value `7` corresponds to the combination of the following event types:

- `EVENTLOG_ERROR_TYPE`
- `EVENTLOG_WARNING_TYPE`
- `EVENTLOG_INFORMATION_TYPE`

You can verify that the registry values have been defined correctly using the following command:

```powershell
reg query HKLM\SYSTEM\CurrentControlSet\Services\EventLog\Application\icebridge
```

Our configuration of the event log is now complete.

##### Changing the Source Name for the IceBridge Service

Using the configuration described in the previous section, events logged by the IceBridge service are recorded in the
event log using the source name `icebridge`. If you prefer to use a source name that differs from the service name, you
can replace icebridge in the registry commands with the name of your choosing, but you must also add a matching
definition for the property [Ice.EventLog.Source](../ice-properties) to the service's configuration file.

For example, to use the source name `Ice Bridging Service`, you would add the registry key as shown below:

```powershell
reg add
  "HKLM\SYSTEM\CurrentControlSet\Services\EventLog\Application\Ice Bridging Service"
```

The commands to add the `EventMessageFile` and `TypesSupported` values must be modified in a similar fashion. Finally,
add the following configuration property to `icebridge.cfg`:

```
Ice.EventLog.Source=Ice Bridging Service
```

## Using a Custom Log for the IceBridge Service

You may decide that you want your services to record messages into an application-specific log instead of the
`Application` log that is shared by other unrelated services. As an example, let us create a log named `MyApp`:

```powershell
reg add "HKLM\SYSTEM\CurrentControlSet\Services\EventLog\MyApp"
```

Next we add a subkey for the IceBridge service. As described in the previous section, we will use a friendlier source
name:

```powershell
reg add "HKLM\SYSTEM\CurrentControlSet\Services\EventLog\MyApp\Ice Bridging Service"
```

Now we can define values for `EventMessageFile` and `TypesSupported`:

```powershell
reg add "HKLM\SYSTEM\CurrentControlSet\Services\EventLog\MyApp\Ice Bridging Service"
  /v EventMessageFile /t REG_EXPAND_SZ
  /d "C:\Program Files\ZeroC\Ice-3.8.2\bin\ice38.dll"

reg add "HKLM\SYSTEM\CurrentControlSet\Services\EventLog\MyApp\Ice Bridging Service"
  /v TypesSupported /t REG_DWORD /d 7
```

Finally, we define `Ice.EventLog.Source` in the IceBridge service's configuration file:

```
Ice.EventLog.Source=Ice Bridging Service
```

Note that you must restart the Event Viewer control panel after adding the `MyApp` registry key in order to see the new
log.

## Registry Caching for the IceBridge Service

The first time a service logs an event, Windows' Event Log service caches the registry entries associated with the
service's source. If you wish to modify a service's event log configuration, such as changing the service to use a
custom log instead of the `Application` log, you should perform the following steps:

1. Stop the service.
2. Remove the unwanted event log registry key.
3. Add the new event log registry key(s).
4. Restart the system (or at least the Windows Event Log service).
5. Start the service and verify that the log entries appear in the intended log.

After following these steps, open a log entry and ensure that it displays properly. If it does not, for example if the
event properties indicate that the description of an event cannot be found, the problem is likely due to a misconfigured
event source. Verify that the value of `EventMessageFile` refers to the correct location of the Ice run time DLL, and
that the service is defining [Ice.EventLog.Source](../ice-properties) in its configuration file (if necessary).

# Starting the IceBridge Service

We are at last ready to start the service. In a command window, you can use the `sc` utility:

```powershell
sc start icebridge
```

The program usually responds with status information indicating that the start request is pending. You can query the
service's status to verify that it started successfully:

```powershell
sc query icebridge
```

The service should now be in the running state. If it is not in this state, open the Event Viewer control panel and
inspect the relevant log for more information that should help you to locate the problem. Even if the service started
successfully, you may still want to use the Event Viewer to confirm that the service is using the log you expected.

##### See Also

- [Installing a Windows Service](../installing-a-windows-service)
