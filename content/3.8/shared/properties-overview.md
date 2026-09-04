---
id: properties-overview
title: Properties Overview
---

An Ice communicator and its various subsystems are configured by properties. A property is a name-value pair, for
example:

```config
Ice.UDP.SndSize=65535
```

In this example, the _property name_ is `Ice.UDP.SndSize`, and the _property value_ is `65535`.

You can find a complete list of the properties used to configure Ice in the [property reference](../property-reference).

Note that Ice reads properties that control the Ice runtime and its services (that is, properties that start with one of
the reserved prefixes, such as `Ice`, `Glacier2`, etc.) only once on start-up, when you create a communicator. This
means that you must set Ice-related properties to their correct values _before_ you create a communicator. If you change
the value of an Ice-related property after that point, it is likely that the new setting will simply be ignored.

# Property Categories

By convention, Ice properties use the following naming scheme:

```config
<application>.<category>[.<sub-category>]
```

Note that the sub-category is optional and not used by all Ice properties.

This two- or three-part naming scheme is by convention only — if you use properties to configure your own applications,
you can use property names with any number of categories.

# Reserved Prefixes for Properties

Ice reserves properties with the following prefixes:

- `DataStorm`
- `Glacier2`
- `Ice`
- `IceBox`
- `IceBoxAdmin`
- `IceBT`
- `IceDiscovery`
- `IceGrid`
- `IceGridAdmin`
- `IceGridGUI`
- `IceLocatorDiscovery`
- `IceMX`
- `IceSSL`
- `IceStorm`
- `IceStormAdmin`

You should use existing Ice properties with these prefixes (for example, `Ice.Trace.Network`) to configure Ice itself.

However, you must not define new properties for your own application that begin with any of these prefixes. For example,
do **not** introduce a property such as `Ice.MyProp` for your application-specific settings.

# Property Name Syntax

A property name consists of any number of characters. For example, the following are valid property names:

```config
foo
Foo
foo.bar
```

Note that there is no special significance to a period in a property name. (Periods are used to make property names more
readable and are not treated specially by the property parser.)

Property names cannot contain leading or trailing white space. (If you create a property name with leading or trailing
white space, that white space is silently stripped.)

# Property Value Syntax

A property value consists of any number of characters. The following are examples of property values:

```config
65535
yes
This is a = property value.
../../config
```

# Unused Properties

During the destruction of a communicator, the Ice runtime can optionally emit a warning for properties that were set but
never read. To enable this warning, set [Ice.Warn.UnusedProperties](../ice-warn-properties) to a non-zero value. This
property is useful for detecting misspelled properties, like if you wrote `Filesystem.MaxFilSize` instead of
`FileSystem.MaxFileSize`. By default, the warning is disabled.

##### See Also

- [Property Reference](../property-reference)
