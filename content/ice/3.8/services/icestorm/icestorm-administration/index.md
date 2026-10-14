---
title: IceStorm Administration
---

The IceStorm administration tool, `icestormadmin`, is a command-line program that provides administrative control of an
IceStorm server. It supports the following command-line options:

```shell
icestormadmin -h
Usage: icestormadmin [options]
Options:
-h, --help           Show this message.
-v, --version        Display the Ice version.
-e COMMANDS          Execute COMMANDS.
-d, --debug          Print debug messages.
```

Like any Ice program, `icestormadmin` also accepts Ice properties on its command line, for example
`--IceStormAdmin.TopicManager.Default=...` or `--Ice.Config=admin.cfg`.

If you specify one or more `-e` options, the tool executes the given commands and exits, otherwise the tool enters an
interactive session. The `help` command displays the following usage information:

- `help` Print this message.

- `exit, quit` Exit this program.

- `create TOPICS` Add `TOPICS`.

- `destroy TOPICS` Remove `TOPICS`.

- `link` `FROM TO` `[COST]` Link `FROM` to `TO` with the optional `COST`.

- `unlink` `FROM TO` Unlink `TO` from `FROM`.

- `links [INSTANCE-NAME]` Without an argument, `links` displays the links of all topics in the current topic manager.
  You can specify a different topic manager by providing its instance name.

- `topics [INSTANCE-NAME]` Without an argument, `topics` displays the names of all topics in the current topic manager.
  You can specify a different topic manager by providing its instance name.

- `current [INSTANCE-NAME]` Set the current topic manager to the topic manager with instance name `INSTANCE-NAME`. The
  proxy of the corresponding topic manager must be specified by setting an
  [IceStormAdmin.TopicManager._tag_](../../../property-reference/icestormadmin-properties#icestormadmin.topicmanager.tag)
  property. Without an argument, the command shows the current topic manager.

- `replica [INSTANCE-NAME]` Display [replication information](../highly-available-icestorm) for the given
  `INSTANCE-NAME`.

- `subscribers TOPICS` Displays the identities of the subscribers for each of the `TOPICS`.

Some of the commands accept one or more topic names (`TOPICS`) as arguments. Enclose a topic name that contains white
space or a semicolon, or that starts with `//` or `/*`, in single or double quotes.

## Selecting the Topic Manager

`icestormadmin` sends its commands to the topic managers that you configure with these properties:

- [IceStormAdmin.TopicManager.Default](../../../property-reference/icestormadmin-properties#icestormadmin.topicmanager.default)
  sets the proxy of the default topic manager, which the commands use unless you name another one.
- [IceStormAdmin.TopicManager._tag_](../../../property-reference/icestormadmin-properties#icestormadmin.topicmanager.tag)
  sets the proxy of an additional topic manager; `tag` is any string that makes the property name unique. When
  `IceStormAdmin.TopicManager.Default` is not set, one of these topic managers is the default.
- [IceStormAdmin.Port](../../../property-reference/icestormadmin-properties#icestormadmin.port) and optionally
  [IceStormAdmin.Host](../../../property-reference/icestormadmin-properties#icestormadmin.host) apply only when the two
  properties above are not set: `icestormadmin` then asks the `IceStorm/Finder` object at this host and port for its
  topic manager, which becomes the default.

For example:

```config
IceStormAdmin.TopicManager.A=A/TopicManager:tcp -h x -p 9995
IceStormAdmin.TopicManager.B=Foo/TopicManager:tcp -h x -p 9996
IceStormAdmin.TopicManager.C=Bar/TopicManager:tcp -h z -p 9995
```

This sets the proxies for three topic managers. The commands select a topic manager by its instance name, not by its
tag: `current` makes it the current topic manager, and a topic name of the form `instance-name/topic` selects it for one
command. For example:

```text
current Foo
create myTopic
create Bar/myOtherTopic
```

This sets the current topic manager to the one with instance name `Foo`; the first `create` command then creates the
topic within that topic manager, whereas the second `create` command uses the topic manager with instance name `Bar`.

## See Also

- [Configuring IceStorm](../configuring-icestorm)
- [Highly Available IceStorm](../highly-available-icestorm)
- [IceStorm Properties](../../../property-reference/icestorm-properties)
- [IceStormAdmin.*](../../../property-reference/icestormadmin-properties)
