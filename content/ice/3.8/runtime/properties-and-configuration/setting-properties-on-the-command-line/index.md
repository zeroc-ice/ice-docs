---
title: Setting Properties on the Command Line
sidebarLabel: Command-Line Properties
---

When you pass the command-line arguments of your program to communicator
[initialization](../../communicator/initialization-and-destruction), Ice sets a property for each argument of the form
`--name=value` whose name begins with a [reserved prefix](../properties-overview#reserved-prefixes) and a dot, and
removes this argument. For example:

```shell
./server --Ice.Trace.Network=3 --verbose
```

sets `Ice.Trace.Network` to `3`, and `--verbose` remains for your application. An argument such as `--IceFoo=1`, with no
dot after the prefix, remains too.

A property set on the command line overrides the same property set in a
[configuration file](../using-configuration-files). When the command line sets the same property more than once, the
last one applies. An argument without `=value` sets the property to `1`, and an argument with an empty value clears the
property:

```shell
./server --Ice.Trace.Protocol     # same as --Ice.Trace.Protocol=1
./server --Ice.Trace.Protocol=    # clears Ice.Trace.Protocol
```

Ice applies the same [property validation](../properties-overview#property-validation) to a property set on the command
line as to any other property.

## Remaining Arguments

Ice removes the arguments it converts into properties, and
[Communicator Initialization and Destruction](../../communicator/initialization-and-destruction) shows how each mapping
returns the remaining arguments. Initialize the communicator before you parse these arguments, so that your application
sees only the arguments meant for it.

## See Also

- [Using Configuration Files](../using-configuration-files)
- [Communicator Initialization and Destruction](../../communicator/initialization-and-destruction)
