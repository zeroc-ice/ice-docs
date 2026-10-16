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
- **Load Factor** A floating point value by which the registry multiplies the node's load when the Adaptive
  [load-balancing](../replica-group-descriptor) policy ranks the nodes from least to most loaded. The node's load is its
  load average on Linux and macOS, and its CPU utilization on Windows. When this value is blank, the IceGrid registry
  uses the default: 1.0 divided by the number of hardware threads on Linux and macOS, and 1.0 on Windows, which puts
  both on the same scale, the share of the node's processing capacity in use. A larger factor makes the node rank as
  more loaded.

## Children

A node can have two types of children:

- [Server](../server-descriptor)
- [Property Set](../property-set-descriptor)
