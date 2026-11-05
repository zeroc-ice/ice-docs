---
title: Properties Overview
sidebarLabel: Properties
---

<!-- cspell:ignore Netwrok -->

A _property_ is a name-value pair, such as:

```config
Ice.Trace.Network=3
```

Each communicator has a property set, which configures the communicator and the plug-ins and services that use it; the
[property reference](../../../property-reference) lists these properties.

Ice reads most of the properties it uses early, typically during communicator initialization, and does not read them
again: set these properties before you create the communicator, since a later update has no effect.
{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}The
[Properties facet](../../../administration/administrative-facility/properties-facet) lets an administrator update the
properties of a running program; this is useful for the properties that Ice reads again, such as the
[IceMX](../../../property-reference/icemx-metrics-properties) metrics properties, and for properties your application
reads itself.{% /iflang %}

## Reserved Prefixes

Property names conventionally consist of components separated by dots, such as `Ice.Trace.Network`. Ice reserves the
following prefixes for the properties of the libraries that run in your program, such as the Ice runtime, the
IceDiscovery plug-in, and DataStorm:

- `DataStorm`
- `Ice`
- `IceBT`
- `IceDiscovery`
- `IceLocatorDiscovery`
- `IceMX`
- `IceSSL`

Ice also reserves the following prefixes for the properties of the Ice services and tools, which run as separate
programs. Only the corresponding service or tool accepts these properties:

- `Glacier2`
- `IceBox`
- `IceBoxAdmin`
- `IceBridge`
- `IceGrid`
- `IceGridAdmin`
- `IceGridGUI`
- `IceStorm`
- `IceStormAdmin`

## Property Validation

Ice validates the name of every property that begins with a reserved prefix followed by a dot, wherever the property
comes from: a configuration file, the command line, the Windows registry,
{% iflang langs="cpp,csharp,java,matlab,php,python,ruby,swift" %}the
[Properties facet](../../../administration/administrative-facility/properties-facet), {% /iflang %}or the
[Properties](../properties-class) class. Ice rejects a name it does not know, so a typo such as `Ice.Trace.Netwrok` in a
configuration file makes communicator initialization fail.

Ice validates the properties of an object adapter, such as `MyAdapter.Endpoints`, when it creates this object adapter,
and the properties of a proxy, such as `Greeter.Proxy.InvocationTimeout`, when `propertyToProxy` creates this proxy. It
stores the other names as written, with no validation, including a name that misspells a reserved prefix, such as
`Iec.Trace.Network`.

## Unused Properties

Set [Ice.Warn.UnusedProperties](../../../property-reference/ice-warn-properties#ice.warn.unusedproperties) to `1` to
have a communicator log, during its destruction, the properties that were set but never read. This warning catches a
misspelled name such as `Iec.Trace.Network`: Ice does not validate this name, and nothing ever reads the property.

Reading a property marks it as used, and `getPropertiesForPrefix` marks every property it returns as used. In C++, C#,
Java, and JavaScript, `getUnusedProperties` returns the names of the properties that have not been read.

## See Also

- [Property Reference](../../../property-reference)
