---
title: IceStormAdmin.*
---

## IceStormAdmin.Host

{% property-synopsis %}

`IceStormAdmin.Host=host`

{% /property-synopsis %}

{% property-description %}

Specifies the host of the IceStorm [finder object](../../services/icestorm/configuring-icestorm) that
[icestormadmin](../../services/icestorm/icestorm-administration) uses to discover the topic manager. This property
requires [IceStormAdmin.Port](#icestormadmin.port).

{% callout type="note" %}

`icestormadmin` ignores this setting if you define one or more `IceStormAdmin.TopicManager` properties.

{% /callout %}

{% /property-description %}

## IceStormAdmin.Port

{% property-synopsis %}

`IceStormAdmin.Port=port`

{% /property-synopsis %}

{% property-description %}

Specifies the port of the IceStorm [finder object](../../services/icestorm/configuring-icestorm) that
[icestormadmin](../../services/icestorm/icestorm-administration) uses to discover the topic manager, on the host
specified by [IceStormAdmin.Host](#icestormadmin.host).

{% callout type="note" %}

`icestormadmin` ignores this setting if you define one or more `IceStormAdmin.TopicManager` properties.

{% /callout %}

{% /property-description %}

## IceStormAdmin.TopicManager.Default

{% property-synopsis %}

`IceStormAdmin.TopicManager.Default=proxy`

{% /property-synopsis %}

{% property-description %}

Defines the proxy for the default IceStorm topic manager. This property is used by
[icestormadmin](../../services/icestorm/icestorm-administration). If this property is not set, `icestormadmin` uses one
of the `IceStormAdmin.TopicManager.name` proxies as its default.

{% /property-description %}

## IceStormAdmin.TopicManager._name_

{% property-synopsis %}

`IceStormAdmin.TopicManager.name=proxy`

{% /property-synopsis %}

{% property-description %}

Defines a proxy for an IceStorm topic manager for [icestormadmin](../../services/icestorm/icestorm-administration).
Properties with this pattern are used by `icestormadmin` if multiple topic managers are in use, for example:

```config
IceStormAdmin.TopicManager.A=A/TopicManager:tcp -h x -p 9995
IceStormAdmin.TopicManager.B=Foo/TopicManager:tcp -h x -p 9995
IceStormAdmin.TopicManager.C=Bar/TopicManager:tcp -h x -p 9987
```

This sets the proxies for three topic managers. Note that `name` need not match the instance name of the corresponding
topic manager — `name` simply serves as a tag. With these property settings, the `icestormadmin` commands that accept a
topic can now specify a topic manager other than the default topic manager that is configured with
[IceStormAdmin.*#IceStormAdmin.TopicManager.Default](#icestormadmin.topicmanager.default). For example:

```text
current Foo
create myTopic
create Bar/myOtherTopic
```

This sets the current topic manager to the one with instance name `Foo`; the first `create` command then creates the
topic within that topic manager, whereas the second `create` command uses the topic manager with instance name `Bar`.

{% /property-description %}
