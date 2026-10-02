---
title: Node Descriptor
---

A node represents an IceGrid node that starts and monitors your servers. Several applications can be deployed on the
same node; however a node descriptor describes only the servers defined by the enclosing application.

## Properties

The Node Properties panel offers the following fields:

- **Name** The name of the node. This name must match the IceGrid.Node.Name configuration property of the node process.
- **Description** A free-text description of this node.
- **Variables** This table shows node-level [IceGrid variables](../variables-in-icegrid-descriptors).
- **Load Factor** A floating point value used to compare different nodes when making a
  [load-balancing](../replica-group-descriptor) decision based on load-average (for Linux and Unix) or CPU utilization
  (for Windows). Leaving this value blank is equivalent to the default: 1.0 on Linux and Unix, and 1.0 divided by the
  number of CPUs on Windows.

## Children

A node can have two types of children:

- [Server](../server-descriptor)
- [Property Set](../property-set-descriptor)
