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

Ice loads configuration files when it creates a [property set](../properties-class) from an argument array: when you
create a property set with arguments, or pass arguments to communicator
[initialization](../../communicator/initialization-and-destruction). A property set that you create without arguments
loads no file, but you can load a file into it with `load`.

{% iflang langs="php" %}

With settings in `php.ini`, Ice for PHP can also load configuration files once, when PHP loads the extension, into
property sets that a script retrieves with `Ice\getProperties`; see
[Managing Property Sets in PHP](../../communicator/communicators-in-php#managing-property-sets-in-php).

{% /iflang %}

## Selecting a Configuration File

The [Ice.Config](../../../property-reference/ice-properties#ice.config) command-line option names the configuration file
to load:

```shell
./server --Ice.Config=/usr/local/filesystem/config
```

Without this option, Ice loads the file named by the `ICE_CONFIG` environment variable:

```shell
export ICE_CONFIG=/usr/local/filesystem/config
./server
```

When you give `--Ice.Config` more than once, Ice uses the last one. A bare `--Ice.Config`, `--Ice.Config=1`, or
`--Ice.Config=` tells Ice to use `ICE_CONFIG`. Setting `Ice.Config` in a configuration file loads no other file.

## Multiple Files and Precedence

Both `--Ice.Config` and `ICE_CONFIG` accept a list of file names separated by commas:

```shell
./server --Ice.Config=/usr/local/filesystem/config,./config
```

Ice loads the files from left to right, so a setting in `./config` overrides the same setting in
`/usr/local/filesystem/config`.

The other properties set on the command line override the settings of the configuration files, wherever they appear on
the command line. For example, both of the following commands set `Ice.MessageSizeMax` to `4096`, whatever the
configuration file sets:

```shell
./server --Ice.Config=/usr/local/filesystem/config --Ice.MessageSizeMax=4096
./server --Ice.MessageSizeMax=4096 --Ice.Config=/usr/local/filesystem/config
```

[Alternate Property Stores](../alternate-property-stores) describes the other sources `Ice.Config` can name.

## See Also

- [Configuration File Syntax](../configuration-file-syntax)
- [The Properties Class](../properties-class)
- [Alternate Property Stores](../alternate-property-stores)
