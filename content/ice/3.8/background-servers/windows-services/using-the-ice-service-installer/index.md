---
title: Using the Ice Service Installer
---

Ice provides the command-line tool `iceserviceinstall` to assist you in installing and uninstalling the following Ice
services as Windows services:

- [IceGrid registry](../icegridregistry)
- [IceGrid node](../icegridnode)
- [Glacier2 router](../getting-started-with-glacier2)

Ice includes other programs that can also be run as Windows services, such as the [IceBox](../icebox) server. Typically
it is not necessary to install these programs as Windows services because they can be launched by an IceGrid node
service. However, if you wish to run an IceBox as a Windows service without the use of IceGrid, you must
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
[Ice configuration file](../using-the-ice-service-installer) or, when the argument starts with `HKLM\`, a key under
`HKEY_LOCAL_MACHINE` that holds the service's properties in the [Windows registry](../alternate-property-stores).

When installing a service, you define the installer's own properties on the command line using the --`name`=`value`
syntax. The supported properties are described [below](../using-the-ice-service-installer).

## Security Considerations for Ice Services

None of the Ice services require privileges beyond a normal user account. In the case of the IceGrid node service in
particular, we do not recommend running it in a [user account](../installing-a-windows-service) with elevated privileges
because the service is responsible for launching server executables, and those servers would inherit the node's access
rights.

## `iceserviceinstall` Configuration File

The Ice service installer requires the configuration of the service being installed or uninstalled. When `config-file`
names a configuration file, the tool needs its path name for several reasons:

- During installation, it verifies that the configuration file has sufficient access rights.
- It configures a newly-installed service to load the configuration file using its absolute path name, therefore you
  must decide in advance where the file will be located.
- It reads the configuration file and examines certain service-specific properties. For example, prior to installing an
  IceGrid registry service, the tool verifies that the directory specified by the property
  [IceGrid.Registry.LMDB.Path](../icegrid-properties) has sufficient access rights.

When `config-file` names a registry key, the tool reads the service's properties from that key and configures the
service to load its configuration from the same key. The tool leaves the access rights of the key unchanged, so the
account that runs the service must already be able to read it.

You may still modify a service's configuration file after installation, but uninstall the service before you change any
of the properties that influence the service installer's actions, and reinstall it afterwards. The table below describes
the service properties that affect the installer:

| **Property**                                        | **Service**                   | **Description**                                                                                                                                                                            |
| --------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Glacier2.InstanceName](../glacier2-properties)     | Glacier2 Router               | Value appears in the service name; also included in the default display name if one is not defined.                                                                                        |
| [IceGrid.InstanceName](../icegrid-properties)       | IceGrid Registry              | Value appears in the service name; also included in the default display name if one is not defined.                                                                                        |
| [IceGrid.Node.Data](../icegrid-properties)          | IceGrid Node                  | Required when installing; must be an absolute path. Directory is created if necessary; access rights are verified.                                                                         |
| [IceGrid.Node.Name](../icegrid-properties)          | IceGrid Node                  | Required. Value appears in the service name; also included in the default display name if one is not defined.                                                                              |
| [IceGrid.Registry.LMDB.Path](../icegrid-properties) | IceGrid Registry              | Required when installing; must be an absolute path. Directory is created if necessary; access rights are verified.                                                                         |
| [Ice.Default.Locator](../ice-default-properties)    | IceGrid Node, Glacier2 Router | The IceGrid instance name is the category of the identity in this proxy. A node requires a proxy whose identity has a category; a router requires one when `DependOnRegistry` is not zero. |
| [Ice.EventLog.Source](../ice-properties)            | All                           | Specifies the name of an event log source for the service.                                                                                                                                 |

The steps performed by the tool during an installation are described in detail
[below](../using-the-ice-service-installer).

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

`iceserviceinstall` also reads these properties from its own configuration, which it loads like any Ice program from the
files named by `--Ice.Config` or the `ICE_CONFIG` environment variable; a value given on the command line takes
precedence. Keep the installer's properties in a file of their own: `iceserviceinstall` reads `config-file` only for the
service properties listed above, and it rejects `IceGrid` and `Glacier2` properties in its own configuration.

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
- `DependOnRegistry=num` If num is not zero, the service is configured to depend on the Windows service
  `icegridregistry.<instance-name>` on the same host, meaning Windows will start that registry prior to starting this
  service. `<instance-name>` is the category of the identity in the [Ice.Default.Locator](../ice-default-properties)
  proxy defined in `config-file`. This property applies to an IceGrid node and a Glacier2 router; installing an IceGrid
  registry with a nonzero value fails. If not specified, the default value is zero.
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
[earlier](../using-the-ice-service-installer), you must specify the path name of the service's configuration file
because the service installer uses certain properties during the installation process. The actions taken by the service
installer are described below:

- Obtain the service's _instance name_ from the configuration file. The instance name is specified by the property
  [IceGrid.InstanceName](../icegrid-properties) or [Glacier2.InstanceName](../glacier2-properties). If an instance name
  is not specified, the default value is `IceGrid` or `Glacier2`, respectively. For an IceGrid node or a Glacier2
  router, the IceGrid instance name is the category of the identity in the
  [Ice.Default.Locator](../ice-default-properties) proxy. A node requires this category, as does a router installed with
  a nonzero `DependOnRegistry`.
- For an IceGrid node, obtain the node's name from the property [IceGrid.Node.Name](../icegrid-properties). This
  property must be defined when installing or uninstalling a node.
- Compose the service name from the service type, instance name, and node name (for an IceGrid node). For example, the
  default service name for an IceGrid registry is `icegridregistry.IceGrid`. Note that the service name is not the same
  as the display name.
- Resolve the user account specified by `ObjectName`.
- Grant `ObjectName` read and execute permissions on the parent directory of `ImagePath`.
- For an IceGrid registry, create the data directory specified by the property
  [IceGrid.Registry.LMDB.Path](../icegrid-properties) and ensure that the user account specified by `ObjectName` has
  read/write access to the directory. The installation fails unless this property is set to an absolute path.
- For an IceGrid node, create the data directory specified by the property [IceGrid.Node.Data](../icegrid-properties)
  and ensure that the user account specified by `ObjectName` has read/write access to the directory. The installation
  fails unless this property is set to an absolute path.
- For an IceGrid node, ensure that the user account specified by `ObjectName` has read access to the following registry
  key: `HKLM\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Perflib` This key allows the node to access
  [CPU utilization statistics](../troubleshooting-windows-services).
- Ensure that the user account specified by `ObjectName` has read access to the configuration file. The installer skips
  this step when `config-file` names a registry key.
- Create a new Windows event log by adding the registry key specified by `EventLog`.
- Add an event log source under `EventLog` for the source name specified by [Ice.EventLog.Source](../ice-properties). If
  this property is not defined, the service name is used as the source name.
- Select the service's dependency: the Windows service `icegridregistry.<instance-name>` when `DependOnRegistry` is not
  zero; otherwise the first of the Windows services `netprofm` and `Nla` that the installer can open, if any.
- Install the service with the startup type selected by `AutoStart`, including command line arguments that specify the
  service name (`--service name`) and the absolute path name of the configuration file or the registry key
  (`--Ice.Config=config-file`).

The installer leaves the new service stopped. Start it yourself, for example with `sc start icegridregistry.IceGrid`.

The Ice service installer currently does not**verify that the user account specified by `ObjectName` has the right to
"Log on as a service".

## Uninstalling a Windows Service

When uninstalling an existing service, the Ice service installer asks Windows to stop the service, then asks Windows to
delete it without waiting for the service to stop. Windows removes the service once it has stopped and every open handle
to it is closed. If you need to replace the service's files or install the service again, first check with
`sc query <service-name>` that the service is gone.

The installer then removes the service's event log source and, if the source belonged to a log other than `Application`,
attempts to delete that log's registry key. Windows keeps a key that still contains other keys, such as the sources of
other services.

The installer computes the service name and the event log source name from `config-file`, so uninstall a service with
the configuration you installed it with. The installer properties have no effect on uninstallation.

## See Also

- [icegridregistry](../icegridregistry)
- [icegridnode](../icegridnode)
- [Getting Started with Glacier2](../getting-started-with-glacier2)
- [IceBox](../icebox)
- [Installing a Windows Service](../installing-a-windows-service)
- [Manually Installing a Service as a Windows Service](../manually-installing-a-service-as-a-windows-service)
- [Troubleshooting Windows Services](../troubleshooting-windows-services)
- [IceGrid.*](../icegrid-properties)
- [Glacier2.*](../glacier2-properties)
