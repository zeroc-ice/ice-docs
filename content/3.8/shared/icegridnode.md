---
id: icegridnode
title: icegridnode
---

An IceGrid node is a process that [activates, monitors, and deactivates](../icegrid-server-activation) registered server processes. You can run any number of nodes in a domain, but typically there is one node per host. A node must be running on each host on which servers are activated automatically, and nodes cannot run without an IceGrid registry.

The IceGrid node server is implemented by the `icegridnode` executable. If you wish to run a registry and node in one process, `icegridnode` is the executable you must use.

{% callout type="info" %}
We recommend that you always run `icegridnode` and `icegridregistry` in separate processes.
{% /callout %}

# Command Line Options for `icegridnode`

The node supports the following command-line options:

```shell
Usage: icegridnode [options]
Options:
-h, --help           Show this message.
-v, --version        Display the Ice version.
--readonly           Start the collocated master registry in
                     read-only mode.
--initdb-from-replica <replica>
                     Initialize the collocated registry database from the
                     given replica.

--deploy DESCRIPTOR [TARGET1 [TARGET2 ...]]
                     Add or update descriptor in file DESCRIPTOR,
                     with optional targets.
```

If you are running the node with a collocated registry, the `--readonly` option prevents any updates to the registry's database; it also prevents slaves from synchronizing their databases with this master. This option is useful when you need to verify that the master registry's database is correct after [promoting a slave](../promoting-a-registry-slave) to become the new master. The `--initdb-from-replica` option allows you to initialize the database from another registry replica. This option is useful when you need to start a new master with the contents of a slave database.

The `--deploy` option allows an application to be [deployed](../using-icegrid-deployment) automatically as the node process starts, which can be especially useful during testing. The command expects the name of the XML deployment file, and optionally allows the names of the individual [targets](../icegrid-xml-features) within the file to be specified.

Additional command line options are supported, including those that allow the node to run as a [Windows service or Unix daemon](../command-line-options), and Ice includes a [utility](../windows-services) to help you install an IceGrid node as a Windows service.

# Configuring Node Endpoints

The IceGrid node's endpoints are defined by the [IceGrid.Node.Endpoints](../icegrid-properties) property and must be accessible to the registry. It is not necessary to use a fixed port because each node contacts the registry at startup to provide its current endpoint information.

# Node Security Considerations

It is important that you give careful consideration to the permissions of the account under which the node runs. If the servers that the node will activate have no special [access requirements](../icegrid-server-activation), and all of the servers can use the same account, it is recommended that you do not run the node under an account with system privileges, such as the root account on Unix or the Administrator account on Windows.

# Configuring a Data Directory for the Node

The node requires an empty directory that it can use to store server files - more specifically, Ice config files for these servers. The pathname of this directory is supplied by the configuration property [IceGrid.Node.Data](../icegrid-properties). To clear a node's state, first ensure the server is not currently running, then remove all of the files in its data directory and restart the server.

{% callout type="warning" %}
The node's [data directory](../icegrid-persistent-data) may also contain files and subdirectories used by your application's servers. Before destroying the contents of the node's data directory, make sure that all servers are stopped and any important files are backed up.
{% /callout %}

# Node Configuration Example

A minimal node configuration is shown in the following example:

```
IceGrid.Node.Endpoints=tcp
IceGrid.Node.Name=Node1
IceGrid.Node.Data=/opt/ripper/node

Ice.Default.Locator=IceGrid/Locator:tcp -p 4061
```

The value of the [IceGrid.Node.Name](../icegrid-properties) property must match that of a deployed node known by the registry.

The [Ice.Default.Locator](../ice-default-properties) property is used by the node to contact the registry. The value is a proxy that contains the [registry's client endpoints](../getting-started-with-icegrid). (You can avoid the need to define `Ice.Default.Locator` by using [IceLocatorDiscovery](../icelocatordiscovery).)

If you wish to run a collocated registry and node server, enable the property [IceGrid.Node.CollocateRegistry](../icegrid-properties) and include the [registry's configuration properties](../icegridregistry).

The remaining configuration properties are discussed in [IceGrid.*](../icegrid-properties).

##### See Also

- [IceGrid Server Activation](../icegrid-server-activation)
- [Promoting a Registry Slave](../promoting-a-registry-slave)
- [IceGrid Persistent Data](../icegrid-persistent-data)
- [Getting Started with IceGrid](../getting-started-with-icegrid)
- [Using IceGrid Deployment](../using-icegrid-deployment)
- [Windows Services](../windows-services)
- [IceGrid.*](../icegrid-properties)
