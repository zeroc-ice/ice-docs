---
title: Ice.Admin.*
---

{% iflang langs="js" %}

{% callout type="info" title="JavaScript" %}

Ice for JavaScript does not support the properties on this page. Setting any of them throws `PropertyException`.

{% /callout %}

{% /iflang %}

# Ice.Admin._AdapterProperty_

#### Synopsis

`Ice.Admin.AdapterProperty=value`

#### Description

The Ice run time creates and activates an [administrative object adapter](../creating-the-admin-object) named
`Ice.Admin` if the [Administrative Facility](../administrative-facility) is enabled,
[Ice.Admin.Endpoints](../object-adapter-properties) is defined and one of the following are true:

- [Ice.Admin.DelayCreation](../ice-admin-properties#ice.admin.delaycreation) is not enabled
- [Ice.Admin.DelayCreation](../ice-admin-properties#ice.admin.delaycreation) is enabled and the application calls
  `getAdmin` on the communicator after communicator initialization
- the application calls [createAdmin](../creating-the-admin-object) with a null `adminAdapter` parameter

This object adapter is created to host the [admin object](../admin-object).
[Adapter properties](../object-adapter-properties) can be used to configure the `Ice.Admin` object adapter.

Note that enabling the `Ice.Admin` object adapter is a security risk because a hostile client could use the
administrative object to shut down the process. As a result, the [endpoints](../object-adapter-endpoints) for this
object adapter should be carefully defined so that only trusted clients are allowed to use it.

# Ice.Admin.DelayCreation

#### Synopsis

`Ice.Admin.DelayCreation=num`

#### Description

If `num` is a value greater than zero, the Ice run time delays the creation of the `Ice.Admin`
[administrative object adapter](../creating-the-admin-object) until `getAdmin` is invoked on the communicator. If not
specified, the default value is zero, meaning the `Ice.Admin` object adapter is created immediately after all plug-ins
are initialized, provided [Ice.Admin.Endpoints](../ice-admin-properties#ice.admin.adapterproperty) is defined.

# Ice.Admin.Enabled

#### Synopsis

`Ice.Admin.Enabled=num`

#### Description

If `num` is a value greater than zero, the [Administrative Facility](../administrative-facility) is enabled. If `num` is
a zero or a negative value, the [Administrative Facility](../administrative-facility) is disabled. If this property is
not set at all, the [Administrative Facility](../administrative-facility) is enabled when
[Ice.Admin.Endpoints](../ice-admin-properties#ice.admin.adapterproperty) is defined and not empty, and is disabled
otherwise.

# Ice.Admin.Facets

#### Synopsis

`Ice.Admin.Facets=name [name ...]`

#### Description

Specifies the facets enabled by the [administrative object](../admin-object), allowing you to
[filter](../filtering-administrative-facets) the facets that the administrative object enables by default. Facet names
are delimited by commas or white space. A facet name that contains white space must be enclosed in single or double
quotes. If not specified, all facets are enabled. While the Ice run time creates only the built-in facets (such as
Process and Properties) that are enabled, you can create administrative facets without checking the value of this
property. Ice ensures that only enabled administrative facets are available to clients.

# Ice.Admin.InstanceName

#### Synopsis

`Ice.Admin.InstanceName=name`

#### Description

Specifies an identity category for the [administrative object](../administrative-facility), when this object is created
during communicator initialization or by a call to `getAdmin` on the communicator. If defined, the identity of the
object becomes `name/admin`. If not specified, the default identity category is a UUID.

# Ice.Admin.Logger.KeepLogs

#### Synopsis

`Ice.Admin.Logger.KeepLogs=num`

#### Description

The [Logger admin facet](../logger-facet), when enabled, caches up the _num_ most recent log messages with a type other
than `Ice::TraceMessage`. When _num_ is 0 or less than 0, the Logger facet does not cache any of these log messages. The
default value for _num_ is 100.

# Ice.Admin.Logger.KeepTraces

#### Synopsis

`Ice.Admin.Logger.KeepTraces=num`

#### Description

The [Logger admin facet](../logger-facet), when enabled, caches up the _num_ most recent log messages with type
`Ice::TraceMessage`. When _num_ is 0 or less than 0, the Logger facet does not cache any of these trace messages. The
default value for _num_ is 100.

# Ice.Admin.Logger.Properties

#### Synopsis

`Ice.Admin.Logger.Properties=propertyList`

#### Description

The [Logger admin facet](../logger-facet), when enabled, creates its own communicator to send log messages to attached
remote loggers. Without this sub-communicator, sending log messages to remote loggers could trigger more local logging,
which in turn would generate more logs sent to remote loggers: a single genuine log could trigger an infinite number of
log messages.

The properties of this sub-communicator are a few properties of the application's communicator (`Ice.Default.Locator`,
`Ice.Plugin.IceSSL` and all [IceSSL](../icessl-properties) properties), plus the properties (if any) specified by
_propertyList_. *propertyList*is a sequence of strings, that Ice reads using
[getPropertyAsList](https://code.zeroc.com/manual/Ice/Properties). Each of these strings uses the syntax
_PropertyName_=_PropertyValue_ to set a property. For example, you could turn on protocol tracing on the `Logger`
facet's sub-communicator with:

```config
Ice.Admin.Logger.Properties=Ice.Trace.Protocol=1
```

# Ice.Admin.ServerId

#### Synopsis

`Ice.Admin.ServerId=id`

#### Description

Specifies an identifier that uniquely identifies the process when the Ice runtime
[registers the Process facet of its admin object with the locator registry](../icegrid-and-the-administrative-facility).
