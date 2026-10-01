---
title: IceMX.Metrics.*
---

{% iflang langs="js" %}

{% callout type="info" title="JavaScript" %}

Ice for JavaScript does not support the properties on this page. Setting any of them throws `PropertyException`.

{% /callout %}

{% /iflang %}

Metrics view are configured with the properties described below. The _view_ below can be replaced with one of the
following:

- IceMX.Metrics._view-name_
- IceMX.Metrics._view-name_.Map._map-name_
- IceMX.Metrics._view-name_.Map._map-name_.Map._submap-name_

If a view is defined without Map properties, the view will contain all the metrics map known by the
[Metrics facet](../metrics-facet). If a view defines one or more map properties it will only contain these maps.

For a list of supported maps see:

- [The Metrics Facet](../metrics-facet)
- [Glacier2 Metrics](../glacier2-metrics)
- [IceStorm Metrics](../icestorm-metrics)

## IceMX.Metrics._view_.Accept._attribute_

### Synopsis {% id="icemx.metrics.view.accept.attribute-synopsis" %}

`IceMX.Metrics.view.Accept.attribute=regexp`

### Description {% id="icemx.metrics.view.accept.attribute-description" %}

This property defines a rule to accept the monitoring of an instrumented object or operation based on the value of one
of its attribute. If the `attribute` matches the specified `regex` and if it satisfies other `Accept` and `Reject`
filters the instrumented object or operation will be monitored.

For example, to accept monitoring instrumented objects or operations which are from the object adapter named
"MyAdapter", you can setup the following accept property:

- `IceMX.Metrics.MyView.Accept.parent=MyAdapter`

## IceMX.Metrics._view_.Disabled

### Synopsis {% id="icemx.metrics.view.disabled-synopsis" %}

`IceMX.Metrics.view.Disabled=num`

### Description {% id="icemx.metrics.view.disabled-description" %}

If `num` is set to a value larger than zero, the metrics view or the map is disabled. This property is useful to
pre-configure a view or map. The view can be disabled initially to not incur overhead and enabled only when needed at
runtime.

## IceMX.Metrics._view_.GroupBy

### Synopsis {% id="icemx.metrics.view.groupby-synopsis" %}

`IceMX.Metrics.view.GroupBy=delimited attributes`

### Description {% id="icemx.metrics.view.groupby-description" %}

This property defines how metrics are grouped and how the ID of each metrics object is created. The grouping is based on
attributes specific to the instrumented object or operation. For example, you can group the invocation metrics by
operation name or proxy identity. All the invocations with the same operation name or proxy identity will record metrics
using the same metrics object. You can specify several attributes to group metrics based on multiple attributes. You
must delimit the attributes with delimiters when specify the value of the GroupBy property. A delimiter is any character
which is not an alpha numeric or the dot character. Attributes which can be used to specify the value of this property
are defined in relevant section of the Ice manual. Here are some examples of GroupBy properties.

- `IceMX.Metrics.MyView.GroupBy=operation`
- `IceMX.Metrics.MyView.GroupBy=identity [operation]`
- `IceMX.Metrics.MyView.GroupBy=remoteHost:remotePort`

## IceMX.Metrics._view_.Reject._attribute_

### Synopsis {% id="icemx.metrics.view.reject.attribute-synopsis" %}

`IceMX.Metrics.view.Reject.attribute=regexp`

### Description {% id="icemx.metrics.view.reject.attribute-description" %}

This property defines a rule to accept the monitoring of an instrumented object or operation based on the value of one
of its attribute. If the `attribute` matches the specified `regex` and if it satisfies other `Accept` and `Reject`
filters the instrumented object or operation will be monitored.

For example, to reject monitoring instrumented objects or operations which are from the object adapter named
"Ice.Admin", you can setup the following reject property:

- `IceMX.Metrics.MyView.Reject.parent=Ice\.Admin`

## IceMX.Metrics._view_.RetainDetached

### Synopsis {% id="icemx.metrics.view.retaindetached-synopsis" %}

`IceMX.Metrics.view.RetainedDetached=num`

### Description {% id="icemx.metrics.view.retaindetached-description" %}

If `num` is set to a value larger than zero, up to `num` metrics object whose `current` value is 0 will be kept in
memory by the metrics map. This is useful to prevent indefinite memory growth if the monitoring of an instrumented
object or operation creates a unique metrics object, only the last `num` metrics object will be kept in memory. The
default value is `10`, meaning that at most ten metrics object with a `current` value equal to 0 will be retained by the
metrics map.
