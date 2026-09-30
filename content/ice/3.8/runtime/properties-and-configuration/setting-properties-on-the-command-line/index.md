---
title: Setting Properties on the Command Line
---

<!-- cspell:ignore Netwrok -->

In addition to setting properties in a [configuration file](../using-configuration-files), you can also set properties
on the command line, for example:

```shell
server --Ice.UDP.SndSize=65535 --IceSSL.Trace.Security=2
```

Any command line option that begins with `--` and is followed by one of the [reserved prefixes](../properties-overview)
is read and converted to a property setting when you create a communicator. Property settings on the command line
override settings in a configuration file. If you set the same property more than once on the same command line, the
last setting overrides any previous ones.

Ice applies the same [property validation](../properties-overview#property-validation) to command-line options as to any
other property, so a typo such as `--Ice.Trace.Netwrok=1` makes communicator initialization fail with a
`PropertyException`.

For convenience, any property not explicitly set to a value is set to the value `1`. For example,

```shell
server --Ice.Trace.Protocol
```

is equivalent to

```shell
server --Ice.Trace.Protocol=1
```

Note that this feature only applies to properties that are set on the command line, but not to properties that are set
from a configuration file.

You can also clear a property from the command line as follows:

```shell
server --Ice.Trace.Protocol=
```

As for properties set from a configuration file, assigning nothing to a property clears that property.

## See Also

- [Properties Overview](../properties-overview)
- [Using Configuration Files](../using-configuration-files)
