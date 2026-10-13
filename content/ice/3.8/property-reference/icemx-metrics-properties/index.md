---
title: IceMX.Metrics.*
---

{% iflang langs="js" %}

{% callout type="info" title="JavaScript" %}

Ice for JavaScript does not support the properties on this page. Setting any of them throws `PropertyException`.

{% /callout %}

{% /iflang %}

Metrics properties use the following prefixes for views, maps, and sub-maps:

- IceMX.Metrics._view-name_
- IceMX.Metrics._view-name_.Map._map-name_
- IceMX.Metrics._view-name_.Map._map-name_.Map._submap-name_

When a view has no `Map.` properties, it includes all maps known to the [Metrics facet](../metrics-facet), using the
view's configuration. When a view defines `Map.` properties, it includes only the maps configured under those prefixes.

The same rule applies to sub-maps. If a parent map has no `Map.` properties, its sub-maps inherit its configuration. If
the parent defines any `Map.` properties, Ice creates only the explicitly configured sub-maps. An explicitly configured
map or sub-map uses its own properties and their defaults.

For a list of supported maps see:

- [The Metrics Facet](../metrics-facet)
- [Glacier2 Metrics](../glacier2-metrics)
- [IceStorm Metrics](../icestorm-metrics)

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

Sets the attributes that group the metrics of a map: the map records the instrumented objects or operations whose
attributes have the same values with the same metrics object, and builds the ID of this metrics object from these
values. The default value is `id`, which gives each instrumented object or operation its own metrics object.

To group by several attributes, separate them with delimiters, which are any characters other than letters, digits and
dots; the delimiters also appear in the ID. For example, `identity [operation]` groups invocations by proxy identity and
operation name, with IDs such as `hello [sayHello]`.

Each map supports its own set of attributes, listed in
[Metrics Attributes](../../administration/administrative-facility/metrics-facet#metrics-attributes) for the Ice runtime,
and in [Glacier2 Metrics](../../services/glacier2/glacier2-metrics) and
[IceStorm Metrics](../../services/icestorm/icestorm-metrics) for these services. A map records an instrumented object or
operation only when it can resolve every attribute in `GroupBy`.

A view-level `GroupBy` applies to every map of a view that has no `Map.` properties, so it suits only the attributes
every map supports: `id`, `parent` and `none`. In a view with `Map.` properties, each map uses its own `GroupBy`. To
group by an attribute that only some maps support, set `GroupBy` on these maps:

```config
IceMX.Metrics.ByOperation.Map.Invocation.GroupBy=operation
IceMX.Metrics.ByOperation.Map.Invocation.Map.Remote.GroupBy=id
IceMX.Metrics.ByOperation.Map.Invocation.Map.Collocated.GroupBy=id

IceMX.Metrics.ByIdentity.Map.Invocation.GroupBy=identity [operation]
IceMX.Metrics.ByIdentity.Map.Invocation.Map.Remote.GroupBy=id
IceMX.Metrics.ByIdentity.Map.Invocation.Map.Collocated.GroupBy=id

IceMX.Metrics.ByPeer.Map.Connection.GroupBy=remoteHost:remotePort
```

A view with `Map.` properties includes only the maps they name. The `Remote` and `Collocated` sub-maps of the Invocation
map support neither `operation` nor `identity`, so the first two views set their `GroupBy` to `id`; otherwise, they
would inherit the Invocation map's grouping and record nothing.

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
