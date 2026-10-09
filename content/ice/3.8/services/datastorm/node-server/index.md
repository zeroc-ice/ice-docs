---
title: Node Server
---

DataStorm provides a node server executable named `dsnode`.

This executable is a simple program that instantiates a [DataStorm node](../datastorm-concepts/node). It supports Ice
[properties and configuration](../../../runtime/properties-and-configuration/properties-class).

It can be used to provide the following functionality to other nodes:

- registration: nodes can connect and register with `dsnode` in order to exchange topic discovery information.
- bridging: nodes with disabled server endpoints can connect to `dsnode` to receive data from other nodes.

See [Connectivity](../datastorm-concepts/connectivity) for additional information.

## Command Line Options for `dsnode`

The DataStorm node supports the following command-line options:

```text
Usage: dsnode [options]
Options:
-h, --help               Show this message.
-v, --version            Display the DataStorm version.
```

## Configuring Endpoints

The node server supports the same properties as any DataStorm node so its endpoints are defined with the
[DataStorm.Node.Server.Endpoints](../../../property-reference/datastorm-node-properties) property. You should use a
fixed port for the endpoint in order to allow other nodes to connect by specifying this node's endpoints with the
[`DataStorm.Node.ConnectTo`](../../../property-reference/datastorm-node-properties#datastorm.node.connectto) property.
