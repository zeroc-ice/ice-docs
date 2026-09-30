---
title: The Properties Class
---

You can use the same [configuration file](../using-configuration-files) and
[command-line](../setting-properties-on-the-command-line) mechanisms to set application-specific properties. For
example, we could introduce a property to control the maximum file size for a file system application:

```config
# Configuration file for file system application

Filesystem.MaxFileSize=1024    # Max file size in kB
```

The Ice runtime stores this `Filesystem.MaxFileSize` property like any other property and makes it accessible
programmatically via the [Properties](https://code.zeroc.com/manual/Ice/Properties) class.

To access property values from within your program, you need to acquire the communicator's properties by calling
`getProperties`. Most of the methods on the returned `Properties` object involve reading properties, setting properties,
and parsing properties.

## Reading and Setting a Property

Use `getProperty`, `getPropertyAsInt`, and `getPropertyAsList` to read application properties as strings, integers, or
lists of strings. Their `WithDefault` variants let you choose a default for a property that is not set.

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
[property reference](../property-reference). For example, if you never set `Ice.Warn.Dispatch`,
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
