---
title: DataStorm.Node.*
---

# DataStorm.Node.ConnectTo

#### Synopsis

`DataStorm.Node.ConnectTo=endpoints`

#### Description

Set the endpoints of the node to connect to `endpoints`. The node will connect to one of the endpoints and advertise its
topics through this node. It will also receive topic announcements from other connected nodes. If the node disables its
endpoints with `DataStorm.Node.Server.Enabled=0`, it might also receive data updates through the connection established
to the connected node.

The value is an endpoint list, for example:

```config
DataStorm.Node.ConnectTo=tcp -h node.example.com -p 10000
```

DataStorm uses these endpoints with the object identity `DataStorm/Lookup2`. Failed connection attempts retry
indefinitely, using the delays described by
[DataStorm.Node.RetryMultiplier](../datastorm-node-properties#datastorm.node.retrymultiplier). When an established
connection closes, DataStorm attempts to reconnect immediately.

# DataStorm.Node.Name

#### Synopsis

`DataStorm.Node.Name=name`

#### Description

Specifies the name of the node. DataStorm uses this name to identify the node to its peers and in the session traces
enabled by [DataStorm.Trace.Session](../datastorm-trace-properties#datastorm.trace.session). Nodes that communicate with
each other must have distinct names: a node ignores announcements from a node with its own name. If this property is not
set, DataStorm generates a UUID for the name. Set it when you want recognizable node names in traces.

# DataStorm.Node.RetryCount

#### Synopsis

`DataStorm.Node.RetryCount=num`

#### Description

Specifies the maximum number of retries to establish a peer session after a connection failure. The default is 6. A
value of 0 or less disables these session retries.

For the node configured with [DataStorm.Node.ConnectTo](../datastorm-node-properties#datastorm.node.connectto), retries
continue indefinitely; `RetryCount` caps the exponent used to compute the retry delay.

# DataStorm.Node.RetryMultiplier

#### Synopsis

`DataStorm.Node.RetryMultiplier=num`

#### Description

Specifies the multiplier used to increase the delay between connection attempts. The default is 2.

For peer-session retries, the first retry is immediate. For retry number `n` starting at 2, the delay in milliseconds is
`RetryDelay * RetryMultiplier ^ min(n - 2, RetryCount)`. With the defaults, the six retry delays are 0, 500, 1,000,
2,000, 4,000 and 8,000 milliseconds.

For failed connection attempts to the node configured with
[DataStorm.Node.ConnectTo](../datastorm-node-properties#datastorm.node.connectto), retry number `n` starts at 1 and uses
`RetryDelay * RetryMultiplier ^ min(n - 1, RetryCount)`. With the defaults, these delays start at 500 milliseconds and
double up to 32,000 milliseconds; subsequent attempts use the capped delay.

# DataStorm.Node.RetryDelay

#### Synopsis

`DataStorm.Node.RetryDelay=ms`

#### Description

Specifies the base retry delay in milliseconds. The default is 500. DataStorm combines this value with
[DataStorm.Node.RetryMultiplier](../datastorm-node-properties#datastorm.node.retrymultiplier) to compute the delay for
each retry.

# DataStorm.Node.Server.Enabled

#### Synopsis

`DataStorm.Node.Server.Enabled=num`

#### Description

If `num` is a value greater than 0, the DataStorm node will accept connections through the endpoints defined with
[DataStorm.Node.Server.Endpoints](../object-adapter-properties). If 0, the node won't accept connections and will
instead receive data through client network connections established with other DataStorm nodes. If not defined the
default value is 1.

If a peer loses its connection to a node with no endpoints, it waits for that node to reconnect. The peer removes the
session if the node does not reconnect within `2 * RetryDelay * RetryMultiplier ^ RetryCount` milliseconds (64,000
milliseconds with the defaults).

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

DataStorm uses the adapter name `DataStorm.Node.Multicast` for the object adapter that processes incoming multicast
requests from other DataStorm nodes.

The `DataStorm.Node.Multicast.Endpoints` property controls the multicast endpoint for a DataStorm node. If not defined,
the default endpoint is `udp -h 239.255.0.1 -p 10000`, and DataStorm sets `DataStorm.Node.Multicast.PublishedHost` to
`239.255.0.1`. When you specify endpoints, the adapter's [published-endpoint properties](../object-adapter-properties)
control the endpoints advertised in its proxies.

# DataStorm.Node.Multicast.Proxy

#### Synopsis

`DataStorm.Node.Multicast.Proxy=proxy`

#### Description

Defines the proxy used for multicast discovery. Its identity must be `DataStorm/Lookup2`. DataStorm uses this proxy in
datagram mode.

When this property is not set, DataStorm creates a proxy for `DataStorm/Lookup2` using the multicast adapter's published
endpoints.

This property can supply datagram options such as the outgoing interface.
