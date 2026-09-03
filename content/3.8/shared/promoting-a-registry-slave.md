---
id: promoting-a-registry-slave
title: Promoting a Registry Slave
---

In a [replicated IceGrid deployment](../registry-replication), you may need to promote a slave to be the new master if the current master becomes unavailable. For example, this situation can occur when the original master cannot be restarted immediately due to a hardware problem, or when your application requires a feature that is only accessible via the master, such as the [resource allocation](../resource-allocation-using-icegrid-sessions) facility or the ability to modify the [deployment](../using-icegrid-deployment) data.

To promote a slave to become the new master, you must shut down the slave and change its [IceGrid.Registry.ReplicaName](../icegrid-properties) property to `Master` (or remove the property altogether). On restart, the new master notifies the nodes and registries that were active before it was shut down. An inactive registry or node will eventually connect to the new master if its default locator proxy contains the endpoint of the new master registry or the endpoint of a slave that is connected to the new master. If you cannot afford any down-time of the registry and want to minimize the down-time of the master, you should run at least two slaves. That way, if the master becomes unavailable, there will always be one registry available while you promote one of the slaves.

IceGrid ensures that an out-of-date master database cannot overwrite a newer slave database. In such a scenario, an error message is printed out on the consoles of the IceGrid master and slave, and the slave connection to the master is aborted. You can still connect to the slave and master with the IceGrid [administrative tools](../icegridadmin-command-line-tool) to verify their databases. Once you determine which database to keep, you can restart either the slave or the master with the `--initdb-from-replica=<name>` option to initialize the out-of-date database with the correct version.

Note that there is nothing to prevent you from running two masters. If you start two masters and they contain different versions of the deployment information, some slaves and nodes might get updated with out-of-date deployment information (causing some of your servers to be deactivated). You can correct the problem by shutting down the faulty master, but it is important to keep this issue in mind when you restart a master since it might disrupt your applications.

##### See Also

- [Registry Replication](../registry-replication)
- [Resource Allocation using IceGrid Sessions](../resource-allocation-using-icegrid-sessions)
- [Using IceGrid Deployment](../using-icegrid-deployment)
- [icegridadmin Command Line Tool](../icegridadmin-command-line-tool)
