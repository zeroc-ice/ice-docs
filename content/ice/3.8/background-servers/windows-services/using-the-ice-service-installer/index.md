---
title: Using the Ice Service Installer
---

Ice provides the command-line tool `iceserviceinstall` to assist you in installing and uninstalling the following Ice
services as Windows services:

- [IceGrid registry](../../../services/icegrid/icegrid-server-reference/icegridregistry)
- [IceGrid node](../../../services/icegrid/icegrid-server-reference/icegridnode)
- [Glacier2 router](../../../services/glacier2/getting-started-with-glacier2)

Ice includes other programs that can also be run as Windows services, such as the [IceBox](../../../services/icebox)
server. Typically it is not necessary to install these programs as Windows services because they can be launched by an
IceGrid node service. However, if you wish to run an IceBox as a Windows service without the use of IceGrid, you must
[manually install](../manually-installing-a-service-as-a-windows-service) the service.

Here we describe how to use the Ice service installer and discuss its actions and prerequisites.

## `iceserviceinstall` Command Line Options

`iceserviceinstall` supports the following options and arguments:

```text
iceserviceinstall [options] service config-file [property ...]

Options:
-h, --help           Show this message.
-n, --nopause        Do not call pause after displaying a message.
-v, --version        Display the Ice version.
-u, --uninstall      Uninstall the Windows service.
```

The `service` and `config-file` arguments are required during installation and uninstallation.

The `service` argument selects the type of service you are installing; use one of the following values:

- `icegridregistry`
- `icegridnode`
- `glacier2router`

Note that the Ice service installer currently does not support the installation of an IceGrid node with a collocated
registry, therefore you must install the registry and node separately.

The `config-file` argument names the configuration of the service: either the path of an
[Ice configuration file](../../../runtime/properties-and-configuration/using-configuration-files) or, when the argument
starts with `HKLM\`, a key under `HKEY_LOCAL_MACHINE` that holds the service's properties in the
[Windows registry](../../../runtime/properties-and-configuration/alternate-property-stores).

When installing a service, you define the installer's own properties on the command line using the --`name`=`value`
syntax. The supported properties are described [below](#iceserviceinstall-properties).

## Security Considerations for Ice Services

None of the Ice services require privileges beyond a normal user account. In the case of the IceGrid node service in
particular, we do not recommend running it in a [user account](../installing-a-windows-service) with elevated privileges
because the node launches server executables, and those servers inherit its access rights.

## `iceserviceinstall` Configuration File

The Ice service installer requires the configuration of the service being installed or uninstalled. When `config-file`
names a configuration file, the tool needs its path name for several reasons:

- During installation, it verifies that the configuration file has sufficient access rights.
- It configures a newly-installed service to load the configuration file using its absolute path name, therefore you
  must decide in advance where the file will be located.
- It reads the configuration file and examines certain service-specific properties. For example, prior to installing an
  IceGrid registry service, the tool verifies that the directory specified by the property
  [IceGrid.Registry.LMDB.Path](../../../property-reference/icegrid-properties) has sufficient access rights.

When `config-file` names a registry key, the tool reads the service's properties from that key and registers the service
with `--Ice.Config` set to the same key. Make sure the account that runs the service can read this key.

You can edit the service's configuration after installation, except for the properties in the table below: the installer
derives the service name and other settings from them. To change one of these properties, uninstall the service, edit
the configuration, then install the service again.

| **Property**                                                                 | **Service**                   | **Description**                                                                                                                                                                            |
| ---------------------------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Glacier2.InstanceName](../../../property-reference/glacier2-properties)     | Glacier2 Router               | The installer includes the value in the service name and, unless `DisplayName` is set, in the default display name.                                                                        |
| [IceGrid.InstanceName](../../../property-reference/icegrid-properties)       | IceGrid Registry              | The installer includes the value in the service name and, unless `DisplayName` is set, in the default display name.                                                                        |
| [IceGrid.Node.Data](../../../property-reference/icegrid-properties)          | IceGrid Node                  | Required when installing; must be an absolute path. The installer creates the directory if necessary and grants the `ObjectName` account full access to it.                                |
| [IceGrid.Node.Name](../../../property-reference/icegrid-properties)          | IceGrid Node                  | Required. The installer includes the value in the service name and, unless `DisplayName` is set, in the default display name.                                                              |
| [IceGrid.Registry.LMDB.Path](../../../property-reference/icegrid-properties) | IceGrid Registry              | Required when installing; must be an absolute path. The installer creates the directory if necessary and grants the `ObjectName` account full access to it.                                |
| [Ice.Default.Locator](../../../property-reference/ice-default-properties)    | IceGrid Node, Glacier2 Router | The IceGrid instance name is the category of the identity in this proxy. A node requires a proxy whose identity has a category; a router requires one when `DependOnRegistry` is not zero. |
| [Ice.EventLog.Source](../../../property-reference/ice-properties)            | All                           | Specifies the name of an event log source for the service.                                                                                                                                 |

The steps performed by the tool during an installation are described in detail [below](#service-installation-process).

### Sample Configuration Files

Ice includes sample configuration files for the IceGrid and Glacier2 services in the `config` subdirectory of your Ice
installation. We recommend that you review the comments and settings in these files to familiarize yourself with a
typical configuration of each service.

You can modify a configuration file to suit your needs or copy one to use as a starting point for your own
configuration.

## `iceserviceinstall` Properties

The Ice service installer uses a set of optional properties that customize the installation process. You define these
properties on the command line using the familiar --`name`=`value` syntax:

```powershell
iceserviceinstall --AutoStart=0 --DisplayName="My registry" icegridregistry registry.cfg
```

The installer's properties are listed below:

- AutoStart=_num_ If not specified, the default _num_ value is 1. You should select 2, Automatic (Delayed Start), when
  your service is listening on a Wireless LAN interface.

| _**Num**_**value** | **Service Startup Type**  |
| ------------------ | ------------------------- |
| 0                  | Manual                    |
| 1                  | Automatic                 |
| 2                  | Automatic (Delayed Start) |

- Debug=_num_ If _num_ is not zero, iceserviceinstall outputs diagnostics when installing a service. If not specified,
  the default value is 0.
- `DependOnRegistry=num` If num is not zero, the installer makes the service depend on the Windows service
  `icegridregistry.<instance-name>` on the same host, so Windows starts that registry before this service.
  `<instance-name>` is the category of the identity in the
  [Ice.Default.Locator](../../../property-reference/ice-default-properties) proxy defined in `config-file`. This
  property applies to an IceGrid node and a Glacier2 router; installing an IceGrid registry with a nonzero value fails.
  If not specified, the default value is zero.
- `Description=value` A brief description of the service. If not specified, a general description is used.
- `DisplayName=name` The friendly name that identifies the service to the user. If not specified, `iceserviceinstall`
  composes a default display name.
- `EventLog=name` The name of the event log used by the service. If not specified, the default value is `Application`.
- `ImagePath=path` The path name of the service executable. If not specified, `iceserviceinstall` assumes the service
  executable resides in the same directory as itself and fails if the executable is not found. The directory of the
  service executable must also contain `ice38.dll` or `ice38d.dll`: `iceserviceinstall` registers that DLL as the
  message file of the service's event log source, and fails if it finds neither.
- `ObjectName=name` Specifies the account used to run the service. If not specified, the default value is
  `NT Authority\LocalService`.
- `Password=value` The password required by the account specified in `ObjectName`.

## Service Installation Process

The Ice service installer performs a number of steps to install a service. As discussed
[earlier](#iceserviceinstall-configuration-file), you must specify the service's configuration file or registry key
because the service installer uses certain properties during the installation process. The actions taken by the service
installer are described below:

- Obtain the service's _instance name_ from `config-file`. For an IceGrid registry, it is the value of
  [IceGrid.InstanceName](../../../property-reference/icegrid-properties), `IceGrid` by default. For an IceGrid node, it
  is the category of the identity in the [Ice.Default.Locator](../../../property-reference/ice-default-properties)
  proxy, which the node's configuration must set. For a Glacier2 router, it is the value of
  [Glacier2.InstanceName](../../../property-reference/glacier2-properties), `Glacier2` by default.
- For an IceGrid node, obtain the node's name from the property
  [IceGrid.Node.Name](../../../property-reference/icegrid-properties). This property must be defined when installing or
  uninstalling a node.
- Compose the service name from the service type, instance name, and node name (for an IceGrid node). For example, the
  default service name for an IceGrid registry is `icegridregistry.IceGrid`. Note that the service name is not the same
  as the display name.
- Resolve the user account specified by `ObjectName`.
- Grant `ObjectName` read and execute permissions on the parent directory of `ImagePath`.
- For an IceGrid registry, create the data directory specified by the property
  [IceGrid.Registry.LMDB.Path](../../../property-reference/icegrid-properties) and grant the user account specified by
  `ObjectName` full access to it.
- For an IceGrid node, create the data directory specified by the property
  [IceGrid.Node.Data](../../../property-reference/icegrid-properties) and grant the user account specified by
  `ObjectName` full access to it.
- For an IceGrid node, ensure that the user account specified by `ObjectName` has read access to the following registry
  key: `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Perflib` This key allows the node to access
  [CPU utilization statistics](../troubleshooting-windows-services).
- Ensure that the user account specified by `ObjectName` has read access to the configuration file. The installer skips
  this step when `config-file` names a registry key.
- Create a new Windows event log by adding the registry key specified by `EventLog`.
- Add an event log source under `EventLog` for the source name specified by
  [Ice.EventLog.Source](../../../property-reference/ice-properties). If this property is not defined, the service name
  is used as the source name.
- Install the service with the startup type selected by `AutoStart`, including command line arguments that specify the
  service name (`--service name`) and the absolute path name of the configuration file or the registry key
  (`--Ice.Config=config-file`).

The installer does not start the new service. Start it with the Services control panel or with `sc.exe`, for example
`sc.exe start icegridregistry.IceGrid`.

The Ice service installer does not verify that the user account specified by `ObjectName` has the right to "Log on as a
service".

## Uninstalling a Windows Service

When uninstalling a service, the Ice service installer asks Windows to stop the service and then to delete it; Windows
completes the deletion once the service has stopped. The installer then removes the service's event log source and, if
this source was in a log other than `Application`, the log's registry key, unless other sources still use it.

The installer computes the service name and the event log source from `config-file`, so uninstall a service with the
configuration you installed it with.

## See Also

- [icegridregistry](../../../services/icegrid/icegrid-server-reference/icegridregistry)
- [icegridnode](../../../services/icegrid/icegrid-server-reference/icegridnode)
- [Getting Started with Glacier2](../../../services/glacier2/getting-started-with-glacier2)
- [IceBox](../../../services/icebox)
- [Installing a Windows Service](../installing-a-windows-service)
- [Manually Installing a Service as a Windows Service](../manually-installing-a-service-as-a-windows-service)
- [Troubleshooting Windows Services](../troubleshooting-windows-services)
- [IceGrid.*](../../../property-reference/icegrid-properties)
- [Glacier2.*](../../../property-reference/glacier2-properties)
