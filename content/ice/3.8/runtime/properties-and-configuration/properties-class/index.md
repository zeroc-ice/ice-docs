---
title: The Properties Class
sidebarLabel: Properties Class
---

A [Properties](api:Ice/Properties) object, or _property set_, is a collection of properties. Each communicator has a
property set, which its [`getProperties`](api:Ice/Communicator.getProperties) method returns. You can also create a
property set yourself, for example to configure a new communicator.

## Reading and Setting a Property

[`getProperty`](api:Ice/Properties.getProperty), [`getPropertyAsInt`](api:Ice/Properties.getPropertyAsInt), and
[`getPropertyAsList`](api:Ice/Properties.getPropertyAsList) read a property as a string, an integer, or a list of
strings. Their `WithDefault` variants, [`getPropertyWithDefault`](api:Ice/Properties.getPropertyWithDefault),
[`getPropertyAsIntWithDefault`](api:Ice/Properties.getPropertyAsIntWithDefault), and
[`getPropertyAsListWithDefault`](api:Ice/Properties.getPropertyAsListWithDefault), return the default you give for a
property that is not set.

[`setProperty`](api:Ice/Properties.setProperty) sets a property, and applies the
[property validation](../properties-overview#property-validation) rules.

## Reading an Ice Property

An _Ice property_ is a property that Ice defines, such as `Ice.Warn.Dispatch`: its name begins with a
[reserved prefix](../properties-overview#reserved-prefixes), and the [property reference](../../../property-reference)
lists it with its default value. [`getIceProperty`](api:Ice/Properties.getIceProperty),
[`getIcePropertyAsInt`](api:Ice/Properties.getIcePropertyAsInt), and
[`getIcePropertyAsList`](api:Ice/Properties.getIcePropertyAsList) read an Ice property and, unlike the plain
`getProperty` methods, return its default value when it is not set. For example, if you never set `Ice.Warn.Dispatch`,
`getIcePropertyAsInt("Ice.Warn.Dispatch")` returns its default of `1`, while `getPropertyAsInt("Ice.Warn.Dispatch")`
returns `0`.

These three methods accept only the names of Ice properties. Read the other properties, such as the properties of an
object adapter or a proxy, with the plain `getProperty` methods, which take any name.

## Reading and Parsing Groups of Properties

[`getPropertiesForPrefix`](api:Ice/Properties.getPropertiesForPrefix) returns the properties whose names begin with a
prefix, and marks them as [used](../properties-overview#unused-properties).
[`parseCommandLineOptions`](api:Ice/Properties.parseCommandLineOptions) and
[`parseIceCommandLineOptions`](api:Ice/Properties.parseIceCommandLineOptions) convert command-line options into
properties, with the same validation as `setProperty`, and
[`getCommandLineOptions`](api:Ice/Properties.getCommandLineOptions) converts a property set back into command-line
options.

{% iflang langs="js" %}

[`parse`](api:Ice/Properties.parse) loads properties from the contents of a
[configuration file](../configuration-file-syntax) that you supply as a string.

{% /iflang %}
