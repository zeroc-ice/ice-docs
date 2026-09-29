---
title: IceGridAdmin.*
---

## IceGridAdmin.AuthenticateUsingSSL

### Synopsis {% id="icegridadmin.authenticateusingssl-synopsis" %}

`IceGridAdmin.AuthenticateUsingSSL=num`

### Description {% id="icegridadmin.authenticateusingssl-description" %}

If `num` is a value greater than zero, [icegridadmin](../icegridadmin-command-line-tool) uses SSL authentication when
establishing its session with the IceGrid registry. If not defined or the value is zero, `icegridadmin` uses user name
and password authentication.

## IceGridAdmin.Discovery.Address

### Synopsis {% id="icegridadmin.discovery.address-synopsis" %}

`IceGridAdmin.Discovery.Address=addr`

### Description {% id="icegridadmin.discovery.address-description" %}

Specifies the multicast IP address to use for sending [multicast discovery queries](../icelocatordiscovery). If not
defined, the default value depends on the setting of [Ice.IPv4](../ice-properties): if enabled (the default), the client
uses the address `239.255.0.1`, otherwise the client assumes it should use IPv6 and defaults to the address `ff15::1`
instead. This property is used to compose the value of
[IceGridAdmin.Discovery.Lookup](../icegridadmin-properties#icegridadmin.discovery.lookup).

## IceGridAdmin.Discovery.Interface

### Synopsis {% id="icegridadmin.discovery.interface-synopsis" %}

`IceGridAdmin.Discovery.Interface=intf`

### Description {% id="icegridadmin.discovery.interface-description" %}

Specifies the IP address of the interface to use for sending [multicast discovery queries](../icelocatordiscovery). If
not defined, the discovery will use all the network interfaces available on the system to send UDP multicast datagrams.
This property is used to compose the value of
[IceGridAdmin.Discovery.Lookup](../icegridadmin-properties#icegridadmin.discovery.lookup) and
[IceGridAdmin.Discovery.Reply.Endpoints](../icegridadmin-properties#icegridadmin.discovery.reply.adapterproperty).

## IceGridAdmin.Discovery.Lookup

### Synopsis {% id="icegridadmin.discovery.lookup-synopsis" %}

`IceGridAdmin.Discovery.Lookup=endpoints`

### Description {% id="icegridadmin.discovery.lookup-description" %}

Specifies the endpoints that the client uses to send [multicast discovery queries](../icelocatordiscovery). If not
defined, the endpoint is composed as follows:

`udp -h addr -p port [--interface intf]`

where `addr` is the value of
[IceGridAdmin.Discovery.Address](../icegridadmin-properties#icegridadmin.discovery.address), `port` is the value of
[IceGridAdmin.Port](../icegridadmin-properties#icegridadmin.port) and `intf` is the value of
[IceGridAdmin.Discovery.Interface](../icegridadmin-properties#icegridadmin.discovery.interface). If multiple endpoints
are defined, the queries will be sent on each endpoint.

## IceGridAdmin.Discovery.Reply._AdapterProperty_

### Synopsis {% id="icegridadmin.discovery.reply.adapterproperty-synopsis" %}

`IceGridAdmin.Discovery.Reply.AdapterProperty=value`

### Description {% id="icegridadmin.discovery.reply.adapterproperty-description" %}

The client creates an object adapter named `IceGridAdmin.Discovery.Reply` for receiving replies to
[multicast discovery queries](../icelocatordiscovery). If not otherwise defined by
`IceGridAdmin.Discovery.Reply.Endpoints`, the endpoint for this object adapter is composed as follows:

`udp [-h intf]`

where `intf` is the value of
[IceGridAdmin.Discovery.Interface](../icegridadmin-properties#icegridadmin.discovery.interface). A fixed port is not
necessary for this endpoint.

You don't normally need to set [other properties](../object-adapter-properties) for this object adapter.

## IceGridAdmin.Host

### Synopsis {% id="icegridadmin.host-synopsis" %}

`IceGridAdmin.Host=host`

### Description {% id="icegridadmin.host-description" %}

When used together with [IceGridAdmin.Port](../icegridadmin-properties#icegridadmin.port),
[icegridadmin](../icegridadmin-command-line-tool) connects directly to the target registry at the specified host and
port.

## IceGridAdmin.InstanceName

### Synopsis {% id="icegridadmin.instancename-synopsis" %}

`IceGridAdmin.InstanceName=name`

### Description {% id="icegridadmin.instancename-description" %}

Specifies the name of an IceGrid instance to which [icegridadmin](../icegridadmin-command-line-tool) will connect.

When using [multicast discovery](../icelocatordiscovery), you can define this property to limit your discovery results
only to those locators deployed for the given instance, in case you have multiple unrelated IceGrid instances deployed
that use the same multicast address and port.

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

Specifies the password that [icegridadmin](../icegridadmin-command-line-tool) should use when authenticating its session
with the IceGrid registry. For security reasons you may prefer not to define a password in a plain-text configuration
property, in which case you should omit this property and allow `icegridadmin` to prompt you for it interactively. This
property is ignored when SSL authentication is enabled via
[IceGridAdmin.AuthenticateUsingSSL](../icegridadmin-properties#icegridadmin.authenticateusingssl).

## IceGridAdmin.Port

### Synopsis {% id="icegridadmin.port-synopsis" %}

`IceGridAdmin.Port=port`

### Description {% id="icegridadmin.port-description" %}

When used together with [IceGridAdmin.Host](../icegridadmin-properties#icegridadmin.host),
[icegridadmin](../icegridadmin-command-line-tool) connects directly to the target registry at the specified host and
port.

When using [multicast discovery](../icelocatordiscovery), this property specifies the port to use for sending multicast
discovery queries. This property is also used to compose the value of
[IceGridAdmin.Discovery.Lookup](../icegridadmin-properties#icegridadmin.discovery.lookup).

If not set, the default value is `4061`.

## IceGridAdmin.Replica

### Synopsis {% id="icegridadmin.replica-synopsis" %}

`IceGridAdmin.Replica=name`

### Description {% id="icegridadmin.replica-description" %}

Specifies the name of the [registry replica](../registry-replication) that
[icegridadmin](../icegridadmin-command-line-tool) should contact. If not defined, the default value is `Master`.

## IceGridAdmin.Server._AdapterProperty_

### Synopsis {% id="icegridadmin.server.adapterproperty-synopsis" %}

`IceGridAdmin.Server.AdapterProperty=value`

### Description {% id="icegridadmin.server.adapterproperty-description" %}

When `icegridadmin` is started with the `--server` option, `icegridadmin` creates an object adapter named
`IceGridAdmin.Server` to host its file parser object. [adapter properties](../object-adapter-properties) can be used to
configure this object adapter. When `IceGridAdmin.Server.Endpoints` is left unset, `icegridadmin` uses
`"tcp -h localhost"` for these endpoints.

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

Specifies the username that [icegridadmin](../icegridadmin-command-line-tool) should use when authenticating its session
with the IceGrid registry. This property is ignored when SSL authentication is enabled via
[IceGridAdmin.AuthenticateUsingSSL](../icegridadmin-properties#icegridadmin.authenticateusingssl).
