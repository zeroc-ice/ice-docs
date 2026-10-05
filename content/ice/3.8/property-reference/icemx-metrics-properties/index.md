---
title: IceMX.Metrics.*
---

{% iflang langs="js" %}

{% callout type="note" title="JavaScript" %}

Ice for JavaScript does not support the properties on this page. Setting any of them throws `PropertyException`.

{% /callout %}

{% /iflang %}

Metrics properties use the following prefixes for views, maps, and sub-maps:

- IceMX.Metrics._view-name_
- IceMX.Metrics._view-name_.Map._map-name_
- IceMX.Metrics._view-name_.Map._map-name_.Map._submap-name_

When a view has no `Map.` properties, it includes all maps known to the
[Metrics facet](../../administration/administrative-facility/metrics-facet), using the view's configuration. When a view
defines `Map.` properties, it includes only the maps configured under those prefixes.

The same rule applies to sub-maps. If a parent map has no `Map.` properties, its sub-maps inherit its configuration. If
the parent defines any `Map.` properties, Ice creates only the explicitly configured sub-maps. An explicitly configured
map or sub-map uses its own properties and their defaults.

For a list of supported maps see:

- [The Metrics Facet](../../administration/administrative-facility/metrics-facet)
- [Glacier2 Metrics](../../services/glacier2/glacier2-metrics)
- [IceStorm Metrics](../../services/icestorm/icestorm-metrics)

## Regular Expression Filters

`Accept` and `Reject` rules filter instrumented objects and operations by their attributes. An object or operation must
match every applicable `Accept` rule and none of the applicable `Reject` rules to be monitored. A rule for an attribute
that is unavailable on that object or operation does not exclude it.

{% iflang langs="cpp,python,ruby,php,matlab,swift" %}

Regular expressions use POSIX extended syntax and must match the entire attribute value.

{% /iflang %}

{% iflang langs="java" %}

Regular expressions use Java's `Pattern` syntax and must match the entire attribute value.

{% /iflang %}

{% iflang langs="csharp" %}

Regular expressions use .NET's `Regex` syntax and match any substring of the attribute value.

{% /iflang %}

## IceMX.Metrics._view_.Accept._attribute_

### Synopsis {% id="icemx.metrics.view.accept.attribute-synopsis" %}

`IceMX.Metrics.view.Accept.attribute=regexp`

### Description {% id="icemx.metrics.view.accept.attribute-description" %}

Requires `attribute` to match `regexp` when that attribute is available on the instrumented object or operation, subject
to the other [filter rules](#regular-expression-filters).

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

This property defines how metrics are grouped and how the ID of each metrics object is created. The default value is
`id`. The grouping is based on attributes specific to the instrumented object or operation. For example, you can group
the invocation metrics by operation name or proxy identity. All the invocations with the same operation name or proxy
identity will record metrics using the same metrics object. You can specify several attributes to group metrics based on
multiple attributes. You must delimit the attributes with delimiters when specifying the value of the GroupBy property.
A delimiter is any character which is not an alpha numeric or the dot character. Attributes which can be used to specify
the value of this property are defined in the relevant section of the Ice documentation. Here are some examples of
GroupBy properties.

- `IceMX.Metrics.MyView.GroupBy=operation`
- `IceMX.Metrics.MyView.GroupBy=identity [operation]`
- `IceMX.Metrics.MyView.GroupBy=remoteHost:remotePort`

## IceMX.Metrics._view_.Reject._attribute_

### Synopsis {% id="icemx.metrics.view.reject.attribute-synopsis" %}

`IceMX.Metrics.view.Reject.attribute=regexp`

### Description {% id="icemx.metrics.view.reject.attribute-description" %}

Excludes an instrumented object or operation when `attribute` matches `regexp`. A matching `Reject` rule takes
precedence over any `Accept` rules; see [Regular Expression Filters](#regular-expression-filters).

For example, to reject monitoring instrumented objects or operations which are from the object adapter named
"Ice.Admin", you can setup the following reject property:

- `IceMX.Metrics.MyView.Reject.parent=Ice\.Admin`

## IceMX.Metrics._view_.RetainDetached

### Synopsis {% id="icemx.metrics.view.retaindetached-synopsis" %}

`IceMX.Metrics.view.RetainDetached=num`

### Description {% id="icemx.metrics.view.retaindetached-description" %}

If `num` is set to a value larger than zero, up to `num` metrics object whose `current` value is 0 will be kept in
memory by the metrics map. This is useful to prevent indefinite memory growth if the monitoring of an instrumented
object or operation creates a unique metrics object, only the last `num` metrics object will be kept in memory. The
default value is `10`, meaning that at most ten metrics object with a `current` value equal to 0 will be retained by the
metrics map.
