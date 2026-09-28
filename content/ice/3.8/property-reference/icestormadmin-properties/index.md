---
title: IceStormAdmin.*
---

# IceStormAdmin.Host

#### Synopsis

`IceStormAdmin.Host=host`

#### Description

When used together with `IceStormAdmin.Port`, [icestormadmin](../icestorm-administration) uses the
[Finder interface](../configuring-icestorm) to discover the topic manager at the specified host and port.

{% callout type="info" %}

`icestormadmin` ignores this setting if you define one or more `IceStormAdmin.TopicManager` properties.

{% /callout %}

# IceStormAdmin.Port

#### Synopsis

`IceStormAdmin.Port=port`

#### Description

When used together with `IceStormAdmin.Host`, [icestormadmin](../icestorm-administration) uses the
[Finder interface](../configuring-icestorm) to discover the topic manager at the specified host and port.

{% callout type="info" %}

`icestormadmin` ignores this setting if you define one or more `IceStormAdmin.TopicManager` properties.

{% /callout %}

# IceStormAdmin.TopicManager.Default

#### Synopsis

`IceStormAdmin.TopicManager.Default=proxy`

#### Description

Defines the proxy for the default IceStorm topic manager. This property is used by
[icestormadmin](../icestorm-administration). IceStorm applications may choose to use this property for their
configuration as well.

# IceStormAdmin.TopicManager._name_

#### Synopsis

`IceStormAdmin.TopicManager.name=proxy`

#### Description

Defines a proxy for an IceStorm topic manager for [icestormadmin](../icestorm-administration). Properties with this
pattern are used by `icestormadmin` if multiple topic managers are in use, for example:

```
IceStormAdmin.TopicManager.A=A/TopicManager:tcp -h x -p 9995
IceStormAdmin.TopicManager.B=Foo/TopicManager:tcp -h x -p 9995
IceStormAdmin.TopicManager.C=Bar/TopicManager:tcp -h x -p 9987
```

This sets the proxies for three topic managers. Note that `name` need not match the instance name of the corresponding
topic manager — `name` simply serves as a tag. With these property settings, the `icestormadmin` commands that accept a
topic can now specify a topic manager other than the default topic manager that is configured with
[IceStormAdmin.*#IceStormAdmin.TopicManager.Default](../icestormadmin-properties#icestormadmin.topicmanager.default).
For example:

```
current Foo
create myTopic
create Bar/myOtherTopic
```

This sets the current topic manager to the one with instance name `Foo`; the first `create` command then creates the
topic within that topic manager, whereas the second `create` command uses the topic manager with instance name `Bar`.
