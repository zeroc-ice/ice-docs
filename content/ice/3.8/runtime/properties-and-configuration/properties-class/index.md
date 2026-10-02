---
title: The Properties Class
---

The `Properties` API lets you read and set the communicator's configuration and your own application settings. In
mappings that support [configuration files](../using-configuration-files), a file can contain application properties
alongside Ice properties. For example, a file system application could use:

```config
# Configuration file for file system application

Filesystem.MaxFileSize=1024    # Max file size in kB
```

The Ice runtime stores this `Filesystem.MaxFileSize` property like any other property and makes it accessible
programmatically through `Properties`. To read application properties from command-line arguments, use
`parseCommandLineOptions` with your application's prefix as described below.

{% iflang langs="cpp" %}

See [Ice::Properties](https://code.zeroc.com/ice/3.8/api/cpp/classIce_1_1Properties.html) in the API reference.

{% /iflang %}

{% iflang langs="csharp" %}

See [Ice.Properties](https://code.zeroc.com/ice/3.8/api/csharp/api/Ice.Properties.html) in the API reference.

{% /iflang %}

{% iflang langs="java" %}

See [com.zeroc.Ice.Properties](https://code.zeroc.com/ice/3.8/api/java/com.zeroc.ice/com/zeroc/Ice/Properties.html) in
the API reference.

{% /iflang %}

{% iflang langs="js" %}

See [Ice.Properties](https://code.zeroc.com/ice/3.8/api/javascript/Ice/Properties.html) in the API reference.

{% /iflang %}

{% iflang langs="python" %}

See [Ice.Properties](https://code.zeroc.com/ice/3.8/api/python/Ice.Properties.html) in the API reference.

{% /iflang %}

{% iflang langs="swift" %}

See [Properties](https://code.zeroc.com/ice/3.8/api/swift/documentation/ice/properties) in the API reference.

{% /iflang %}

To access property values from within your program, you need to acquire the communicator's properties by calling
`getProperties`. Most of the methods on the returned `Properties` object involve reading properties, setting properties,
and parsing properties.

## Reading and Setting a Property

Use `getProperty`, `getPropertyAsInt`, and `getPropertyAsList` to read application properties as strings, integers, or
lists of strings. For an unset property, they return the empty string, 0, and an empty list, respectively. Their
`WithDefault` variants let you choose a default for a property that is not set.

`getPropertyAsList` splits a value at commas, spaces, tabs, and line breaks. Enclose an item in single or double quotes
to include separators in that item. Within a quoted item, escape its enclosing quote with a backslash. If quotes are
mismatched, Ice logs a warning and returns an empty list, or the supplied default for `getPropertyAsListWithDefault`.

`getPropertyAsInt` throws `PropertyException` when the property holds a value it cannot convert:

```text
property 'Filesystem.MaxFileSize' has an invalid integer value: 'large'
```

`setProperty` sets a property, and clears it when the value is the empty string. It applies the
[property validation](../properties-overview#property-validation) rules, so it throws `PropertyException` for a name Ice
rejects.

## Reading an Ice Property

`getIceProperty`, `getIcePropertyAsInt`, and `getIcePropertyAsList` read Ice properties. Unlike the plain `getProperty`
methods, they return the property's built-in default when it is not set; see the
[property reference](../../../property-reference). For example, if you never set `Ice.Warn.Dispatch`,
`getIcePropertyAsInt("Ice.Warn.Dispatch")` returns its default of 1, while `getPropertyAsInt("Ice.Warn.Dispatch")`
returns 0.

These three methods accept the name of an Ice property and throw `PropertyException` for any other name. Read the
properties of your own application with the plain `getProperty` methods, which take any name.

{% iflang langs="swift" %}

{% callout type="note" %}

In Swift, `setProperty`, `getIceProperty`, and `getIcePropertyAsList` do not throw: a rejected name terminates the
program. `getPropertyAsInt`, `getIcePropertyAsInt`, and `initialize` throw, so a name rejected during communicator
initialization reaches your code as an error.

{% /callout %}

{% /iflang %}

## Reading and Parsing Groups of Properties

`getPropertiesForPrefix` returns a dictionary of the stored properties whose names begin with the prefix. An empty
prefix returns every stored property. The method marks all returned properties as used.

`parseCommandLineOptions` converts options beginning with `--prefix.` into properties and returns the unconsumed
arguments. Pass `Filesystem` to parse options such as `--Filesystem.MaxFileSize=1024`, or an empty prefix to parse every
option beginning with `--`. `parseIceCommandLineOptions` performs this parsing for the reserved Ice prefixes. Both
methods apply the usual property-name validation. `getCommandLineOptions` returns the stored properties as an array of
`--key=value` strings.
