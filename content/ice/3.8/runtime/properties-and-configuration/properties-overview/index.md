---
title: Properties Overview
sidebarLabel: Properties
---

<!-- cspell:ignore Netwrok -->

A _property_ is a name-value pair, such as:

```config
Ice.Trace.Network=3
```

Each communicator has a set of properties that configures the communicator and its subsystems; the
[property reference](../../../property-reference) lists the properties of Ice. Your application can store its own
settings in the same property set.

Set the properties that configure the Ice runtime and its services before initializing the component that uses them. For
updates that take effect at run time, see
[the Properties facet](../../../administration/administrative-facility/properties-facet).

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

Give the properties of your own application a prefix of your own, such as `Filesystem`.

## Property Validation

Ice validates the name of every property that begins with a reserved prefix followed by a dot, wherever the property
comes from: a configuration file, the command line, the Windows registry, the [Properties](../properties-class) class,
or the [Properties facet](../../../administration/administrative-facility/properties-facet). Ice rejects a name it does
not know, so a typo such as `Ice.Trace.Netwrok` in a configuration file makes communicator initialization fail.

Ice stores the other names as written, with no validation: `Filesystem.MaxFileSize`, `IceCream.Flavor`, and even the
misspelled `Iec.Trace.Network`.

## Unused Properties

Set [Ice.Warn.UnusedProperties](../../../property-reference/ice-warn-properties#ice.warn.unusedproperties) to `1` to
make a communicator log, when you destroy it, the properties that were set but never read. This warning catches a
misspelled property name of your own application, such as `Filesystem.MaxFilSize`, and a name that misspells a reserved
prefix, such as `Iec.Trace.Network`.

Reading a property marks it as used, and `getPropertiesForPrefix` marks every property it returns as used. In C++, C#,
Java, and JavaScript, `getUnusedProperties` returns the names of the properties that have not been read.

## See Also

- [Property Reference](../../../property-reference)
