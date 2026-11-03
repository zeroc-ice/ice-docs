---
title: Setting Properties on the Command Line
sidebarLabel: Command-Line Properties
---

When you pass arguments to communicator [initialization](../../communicator/initialization-and-destruction), Ice
converts each option that begins with `--`, a [reserved prefix](../properties-overview#reserved-prefixes), and a dot
into a property setting, and leaves the other arguments to your application. For example:

```shell
./server --Ice.Trace.Network=3 --verbose
```

sets `Ice.Trace.Network` to `3` and leaves `--verbose`. An option such as `--IceFoo=1`, without the dot, also remains an
application argument.

Property settings on the command line override the settings of [configuration files](../using-configuration-files), and
when you set the same property more than once, the last setting overrides the previous ones. An option without a value
sets the property to `1`, and an option with an empty value clears the property:

```shell
./server --Ice.Trace.Protocol     # same as --Ice.Trace.Protocol=1
./server --Ice.Trace.Protocol=    # clears Ice.Trace.Protocol
```

Ice applies the same [property validation](../properties-overview#property-validation) to these options as to any other
property.

## Remaining Arguments

The arguments that remain for your application leave out the options Ice consumed;
[Communicator Initialization and Destruction](../../communicator/initialization-and-destruction) shows how each mapping
returns them. Initialize the communicator before you parse the arguments of your application, so that you parse only the
arguments that remain.

To read the properties of your application from the command line, call `parseCommandLineOptions` with the prefix of
these properties; see [The Properties Class](../properties-class#reading-and-parsing-groups-of-properties).

## See Also

- [Using Configuration Files](../using-configuration-files)
- [Communicator Initialization and Destruction](../../communicator/initialization-and-destruction)
