---
id: datastorm-node-properties
title: DataStorm.Node.*
---

# DataStorm.Node.ConnectTo

#### Synopsis

`DataStorm.Node.ConnectTo=endpoints`

#### Description

Set the endpoints of the node to connect to `endpoints`. The node will connect to one of the endpoint and advertise its
topics through this node. It will also receive topic announcements from other connected nodes. If the node disables its
endpoints with `DataStorm.Node.Server.Enabled=0`, it might also receive data updates through the connection established
to the connected node.

# DataStorm.Node.RetryCount

#### Synopsis

`DataStorm.Node.RetryCount=num`

#### Description

If `num` is a value greater than 0, the DataStorm node will retry establishing the connection with a node up to `num`
times. If not defined the default value is 6.

# DataStorm.Node.RetryMultiplier

#### Synopsis

`DataStorm.Node.RetryMultiplier=num`

#### Description

Before retrying to establish the connection to a node, the DataStorm node will wait for a delay equal to
`(retryDelay * retryMultiplier ^ retryAttempt)` where `retryDelay` is the value specified by
`DataStorm.Node.RetryDelay`, `retryMultiplier` is the value specified by this property and `retryAttempt` is the retry
attempt number. If not defined, the default value is 2.

# DataStorm.Node.RetryDelay

#### Synopsis

`DataStorm.Node.RetryDelay=ms`

#### Description

The initial delay to wait before retrying. If not defined the default value is 500ms.

# DataStorm.Node.Server.Enabled

#### Synopsis

`DataStorm.Node.Server.Enabled=num`

#### Description

If `num` is a value greater than 0, the DataStorm node will accept connections through the endpoints defined with
[DataStorm.Node.Server.Endpoints](../object-adapter-properties). If 0, the node won't accept connections and will
instead receive data through client network connections established with other DataStorm nodes. If not defined the
default value is 1.

# DataStorm.Node.Server._AdapterProperty_

#### Synopsis

`DataStorm.Node.Server.AdapterProperty=value`

#### Description

DataStorm uses the adapter name `DataStorm.Node.Server` for the object adapter that processes incoming requests from
other DataStorm nodes. Therefore, [adapter properties](../object-adapter-properties) can be used to configure this
adapter.

The [DataStorm.Node.Server.Endpoints](../object-adapter-properties) controls the server endpoint for a DataStorm node.
If not defined, the default endpoint is `tcp`, and the node listens on all available network interfaces with a system
allocated port number.

# DataStorm.Node.Server.ForwardDiscoveryToMulticast

#### Synopsis

`DataStorm.Node.Server.ForwardDiscoveryToMulticast=num`

#### Description

If `num` is a value greater than 0, the DataStorm node will forward received discovery announcements over multicast if
multicast is enabled. If not defined the default value is 0.

# DataStorm.Node.Multicast.Enabled

#### Synopsis

`DataStorm.Node.Multicast.Enabled=num`

#### Description

If `num` is a value greater than 0, multicast discovery is enabled for the DataStorm node. If not defined the default
value is 1.

# DataStorm.Node.Multicast._AdapterProperty_

#### Synopsis

`DataStorm.Node.Multicast.AdapterProperty=value`

#### Description

DataStorm uses the adapter name `DataStorm.Node.Multicast` for the object adapter that processes incoming multi-cast
requests from other DataStorm nodes.

The `DataStorm.Node.Multicast.Endpoints` property controls the multicast endpoint for a DataStorm node. If not defined,
the default endpoint is `udp -h 239.255.0.1 -p 10000`.

# DataStorm.Node.Multicast.Proxy

#### Synopsis

`DataStorm.Node.Multicast.Proxy=proxy`

#### Description

Defines the proxy used for multicast discovery. If this property is not defined, the node uses a proxy with the lookup
object identity shown below and the endpoints configured with `DataStorm.Node.Multicast.Endpoints`.

The identity in this proxy must match the lookup object identity of the DataStorm version you are using:

| DataStorm version | Lookup object identity |
| ----------------- | ---------------------- |
| 3.8.0 to 3.8.2    | `DataStorm/Lookup`     |
| 3.8.3 or later    | `DataStorm/Lookup2`    |

This property is typically used to set datagram options that can't be derived from `DataStorm.Node.Multicast.Endpoints`,
such as the outgoing interface.
