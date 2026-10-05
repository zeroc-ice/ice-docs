---
title: Properties Overview
---

<!-- cspell:ignore Netwrok -->

An Ice communicator and its various subsystems are configured by properties. A property is a name-value pair, for
example:

```config
Ice.UDP.SndSize=65535
```

In this example, the _property name_ is `Ice.UDP.SndSize`, and the _property value_ is `65535`.

You can find a complete list of the properties used to configure Ice in the
[property reference](../../../property-reference).

Set properties that configure the Ice runtime and its services before initializing the component that uses them. For
updates that take effect at run time, see
[the Properties facet](../../../administration/administrative-facility/properties-facet).

## Property Categories

By convention, Ice properties use the following naming scheme:

```config
<application>.<category>[.<sub-category>]
```

Note that the sub-category is optional and not used by all Ice properties.

This two- or three-part naming scheme is by convention only — if you use properties to configure your own applications,
you can use property names with any number of categories.

## Reserved Prefixes

Ice reserves the following prefixes for the properties of the libraries that run in your program, such as the Ice
runtime, the IceDiscovery plug-in, and DataStorm:

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

Ice validates the name of every property that begins with a reserved prefix followed by a dot, whether the property
comes from a configuration file, the command line, the Windows registry, the [Properties](../properties-class) class, or
the [Properties facet](../../../administration/administrative-facility/properties-facet). Ice rejects a name it does not
know with a `PropertyException`:

```text
unknown Ice property: Ice.Trace.Netwrok
```

A communicator reads its configuration while it is being created, so a typo such as `Ice.Trace.Netwrok` in a
configuration file makes communicator initialization fail with a `PropertyException`. Ice stores a name that does not
begin with a reserved prefix and a dot as written, with no validation: `Filesystem.MaxFileSize`, `IceCream.Flavor`, and
even the misspelled `Iec.Trace.Network`.

{% iflang langs="swift" %}

The Swift `Properties` methods that are not declared `throws` terminate the program rather than report a rejected name;
[the Properties class](../properties-class) says which ones.

{% /iflang %}

## Property Name Syntax

A property name consists of one or more characters. For example, the following are valid property names:

```config
foo
Foo
foo.bar
```

Periods conventionally separate categories. Ice also uses the first period to identify a reserved prefix for
[property validation](#property-validation).

Property names cannot contain leading or trailing white space. (If you create a property name with leading or trailing
white space, that white space is silently stripped.) See [Configuration File Syntax](../configuration-file-syntax) for
escaping special characters such as `=`, `#`, and backslash when writing a property name in a file.

## Property Value Syntax

A property value consists of any number of characters. The following are examples of property values:

```config
65535
yes
This is a = property value.
../../config
```

The configuration file parser preserves single and double quotes in property values. The
[`getPropertyAsList` methods](../properties-class#reading-and-setting-a-property) interpret these quotes when splitting
a value into a list. To preserve leading or trailing spaces in a configuration file value, escape them with backslashes;
see [Configuration File Syntax](../configuration-file-syntax).

## Unused Properties

During the destruction of a communicator, the Ice runtime can optionally emit a warning for properties that were set but
never read. To enable this warning, set [Ice.Warn.UnusedProperties](../../../property-reference/ice-warn-properties) to
a non-zero value. By default, the warning is disabled.

This warning catches a misspelled property name in your own application, such as `Filesystem.MaxFilSize` instead of
`Filesystem.MaxFileSize`, and a name that misspells a reserved prefix, such as `Iec.Trace.Network`.

Reading a property marks it as used. `getPropertiesForPrefix` marks every returned property as used; passing an empty
prefix therefore marks all properties as used. In C++, C#, Java, and JavaScript, `getUnusedProperties()` returns the
names of the properties that have not been read.

## See Also

- [Property Reference](../../../property-reference)
