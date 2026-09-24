---
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
- `IceBridge`
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

You use existing Ice properties with these prefixes (for example, `Ice.Trace.Network`) to configure Ice itself. Give the
properties of your own application a prefix of your own, such as `Filesystem`: Ice rejects a property name that starts
with a reserved prefix and that it does not recognize, so a property such as `Ice.MyProp` fails.

# Property Validation

Ice validates the name of every property that begins with a reserved prefix followed by a dot, whether the property
comes from a configuration file, the command line, the Windows registry, the [Properties](../the-properties-class)
class, or the [Properties facet](../the-properties-facet). A name that is not a property Ice knows is rejected with a
`PropertyException`:

```
unknown Ice property: Ice.Trace.Networks
```

A communicator reads its configuration while it is being created, so a near miss for `Ice.Trace.Network` in a
configuration file makes communicator creation fail. The prefix has to match in full, and a name that does not begin
with one is never validated: `Filesystem.MaxFileSize`, `IceCream.Flavor` and even a misspelled `Iec.Trace.Network` are
all stored as written.

{% iflang langs="swift" %}

The Swift `Properties` methods that are not declared `throws` terminate the program rather than report a rejected name;
[the Properties class](../the-properties-class) says which ones.

{% /iflang %}

# Prefixes Reserved for the Ice Services

Nine of the reserved prefixes belong to the Ice services, and an application cannot set any property under them:

- `Glacier2`
- `IceBox`
- `IceBoxAdmin`
- `IceBridge`
- `IceGrid`
- `IceGridAdmin`
- `IceGridGUI`
- `IceStorm`
- `IceStormAdmin`

Each service enables the prefixes it needs on the property set it creates for itself; the property set of an
application-created communicator enables none of them. An application that reads a configuration file also used by an
IceGrid node or a Glacier2 router therefore fails at startup on the first service property in the file. Keep the
properties of a service in a configuration file of its own, and point each program at the file it needs with
[Ice.Config](../ice-properties).

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
never read. To enable this warning, set [Ice.Warn.UnusedProperties](../ice-warn-properties) to a non-zero value. By
default, the warning is disabled.

This warning detects a misspelled property name in your own application, such as `Filesystem.MaxFilSize` instead of
`Filesystem.MaxFileSize`, and a name that misspells a reserved prefix, such as `Iec.Trace.Network`. It never reports a
name misspelled under a reserved prefix, because such a name is rejected when it is set and so never reaches the
property set.

##### See Also

- [Property Reference](../property-reference)
