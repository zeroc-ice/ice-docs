---
title: IceGridAdmin.*
---

The `IceGridAdmin.*` properties configure the IceGrid administrative tools,
[icegridadmin](../../services/icegrid/icegridadmin-command-line-tool) and
[IceGrid GUI](../../services/icegrid/icegrid-gui-tool); each entry names the tool that reads it. An
[IceGrid node](../../services/icegrid/icegrid-server-reference/icegridnode) started with `--deploy` also reads
`IceGridAdmin.AuthenticateUsingSSL`, `IceGridAdmin.Username` and `IceGridAdmin.Password`, to create the administrative
session that deploys the application.

## IceGridAdmin.AuthenticateUsingSSL

### Synopsis {% id="icegridadmin.authenticateusingssl-synopsis" %}

`IceGridAdmin.AuthenticateUsingSSL=num`

### Description {% id="icegridadmin.authenticateusingssl-description" %}

If `num` is a value greater than zero, [icegridadmin](../../services/icegrid/icegridadmin-command-line-tool) uses SSL
authentication when establishing its session with the IceGrid registry. If not defined or the value is zero,
`icegridadmin` uses user name and password authentication.

## IceGridAdmin.Host

### Synopsis {% id="icegridadmin.host-synopsis" %}

`IceGridAdmin.Host=host`

### Description {% id="icegridadmin.host-description" %}

Specifies the host of the IceGrid registry that [icegridadmin](../../services/icegrid/icegridadmin-command-line-tool)
connects to directly, at the port set by [IceGridAdmin.Port](#icegridadmin.port). When
[IceGridAdmin.AuthenticateUsingSSL](#icegridadmin.authenticateusingssl) is enabled, `icegridadmin` connects to the
registry over `ssl` only.

If this property is not set, `icegridadmin` finds the registry with
[multicast discovery](../../plugins/icelocatordiscovery), configured with the
[IceLocatorDiscovery.*](../icelocatordiscovery-properties) properties. `icegridadmin` ignores this property, and does
not use discovery, when [Ice.Default.Locator](../ice-default-properties) or
[Ice.Default.Router](../ice-default-properties) is set.

## IceGridAdmin.InstanceName

### Synopsis {% id="icegridadmin.instancename-synopsis" %}

`IceGridAdmin.InstanceName=name`

### Description {% id="icegridadmin.instancename-description" %}

Specifies the instance name that [icegridadmin](../../services/icegrid/icegridadmin-command-line-tool) expects from the
registry at [IceGridAdmin.Host](#icegridadmin.host): `icegridadmin` connects only if the registry uses this instance
name.

To limit [multicast discovery](../../plugins/icelocatordiscovery) to one instance, set
[IceLocatorDiscovery.InstanceName](../icelocatordiscovery-properties).

## IceGridAdmin.MetricsConfigs

### Synopsis {% id="icegridadmin.metricsconfigs-synopsis" %}

`IceGridAdmin.MetricsConfigs=file[,file,...]` (IceGrid GUI only)

### Description {% id="icegridadmin.metricsconfigs-description" %}

Specifies a comma-separated list of property files that customize the IceGrid GUI's metrics tables. The GUI loads its
built-in `metrics.cfg` first, then loads these files in order. Later files override earlier property values. By default,
the GUI uses only its built-in configuration. If it cannot load a file, it logs a warning and continues with the
remaining files.

The built-in `metrics.cfg` is the reference for the full format. The properties used most often are:

- `IceGridGUI.Metrics`: a list of metrics section names, separated by commas or whitespace. The GUI starts with the
  built-in section order and appends previously unseen names in the order it reads them.
- `IceGridGUI.Metrics.name`: the display name of the section named `name`.
- `IceGridGUI.Metrics.name.fields`: the ordered list of fields to display as columns in this section.
- `IceGridGUI.Metrics.name.field.columnName`: the heading for the column named `field`.
- `IceGridGUI.Metrics.name.field.columnToolTip`: the tooltip for that column's heading.

For a field containing nested metrics, such as an invocation's `remotes`, `IceGridGUI.Metrics.name.field.fields` lists
the columns in the nested table. Configure their headings and tooltips with
`IceGridGUI.Metrics.name.field.nestedField.columnName` and `.columnToolTip`.

For example, a custom file can reduce the Connections table to three columns and rename its Current column:

```ini
IceGridGUI.Metrics.Connection.fields=id current total
IceGridGUI.Metrics.Connection.current.columnName=Open
IceGridGUI.Metrics.Connection.current.columnToolTip=Currently open connections
```

## IceGridAdmin.Password

### Synopsis {% id="icegridadmin.password-synopsis" %}

`IceGridAdmin.Password=password`

### Description {% id="icegridadmin.password-description" %}

Specifies the password that [icegridadmin](../../services/icegrid/icegridadmin-command-line-tool) should use when
authenticating its session with the IceGrid registry. For security reasons you may prefer not to define a password in a
plain-text configuration property, in which case you should omit this property and allow `icegridadmin` to prompt you
for it interactively. This property is ignored when SSL authentication is enabled via
[IceGridAdmin.AuthenticateUsingSSL](#icegridadmin.authenticateusingssl).

## IceGridAdmin.Port

### Synopsis {% id="icegridadmin.port-synopsis" %}

`IceGridAdmin.Port=port`

### Description {% id="icegridadmin.port-description" %}

Specifies the port of the IceGrid registry that [icegridadmin](../../services/icegrid/icegridadmin-command-line-tool)
connects to at [IceGridAdmin.Host](#icegridadmin.host), for both `tcp` and `ssl`. If not set, `icegridadmin` uses port
`4061` for `tcp` and port `4062` for `ssl`.

This property has no effect unless a host is given, with `IceGridAdmin.Host` or the `--host` option.

## IceGridAdmin.Replica

### Synopsis {% id="icegridadmin.replica-synopsis" %}

`IceGridAdmin.Replica=name`

### Description {% id="icegridadmin.replica-description" %}

Specifies the name of the [registry replica](../../services/icegrid/registry-replication) that
[icegridadmin](../../services/icegrid/icegridadmin-command-line-tool) should contact. If not defined, the default value
is `Master`.

## IceGridAdmin.Server._AdapterProperty_

### Synopsis {% id="icegridadmin.server.adapterproperty-synopsis" %}

`IceGridAdmin.Server.AdapterProperty=value`

### Description {% id="icegridadmin.server.adapterproperty-description" %}

When `icegridadmin` is started with the `--server` option, `icegridadmin` creates an object adapter named
`IceGridAdmin.Server` to host its file parser object. [adapter properties](../object-adapter-properties) can be used to
configure this object adapter. When `IceGridAdmin.Server.Endpoints` is left unset, `icegridadmin` uses
`tcp -h 127.0.0.1` for these endpoints.

## IceGridAdmin.Trace.Observers

### Synopsis {% id="icegridadmin.trace.observers-synopsis" %}

`IceGridAdmin.Trace.Observers=num`

### Description {% id="icegridadmin.trace.observers-description" %}

If `num` is a value greater than zero, IceGrid GUI displays trace information about the observer callbacks it receives
from the registry. If not defined, the default value is zero.

## IceGridAdmin.Trace.SaveToRegistry

### Synopsis {% id="icegridadmin.trace.savetoregistry-synopsis" %}

`IceGridAdmin.Trace.SaveToRegistry=num`

### Description {% id="icegridadmin.trace.savetoregistry-description" %}

If `num` is a value greater than zero, IceGrid GUI displays trace information about the modifications it commits to the
registry. If not defined, the default value is zero.

## IceGridAdmin.Username

### Synopsis {% id="icegridadmin.username-synopsis" %}

`IceGridAdmin.Username=name`

### Description {% id="icegridadmin.username-description" %}

Specifies the username that [icegridadmin](../../services/icegrid/icegridadmin-command-line-tool) should use when
authenticating its session with the IceGrid registry. This property is ignored when SSL authentication is enabled via
[IceGridAdmin.AuthenticateUsingSSL](#icegridadmin.authenticateusingssl).
