---
title: Ice.Admin.*
---

{% iflang langs="js" %}

{% callout type="info" title="JavaScript" %}

Ice for JavaScript does not support the properties on this page. Setting any of them throws `PropertyException`.

{% /callout %}

{% /iflang %}

## Ice.Admin._AdapterProperty_

### Synopsis {% id="ice.admin.adapterproperty-synopsis" %}

`Ice.Admin.AdapterProperty=value`

### Description {% id="ice.admin.adapterproperty-description" %}

The Ice run time creates and activates an
[administrative object adapter](../../administration/administrative-facility/creating-the-admin-object) named
`Ice.Admin` if the [Administrative Facility](../../administration/administrative-facility) is enabled,
[Ice.Admin.Endpoints](../object-adapter-properties) is defined and one of the following are true:

- [Ice.Admin.DelayCreation](#ice.admin.delaycreation) is not enabled
- [Ice.Admin.DelayCreation](#ice.admin.delaycreation) is enabled and the application calls `getAdmin` on the
  communicator after communicator initialization
- the application calls [createAdmin](../../administration/administrative-facility/creating-the-admin-object) with a
  null `adminAdapter` parameter

This object adapter is created to host the [admin object](../../administration/administrative-facility/admin-object).
[Adapter properties](../object-adapter-properties) can be used to configure the `Ice.Admin` object adapter.

Note that enabling the `Ice.Admin` object adapter is a security risk because a hostile client could use the
administrative object to shut down the process. As a result, the
[endpoints](../../runtime/dispatch/object-adapter-endpoints) for this object adapter should be carefully defined so that
only trusted clients are allowed to use it.

## Ice.Admin.DelayCreation

### Synopsis {% id="ice.admin.delaycreation-synopsis" %}

`Ice.Admin.DelayCreation=num`

### Description {% id="ice.admin.delaycreation-description" %}

If `num` is a value greater than zero, the Ice run time delays the creation of the `Ice.Admin`
[administrative object adapter](../../administration/administrative-facility/creating-the-admin-object) until `getAdmin`
is invoked on the communicator. If not specified, the default value is zero, meaning the `Ice.Admin` object adapter is
created immediately after all plug-ins are initialized, provided [Ice.Admin.Endpoints](#ice.admin.adapterproperty) is
defined.

## Ice.Admin.Enabled

### Synopsis {% id="ice.admin.enabled-synopsis" %}

`Ice.Admin.Enabled=num`

### Description {% id="ice.admin.enabled-description" %}

`1` enables the [Administrative Facility](../../administration/administrative-facility) and `0` disables it. When this
property is unset, the facility is enabled if and only if [Ice.Admin.Endpoints](#ice.admin.adapterproperty) is
non-empty.

## Ice.Admin.Facets

### Synopsis {% id="ice.admin.facets-synopsis" %}

`Ice.Admin.Facets=name [name ...]`

### Description {% id="ice.admin.facets-description" %}

Specifies the facets enabled by the [administrative object](../../administration/administrative-facility/admin-object),
allowing you to [filter](../../administration/administrative-facility/filtering-administrative-facets) the facets that
the administrative object enables by default. Facet names are delimited by commas or white space. A facet name that
contains white space must be enclosed in single or double quotes. If not specified, all facets are enabled. While the
Ice run time creates only the built-in facets (such as Process and Properties) that are enabled, you can create
administrative facets without checking the value of this property. Ice ensures that only enabled administrative facets
are available to clients.

## Ice.Admin.InstanceName

### Synopsis {% id="ice.admin.instancename-synopsis" %}

`Ice.Admin.InstanceName=name`

### Description {% id="ice.admin.instancename-description" %}

Specifies an identity category for the [administrative object](../../administration/administrative-facility), when this
object is created during communicator initialization or by a call to `getAdmin` on the communicator. If defined, the
identity of the object becomes `name/admin`. If not specified, the default identity category is a UUID.

## Ice.Admin.Logger.KeepLogs

### Synopsis {% id="ice.admin.logger.keeplogs-synopsis" %}

`Ice.Admin.Logger.KeepLogs=num`

### Description {% id="ice.admin.logger.keeplogs-description" %}

The [Logger admin facet](../../administration/administrative-facility/logger-facet), when enabled, caches up the _num_
most recent log messages with a type other than `Ice::TraceMessage`. When _num_ is 0 or less than 0, the Logger facet
does not cache any of these log messages. The default value for _num_ is 100.

## Ice.Admin.Logger.KeepTraces

### Synopsis {% id="ice.admin.logger.keeptraces-synopsis" %}

`Ice.Admin.Logger.KeepTraces=num`

### Description {% id="ice.admin.logger.keeptraces-description" %}

The [Logger admin facet](../../administration/administrative-facility/logger-facet), when enabled, caches up the _num_
most recent log messages with type `Ice::TraceMessage`. When _num_ is 0 or less than 0, the Logger facet does not cache
any of these trace messages. The default value for _num_ is 100.

## Ice.Admin.Logger.Properties

### Synopsis {% id="ice.admin.logger.properties-synopsis" %}

`Ice.Admin.Logger.Properties=propertyList`

### Description {% id="ice.admin.logger.properties-description" %}

The [Logger admin facet](../../administration/administrative-facility/logger-facet), when enabled, creates its own
communicator to send log messages to attached remote loggers. Without this sub-communicator, sending log messages to
remote loggers could trigger more local logging, which in turn would generate more logs sent to remote loggers: a single
genuine log could trigger an infinite number of log messages.

Ice copies properties with the prefixes `Ice.Default.Locator` and `IceSSL.` from the application's communicator to this
sub-communicator, then applies the properties in _propertyList_. These additional properties override copied values.

Ice reads _propertyList_ as a [list of strings](../../runtime/properties-and-configuration/properties-class), each using
the syntax `PropertyName=PropertyValue`. For example, this property enables protocol tracing on the Logger facet's
sub-communicator:

```config
Ice.Admin.Logger.Properties=Ice.Trace.Protocol=1
```

## Ice.Admin.ServerId

### Synopsis {% id="ice.admin.serverid-synopsis" %}

`Ice.Admin.ServerId=id`

### Description {% id="ice.admin.serverid-description" %}

Specifies an identifier that uniquely identifies the process when the Ice runtime
[registers the Process facet of its admin object with the locator registry](../../services/icegrid/icegrid-and-the-administrative-facility).
