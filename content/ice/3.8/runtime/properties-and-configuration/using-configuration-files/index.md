---
title: Using Configuration Files
sidebarLabel: Configuration Files
languages:
  - cpp
  - csharp
  - java
  - matlab
  - php
  - python
  - ruby
  - swift
---

A configuration file sets the properties of a communicator. Ice reads this file when you pass the command-line arguments
of your program to communicator [initialization](../../communicator#creating-a-communicator), or when you create a
[property set](../properties-class) from these arguments; the sections below describe how you select the file. You can
also load a configuration file into an existing property set with its `load` method.

{% iflang langs="php" %}

Ice for PHP can also read a configuration file named by the `ice.config` directive of `php.ini`, once, when PHP loads
the extension. A script then obtains the resulting property set with `Ice\getProperties`; see
[Property Sets](../../communicator#property-sets).

{% /iflang %}

## Selecting a Configuration File

The [Ice.Config](../../../property-reference/ice-properties#ice.config) property, set on the command line, names the
configuration file:

```shell
./server --Ice.Config=/usr/local/filesystem/config
```

Without `Ice.Config`, Ice loads the file named by the `ICE_CONFIG` environment variable:

```shell
export ICE_CONFIG=/usr/local/filesystem/config
./server
```

When the command line sets `Ice.Config` more than once, the last one applies. A bare `--Ice.Config`, `--Ice.Config=1`,
or `--Ice.Config=` tells Ice to use `ICE_CONFIG`. `Ice.Config` set in a configuration file loads no other file.

## Multiple Files and Precedence

Both `--Ice.Config` and `ICE_CONFIG` accept a list of file names separated by commas:

```shell
./server --Ice.Config=/usr/local/filesystem/config,./config
```

Ice loads the files from left to right: when both files set the same property, `./config` wins.

When the command line and a configuration file set the same property, the command line wins, wherever the `--Ice.Config`
argument appears on the command line. For example, both of the following commands set `Ice.MessageSizeMax` to `4096`,
whatever the configuration file sets:

```shell
./server --Ice.Config=/usr/local/filesystem/config --Ice.MessageSizeMax=4096
./server --Ice.MessageSizeMax=4096 --Ice.Config=/usr/local/filesystem/config
```

{% iflang langs="cpp,java,matlab,python" %}

[Alternate Property Stores](../alternate-property-stores) describes the other sources `Ice.Config` can name.

{% /iflang %}

## See Also

- [Configuration File Syntax](../configuration-file-syntax)
- [The Properties Class](../properties-class)
