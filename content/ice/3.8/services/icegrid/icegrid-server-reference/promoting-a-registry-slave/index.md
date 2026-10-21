---
title: Promoting a Registry Slave
---

In a [replicated IceGrid deployment](../../registry-replication), you promote a slave registry to master when the master
becomes unavailable and cannot be restarted soon, for example after a hardware failure. Slaves do not provide the
master's features, such as [resource allocation](../../resource-allocation-using-icegrid-sessions) and changes to the
[deployment](../../using-icegrid-deployment) data.

{% callout type="warning" title="Running Two Masters" %}
After promoting a slave, do not restart the former master with its previous configuration. A registry starts as the
master when
[IceGrid.Registry.ReplicaName](../../../../property-reference/icegrid-properties#icegrid.registry.replicaname) is
`Master` or not set, and IceGrid does not prevent two masters from running: each node and slave then follows the
deployment information of whichever master it connects to.
{% /callout %}

## Promoting a Slave

To promote a slave registry to master:

1. Shut down the slave registry.
2. Change its
   [IceGrid.Registry.ReplicaName](../../../../property-reference/icegrid-properties#icegrid.registry.replicaname)
   property to `Master`, or remove the property altogether.
3. Restart the registry.

## Reconnecting Registries and Nodes

Slaves and nodes connect to the new master through their default locator, when the endpoints of this locator include
those of the new master or of a slave connected to the new master. The new master also asks the slaves recorded in its
database to connect when it starts, and asks a node to connect the first time it needs this node.

## Recovering the Former Master

To bring the former master back, restart its registry as a slave: set the `IceGrid.Registry.ReplicaName` property of
this registry to a name that no other registry uses, and its `Ice.Default.Locator` property to a proxy for the new
master's locator. Like any other slave, the registry copies the master's database when it connects to the master.

A slave does not copy the master's database when its own database is newer, that is, when it holds updates that the
master's database lacks. To resolve this, restart the registry whose database you want to discard with the
`--initdb-from-replica=<name>` option, which initializes its database from the named registry.

## See Also

- [Registry Replication](../../registry-replication)
- [Resource Allocation Using IceGrid Sessions](../../resource-allocation-using-icegrid-sessions)
- [Using IceGrid Deployment](../../using-icegrid-deployment)
- [icegridadmin Command Line Tool](../../icegridadmin-command-line-tool)
