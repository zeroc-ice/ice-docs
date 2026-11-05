---
title: The Properties Class
sidebarLabel: Properties Class
---

A [Properties](api:Ice/Properties) object, or _property set_, holds the properties of a communicator, which
[`getProperties`](api:Ice/Communicator.getProperties) on the communicator returns. You can also create a property set
yourself, for example to give it to a new communicator.

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

[`getIceProperty`](api:Ice/Properties.getIceProperty), [`getIcePropertyAsInt`](api:Ice/Properties.getIcePropertyAsInt),
and [`getIcePropertyAsList`](api:Ice/Properties.getIcePropertyAsList) read Ice properties. Unlike the plain
`getProperty` methods, they return the property's built-in default when it is not set; see the
[property reference](../../../property-reference). For example, if you never set `Ice.Warn.Dispatch`,
`getIcePropertyAsInt("Ice.Warn.Dispatch")` returns its default of `1`, while `getPropertyAsInt("Ice.Warn.Dispatch")`
returns `0`.

These three methods accept only the names of Ice properties. Read the other properties, such as the properties of an
object adapter or a proxy, with the plain `getProperty` methods, which take any name.

{% iflang langs="swift" %}

{% callout type="note" %}

In Swift, `setProperty`, `getIceProperty`, and `getIcePropertyAsList` do not throw: a rejected name terminates the
program. `getPropertyAsInt`, `getIcePropertyAsInt`, and `initialize` throw, so a name rejected during communicator
initialization reaches your code as an error.

{% /callout %}

{% /iflang %}

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
