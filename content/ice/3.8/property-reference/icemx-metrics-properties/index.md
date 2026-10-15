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

{% property-synopsis %}

`IceMX.Metrics.view.Accept.attribute=regexp`

{% /property-synopsis %}

{% property-description %}

Requires `attribute` to match `regexp` when that attribute is available on the instrumented object or operation, subject
to the other [filter rules](#regular-expression-filters).

For example, to accept monitoring instrumented objects or operations which are from the object adapter named
"MyAdapter", you can setup the following accept property:

- `IceMX.Metrics.MyView.Accept.parent=MyAdapter`

{% /property-description %}

## IceMX.Metrics._view_.Disabled

{% property-synopsis %}

`IceMX.Metrics.view.Disabled=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a value larger than zero, the metrics view or the map is disabled. This property is useful to
pre-configure a view or map. The view can be disabled initially to not incur overhead and enabled only when needed at
runtime.

{% /property-description %}

## IceMX.Metrics._view_.GroupBy

{% property-synopsis %}

`IceMX.Metrics.view.GroupBy=delimited attributes`

{% /property-synopsis %}

{% property-description %}

Sets the attributes by which a map groups the instrumented objects it records: all those with the same values for these
attributes are grouped into one metrics object, whose ID is built from these values. The default value is `id`, which
groups the instrumented objects that share an ID, such as all the dispatches of one operation on one Ice object.

To group by several attributes, separate them with a space or punctuation (any character other than a letter, a digit or
a dot). The separators appear in the IDs: for example, `identity [operation]` groups invocations by proxy identity and
operation name, with IDs such as `hello [sayHello]`, and `remoteHost:remotePort` gives IDs such as `192.168.1.10:4061`.

Each map supports its own set of attributes, listed in
[Metrics Attributes](../../administration/administrative-facility/metrics-facet#metrics-attributes) for the Ice runtime,
and in [Glacier2 Metrics](../../services/glacier2/glacier2-metrics) and
[IceStorm Metrics](../../services/icestorm/icestorm-metrics) for these services. A map records an instrumented object
only when it can resolve every attribute in `GroupBy`.

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
map inherit its `GroupBy` unless they set their own, and they support neither `operation` nor `identity`, so the first
two views set their `GroupBy` to `id`.

{% /property-description %}

## IceMX.Metrics._view_.Reject._attribute_

{% property-synopsis %}

`IceMX.Metrics.view.Reject.attribute=regexp`

{% /property-synopsis %}

{% property-description %}

Excludes an instrumented object or operation when `attribute` matches `regexp`. A matching `Reject` rule takes
precedence over any `Accept` rules; see [Regular Expression Filters](#regular-expression-filters).

For example, to reject monitoring instrumented objects or operations which are from the object adapter named
"Ice.Admin", you can setup the following reject property:

- `IceMX.Metrics.MyView.Reject.parent=Ice\.Admin`

{% /property-description %}

## IceMX.Metrics._view_.RetainDetached

{% property-synopsis %}

`IceMX.Metrics.view.RetainDetached=num`

{% /property-synopsis %}

{% property-description %}

If `num` is set to a value larger than zero, up to `num` metrics object whose `current` value is 0 will be kept in
memory by the metrics map. This is useful to prevent indefinite memory growth if the monitoring of an instrumented
object or operation creates a unique metrics object, only the last `num` metrics object will be kept in memory. The
default value is `10`, meaning that at most ten metrics object with a `current` value equal to 0 will be retained by the
metrics map.

{% /property-description %}
