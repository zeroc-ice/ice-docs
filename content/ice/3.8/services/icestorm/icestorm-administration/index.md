---
title: IceStorm Administration
---

The IceStorm administration tool, `icestormadmin`, is a command-line program that provides administrative control of an
IceStorm server.

Configuration properties inform `icestormadmin` about the topic manager(s) that you wish to administer. You have several
configuration options:

- Define [IceStormAdmin.Host](../icestormadmin-properties) and [IceStormAdmin.Port](../icestormadmin-properties) -
  `icestormadmin` constructs its own proxy for the topic manager at the specified host and port
- Define [IceStormAdmin.TopicManager.Default](../icestormadmin-properties) - specifies a proxy for the default topic
  manager on which administrative commands operate
- Define [IceStormAdmin.TopicManager._name_](../icestormadmin-properties) - specifies the proxies for any number of
  named topic managers

The tool supports the following command-line options:

```shell
icestormadmin -h
Usage: icestormadmin [options]
Options:
-h, --help           Show this message.
-v, --version        Display the Ice version.
-e COMMANDS          Execute COMMANDS.
-d, --debug          Print debug messages.
```

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
  [IceStormAdmin.TopicManager._name_](../icestorm-properties) property. Without an argument, the command shows the
  current topic manager.

- `replica [INSTANCE-NAME]` Display [replication information](../highly-available-icestorm) for the given
  `INSTANCE-NAME`.

- `subscribers TOPICS` Displays the identities of the subscribers for each of the `TOPICS`.

Some of the commands accept one or more topic names (`TOPICS`) as arguments. Topic names containing white space or
matching a command keyword must be enclosed in single or double quotes.

By default, `icestormadmin` uses the topic manager specified by your setting for
[IceStormAdmin.TopicManager.Default](../icestormadmin-properties). For example, without additional arguments, the
`create` command operates on that topic manager.

If you are using multiple topic managers, you can specify their proxies by setting
[IceStormAdmin.TopicManager._name_](../icestormadmin-properties) for each topic manager. For example:

```config
IceStormAdmin.TopicManager.A=A/TopicManager:tcp -h x -p 9995
IceStormAdmin.TopicManager.B=Foo/TopicManager:tcp -h x -p 9996
IceStormAdmin.TopicManager.C=Bar/TopicManager:tcp -h z -p 9995
```

This sets the proxies for three topic managers. Note that `name` need not match the instance name of the corresponding
topic manager — `name` simply serves as a tag. With these property settings, the `icestormadmin` commands that accept a
topic can now specify a topic manager other than the default topic manager that is configured with
`IceStormAdmin.TopicManager.Default`. For example:

```text
current Foo
create myTopic
create Bar/myOtherTopic
```

This sets the current topic manager to the one with instance name `Foo`; the first `create` command then creates the
topic within that topic manager, whereas the second `create` command uses the topic manager with instance name `Bar`.

##### See Also

- [Configuring IceStorm](../configuring-icestorm)
- [Highly Available IceStorm](../highly-available-icestorm)
- [IceStorm Properties](../icestorm-properties)
- [IceStormAdmin.*](../icestormadmin-properties)
