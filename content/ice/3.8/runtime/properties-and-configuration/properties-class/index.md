---
title: The Properties Class
sidebarLabel: Properties Class
---

A [Properties](api:Ice/Properties) object, or _property set_, holds the properties of a communicator, which
`getProperties` on the communicator returns. You can also create a property set yourself, for example to give it to a
new communicator or to parse the command-line options of your application. Your application reads and sets its own
properties through the same API as Ice properties.

## Reading and Setting a Property

Use `getProperty`, `getPropertyAsInt`, and `getPropertyAsList` to read application properties as strings, integers, or
lists of strings. For an unset property, they return the empty string, 0, and an empty list, respectively. Their
`WithDefault` variants let you choose a default for a property that is not set.

`getPropertyAsList` splits a value at commas, spaces, tabs, and line breaks. Enclose an item in single or double quotes
to include separators in that item. Within a quoted item, escape its enclosing quote with a backslash. Quotes must
match.

`getPropertyAsInt` fails when the property holds a value that is not an integer.

`setProperty` sets a property, and clears it when the value is the empty string. It applies the
[property validation](../properties-overview#property-validation) rules.

## Reading an Ice Property

`getIceProperty`, `getIcePropertyAsInt`, and `getIcePropertyAsList` read Ice properties. Unlike the plain `getProperty`
methods, they return the property's built-in default when it is not set; see the
[property reference](../../../property-reference). For example, if you never set `Ice.Warn.Dispatch`,
`getIcePropertyAsInt("Ice.Warn.Dispatch")` returns its default of `1`, while `getPropertyAsInt("Ice.Warn.Dispatch")`
returns `0`.

These three methods accept only the names of Ice properties. Read the properties of your own application with the plain
`getProperty` methods, which take any name.

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
