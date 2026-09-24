---
title: The Properties Class
---

You can use the same [configuration file](../using-configuration-files) and
[command-line](../setting-properties-on-the-command-line) mechanisms to set application-specific properties. For
example, we could introduce a property to control the maximum file size for a file system application:

```config
# Configuration file for file system application

Filesystem.MaxFileSize=1024    # Max file size in kB
```

The Ice runtime stores this `Filesystem.MaxFileSize` property like any other property and makes it accessible
programmatically via the [Properties](https://code.zeroc.com/manual/Ice/Properties) class.

To access property values from within your program, you need to acquire the communicator's properties by calling
`getProperties`. Most of the methods on the returned `Properties` object involve reading properties, setting properties,
and parsing properties.

# Reading and Setting a Property

`getProperty` returns the value of a property, or the empty string when the property is not set. `getPropertyAsInt` and
`getPropertyAsList` return that value converted to an integer or split into a list of strings, and return 0 and an empty
list when the property is not set. `getPropertyWithDefault`, `getPropertyAsIntWithDefault` and
`getPropertyAsListWithDefault` return a default of your own choosing instead.

`getPropertyAsInt` throws `PropertyException` when the property holds a value it cannot convert:

```
property 'Filesystem.MaxFileSize' has an invalid integer value: 'large'
```

`setProperty` sets a property, and clears it when the value is the empty string. It applies the
[property validation](../properties-overview#property-validation) rules, so it throws `PropertyException` for a name Ice
rejects.

# Reading an Ice Property

`getIceProperty`, `getIcePropertyAsInt` and `getIcePropertyAsList` read an Ice property, and are the methods the Ice
runtime uses to read its own configuration. What sets them apart from `getProperty`, `getPropertyAsInt` and
`getPropertyAsList` is the value they return for a property that is not set: the property's own default, which the
[property reference](../property-reference) lists, rather than the empty string, 0 or an empty list. In a program that
never sets `Ice.Warn.Dispatch`, `getIcePropertyAsInt("Ice.Warn.Dispatch")` returns its default of 1, while
`getPropertyAsInt("Ice.Warn.Dispatch")` returns 0.

These three methods accept the name of an Ice property and throw `PropertyException` for any other name. Read the
properties of your own application with the plain `getProperty` methods, which take any name.

{% iflang langs="swift" %}

{% callout type="note" %}

`setProperty`, `getIceProperty` and `getIcePropertyAsList` are not throwing methods in Swift: they terminate the program
instead of reporting a rejected name. `getPropertyAsInt` and `getIcePropertyAsInt` throw, and so does `initialize`,
which is how a name rejected while a communicator is created reaches your code.

{% /callout %}

{% /iflang %}
