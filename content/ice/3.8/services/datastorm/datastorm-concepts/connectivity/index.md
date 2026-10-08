---
title: Connectivity
---

DataStorm [nodes](../node) connect to each other to exchange [samples](../sample). DataStorm supports multiple
networking configurations to establish these connections:

- **Multicast discovery** — nodes automatically discover peers using UDP multicast.
- **Direct connections** — nodes connect directly to specific peers using configured endpoints.
- **Broker nodes** — nodes connect through broker nodes that act as discovery hubs or relay points within the network.

## Multicast Discovery

When multicast discovery is enabled (the default), nodes broadcast reader and writer creation announcements to a
configured multicast address and listen for announcements from other nodes on the same address.

DataStorm nodes use the `DataStorm.Node.Multicast` object adapter to handle multicast communication. By default, it
listens on the following endpoint:

`udp -h 239.255.0.1 -p 10000`

You can override this endpoint by setting `DataStorm.Node.Multicast.Endpoints=<endpoint>`.

To disable multicast discovery, set:

`DataStorm.Node.Multicast.Enabled=0`

{% callout type="info" %}

Multicast carries only the discovery announcements. Nodes communicate with one another over regular network connections,
typically TCP connections. Each announcement includes the endpoints of the announcing node; a node that finds a matching
reader or writer in an announcement then connects to the announcing node over these endpoints.

{% /callout %}

## Direct Node Connections

A DataStorm node can connect directly to another node by setting the `DataStorm.Node.ConnectTo` property to the endpoint
of the peer node it should connect to.

Nodes that act as servers use the `DataStorm.Node.Server` object adapter, which can be configured using the
`DataStorm.Node.Server.*` object adapter properties.

When configured this way, a node establishes a session with its peer on startup. Once a session is established between
two nodes, they exchange reader and writer creation announcements.

These announcements are also forwarded to other nodes connected to either peer, allowing multi-hop propagation of
activity across the network.

A node can disable its server side by setting:

`DataStorm.Node.Server.Enabled=0`

Such nodes can only communicate with peers they connect to directly, or with other serverless nodes through an
intermediary forwarder node.

## Broker Nodes

Some nodes may serve purely as **brokers** — they do not define application-level readers or writers and are used only
to route communication between nodes that do.

Broker nodes are useful when certain nodes are not directly accessible — for example, when they are behind a protected
network — or when the application topology does not fit well with a fixed set of nodes using well-known endpoints.

Only the node acting as a broker needs to be configured as a server. Other nodes can connect to it and rely on the
broker to relay messages, including reader and writer announcements, as well as published samples.

In other setups, nodes connected to the broker can act as servers themselves and use the broker only for discovery. In
this configuration, only the broker uses a well-known endpoint, while other nodes rely on it to discover the DataStorm
network. Once discovered, nodes can establish direct connections with each other to exchange samples without routing all
traffic through the broker.

In such scenarios, you can use the [dsnode server](../node-server) executable instead of creating a custom node server
programmatically.

## Example Configurations

### One writer with multiple readers

The writer listens on a well known server endpoint and multiple readers can connect to it.

![Two readers connect to a writer listening on TCP port 10000. The arrows show who initiates each connection.](/attachments/3.8/connectivity/one-writer-multiple-readers.svg)

In this configuration the writer is acting as a server, the readers don’t need to configure any server endpoints.

### One reader with multiple writers

The reader listens on a well known server endpoint and multiple writers can connect to it.

![Two writers connect to a reader listening on TCP port 10000. The arrows show who initiates each connection.](/attachments/3.8/connectivity/one-reader-multiple-writers.svg)

In this configuration the reader is acting as a server, the writers don’t need to configure any server endpoints.

### Multiple readers and writers with a broker node

In this configuration, multiple readers and writers connect to a **broker node**, which serves as a hub for discovery
and sample forwarding.

The broker node can be any node in the system — for example, one of the readers or writers — or a dedicated node used
exclusively for brokering connections.

![Two writers and two readers connect to a broker node listening on TCP port 10000. All arrows point toward the broker because the readers and writers initiate the connections.](/attachments/3.8/connectivity/multiple-readers-and-writers-single-broker.svg)

Only the broker node needs to configure a server endpoint. Readers and writers can disable their own server endpoints
and rely on the broker node for discovery and message relaying between nodes.

You can also use a **hybrid setup** where the broker node is used only for discovery: readers and writers keep their
default server endpoints, and connect directly to each other once the broker node has forwarded their announcements.

### Multiple Readers and Writers with Replicated Broker Nodes

In this configuration, readers and writers connect to one of several **broker nodes**. This setup avoids the single
point of failure present in the previous scenario with a single broker node.

![Readers and writers are configured with both broker endpoints. Solid and dashed paths show their connections and alternate broker choices. Broker node 1 listens on port 10000; broker node 2 listens on port 10001 and connects to broker node 1.](/attachments/3.8/connectivity/multiple-readers-and-writers-with-replicated-broker.svg)

Each reader and writer connects to a single broker node at a time. If the connection to that broker node fails, the
client can automatically fall back to another available broker node. This ensures high availability and prevents any
single point of failure.

All broker nodes must be interconnected to exchange topic announcements from their connected readers and writers.

As in the previous scenario, the broker nodes can act either as discovery hubs only or as both discovery hubs and sample
relays.
