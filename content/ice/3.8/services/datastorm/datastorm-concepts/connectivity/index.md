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

DataStorm nodes use the `DataStorm.Multicast` object adapter to handle multicast communication. By default, it listens
on the following endpoint:

`udp -h 239.255.0.1 -p 10000`

You can override this by setting the property:`DataStorm.Multicast.Endpoint=<endpoint>`

If you change the multicast endpoint, you must also configure one of the following:

- `DataStorm.Node.Multicast.PublishedHost` — specifies the host used by the multicast endpoint.
- `DataStorm.Node.Multicast.Proxy` — specifies the proxy used to send multicast announcements.

To disable multicast discovery, set:

`DataStorm.Node.Multicast.Enabled=0`

{% callout type="note" %}

Multicast is used only for discovery. Nodes must still configure server endpoints to connect to each other after
discovery, but these endpoints do not need to be fixed or well-known.

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

In such scenarios, you can use the [dsnode server](../../node-server) executable instead of creating a custom node
server programmatically.

## Example Configurations

### One Writer with Multiple Readers

The writer listens on a well known server endpoint and multiple readers can connect to it.

![Two readers connect to a writer listening on TCP port 10000. The arrows show who initiates each connection.](/images/ice/3.8/connectivity/one-writer-multiple-readers.svg)

In this configuration the writer is acting as a server, the readers don’t need to configure any server endpoints.

### One Reader with Multiple Writers

The reader listens on a well known server endpoint and multiple writers can connect to it.

![Two writers connect to a reader listening on TCP port 10000. The arrows show who initiates each connection.](/images/ice/3.8/connectivity/one-reader-multiple-writers.svg)

In this configuration the reader is acting as a server, the writers don’t need to configure any server endpoints.

### Multiple Readers and Writers with a Broker Node

In this configuration, multiple readers and writers connect to a **broker node**, which serves as a hub for discovery
and sample forwarding.

The broker node can be any node in the system — for example, one of the readers or writers — or a dedicated node used
exclusively for brokering connections.

![Two writers and two readers connect to a broker node listening on TCP port 10000. All arrows point toward the broker because the readers and writers initiate the connections.](/images/ice/3.8/connectivity/multiple-readers-and-writers-single-broker.svg)

Only the broker node needs to configure a server endpoint. Readers and writers can disable their own server endpoints
and rely on the broker node for discovery and message relaying between nodes.

You can also use a **hybrid setup** where the broker node is used only for discovery. In this case, readers and writers
connect directly to each other after discovery.

Readers and writers in this configuration must still configure server endpoints, but these do not need to be fixed or
well-known. Their endpoints are automatically discovered through the broker node, which acts as a registry for network
discovery.

### Multiple Readers and Writers with Replicated Broker Nodes

In this configuration, readers and writers connect to one of several **broker nodes**. This setup avoids the single
point of failure present in the previous scenario with a single broker node.

![Readers and writers are configured with both broker endpoints. Solid and dashed paths show their connections and alternate broker choices. Broker node 1 listens on port 10000; broker node 2 listens on port 10001 and connects to broker node 1.](/images/ice/3.8/connectivity/multiple-readers-and-writers-with-replicated-broker.svg)

Each reader and writer connects to a single broker node at a time. If the connection to that broker node fails, the
client can automatically fall back to another available broker node. This ensures high availability and prevents any
single point of failure.

All broker nodes must be interconnected to exchange topic announcements from their connected readers and writers.

As in the previous scenario, the broker nodes can act either as discovery hubs only or as both discovery hubs and sample
relays.
