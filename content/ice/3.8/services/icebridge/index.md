---
title: IceBridge
---

IceBridge is an Ice service that forwards requests from one or more clients to a target server. Use it when a client
cannot connect directly to the server, for example because the client does not support the server's transport. IceBridge
is implemented in C++ and can forward requests from clients using any Ice language mapping.

# IceBridge Overview

IceBridge listens for client requests on its _source endpoints_ and forwards them to its configured _target endpoints_.
The bridge forwards the object identity, operation, context, and encoded parameters, so it does not need your
application's Slice definitions. Replies, including user exceptions, travel back through the bridge to the client.

IceBridge provides several features:

- **Connection matching** For a connection-oriented transport, the bridge opens a dedicated target connection when it
  receives the first request to forward on a client connection. It uses this pair of connections for subsequent
  requests. Closing either connection causes the bridge to close the other. This pairing supports applications that
  associate session state with connections.
- **Bidirectional requests** IceBridge configures every connection to the server to support
  [bidirectional requests](../bidirectional-connections). All bidirectional callback requests sent from the server are
  automatically forwarded back to the client via the client's connection with the bridge.
- **Router support** IceBridge implements the `Ice::Router` interface, allowing clients to use the bridge without
  replacing the endpoints in each application proxy. For session authentication and access control, use
  [Glacier2](../glacier2).

IceBridge supports twoway, oneway, and datagram invocations. See [IceBridge Limitations](#icebridge-limitations) for
restrictions on target servers, facets, and credentials.

# Configuring IceBridge

Configure the bridge with the following [IceBridge properties](../icebridge-properties):

- `IceBridge.Source.Endpoints` This required property lists the endpoints on which IceBridge receives requests from
  clients. `IceBridge.Source` is also the name of an object adapter, which means all of the other
  [object adapter properties](../object-adapter-properties) can be configured as well.
- `IceBridge.Target.Endpoints` This required property identifies the endpoints of the target server. Note that listing
  multiple endpoints in this property means IceBridge will follow the usual Ice process for
  [establishing a connection](../connection-establishment) to the server. However, once IceBridge has established a
  matching connection, it will continue to use that connection for the lifetime of the client's connection to the
  bridge.
- `IceBridge.InstanceName` This optional property specifies the identity category of the
  [router object](#icebridge-object-identities). Its default value is `IceBridge`.

{% callout type="tip" %}

IceBridge includes the TCP, UDP, SSL, and WebSocket transports. For Bluetooth endpoints, configure the bridge to load
the IceBT plug-in as shown below.

{% /callout %}

Here's a simple example:

```config
# IceBridge.Source is an object adapter; IceBridge.Target is not.

IceBridge.Source.Endpoints=tcp -p 10000
IceBridge.Target.Endpoints=tcp -h target.host -p 21112
```

The bridge listens on TCP port 10000 for connections from clients and forwards requests to the target server on TCP
port 21112.

## Matching Transports

Source and target endpoints can use different connection-oriented transports, such as TCP and SSL, or TCP and Bluetooth.
For datagram requests, the target must provide a datagram endpoint. Likewise, requests arriving over a
connection-oriented transport require a connection-oriented target endpoint.

For example, the following configuration cannot forward requests:

```config
IceBridge.Source.Endpoints=udp -p 10000
IceBridge.Target.Endpoints=tcp -h target.host -p 21112
```

The bridge receives datagram requests on its source endpoint, but the target configuration provides only a TCP endpoint.
Forwarding fails when a request arrives.

TLS applies independently to the two connections. An SSL source endpoint does not require IceBridge to choose an SSL
target endpoint. To encrypt the connection to the target, configure only secure target endpoints and the appropriate
[IceSSL properties](/ice/3.8/property-reference/icessl-properties?lang=cpp).

## Bridging to Bluetooth

On Linux, load the [IceBT transport plug-in](/ice/3.8/plugins/icebt?lang=cpp) to bridge between TCP and Bluetooth:

```config
Ice.Plugin.IceBT=IceBT:createIceBT
IceBridge.Source.Endpoints=tcp -p 10000
IceBridge.Target.Endpoints=bt -a "01:23:45:67:89:AB" -u "6a193943-1754-4869-8d0a-ddc5f9a2b294"
```

With this configuration, a client can connect to the bridge using TCP, and the bridge will establish a Bluetooth
connection to the device with the given address offering the service identified by the given UUID.

# IceBridge Object Identities

IceBridge hosts two well-known objects on its source endpoints:

| Identity           | Interface           | Purpose                                                  |
| ------------------ | ------------------- | -------------------------------------------------------- |
| `IceBridge/router` | `Ice::Router`       | Configures clients to route requests through the bridge. |
| `Ice/RouterFinder` | `Ice::RouterFinder` | Returns the bridge's router proxy from `getRouter`.      |

Clients can configure a router proxy using its identity together with the bridge's source endpoints. Reserve both
identities for the bridge's own objects. If the application requires a different router identity, you can set the
`IceBridge.InstanceName` property to change the category of the object identity as shown in the example below:

```config
IceBridge.InstanceName=PublicBridge
```

This property changes the category of the object identity, which becomes `PublicBridge/router`. The client's
configuration must also be changed to reflect the new identity:

```config
Ice.Default.Router=PublicBridge/router:tcp -h bridge.host -p 10000
```

{% callout type="info" %}

The finder identity remains `Ice/RouterFinder` regardless of `IceBridge.InstanceName`. A client that knows the bridge's
source endpoints can call `getRouter` on a proxy such as `Ice/RouterFinder:tcp -h bridge.host -p 10000` to discover the
router proxy at runtime.

{% /callout %}

# Using IceBridge

Clients can use IceBridge as a router or address the bridge's source endpoints directly:

- Does the target server create and return proxies that the client uses for subsequent invocations? Configure the client
  to use IceBridge as a router if these invocations must also pass through the bridge. Ice then ignores the endpoints
  that the server returned in these proxies and uses the IceBridge endpoints instead.
- Does the client statically configure a number of proxies? If so, configuring IceBridge as a router is convenient but
  not mandatory. Again, using IceBridge as a router causes Ice to ignore the endpoints in arbitrary proxies and instead
  use the bridge endpoints. This avoids having to manually modify all of the statically-configured proxies to use the
  IceBridge source endpoints.
- Otherwise, you can either configure your client to use IceBridge as a router, or modify your client's proxies to have
  the IceBridge source endpoints. We provide examples of both scenarios below.

Let's assume the bridge has the following configuration:

##### **Bridge Configuration**

```config
IceBridge.Target.Endpoints=tcp -h target.host -p 21112
IceBridge.Source.Endpoints=tcp -p 10000
```

The client can use IceBridge as a router by defining `Ice.Default.Router`:

##### **Client Configuration with Router**

```config
Ice.Default.Router=IceBridge/router:tcp -h bridge.host -p 10000
Client.Proxy=SomeObject:tcp -h other.host -p 9999
```

When the client loads `Client.Proxy` with `propertyToProxy`, invocations on this proxy go through the router to
`target.host` on port 21112. The bridge forwards requests for the identity `SomeObject`, which the target server must
provide. The endpoint `other.host:9999` does not select the target server.

{% callout type="info" %}

Setting `Ice.Default.Router` affects **all** proxies by default. Ice also provides more selective ways of configuring a
router, such as with a [proxy property](../proxy-properties) or a [proxy method](../routers).

{% /callout %}

If you've decided not to use IceBridge as a router, replace the existing endpoints in the client's proxies with the
bridge's source endpoints:

##### **Client Configuration without Router**

```config
Client.Proxy=SomeObject:tcp -h bridge.host -p 10000
```

## Receiving Callbacks

The client must create an object adapter and register its callback objects. It can associate this adapter with the
bridge connection in either of these ways:

- When using the bridge as a router, configure the callback adapter with the same router proxy, using the
  [object adapter's `Router` property](../object-adapter-properties) or `createObjectAdapterWithRouter`. Setting
  `Ice.Default.Router` alone does not configure callback adapters.
- When connecting directly to the bridge's source endpoints, associate the callback adapter with the connection using
  `setAdapter`, as described in [Bidirectional Connections](../bidirectional-connections).

For example, a client that creates a callback adapter named `Callbacks` can use:

```config
Ice.Default.Router=IceBridge/router:tcp -h bridge.host -p 10000
Callbacks.Router=IceBridge/router:tcp -h bridge.host -p 10000
```

The target server sends callbacks using a fixed proxy bound to the connection on which it received the client's request.
It can create this proxy with the connection's `createProxy` method or bind a callback proxy with `ice_fixed`. IceBridge
forwards the callback over the paired client connection. See
[Configuring a Server for Bidirectional Connections](../bidirectional-connections#configuring-a-server-for-bidirectional-connections).

# Starting IceBridge

Save the bridge configuration in a file named `config` and start the service with:

```shell
icebridge --Ice.Config=config
```

IceBridge requires both endpoint properties at startup. It establishes target connections on demand, so successful
startup does not verify that the target server is reachable. To check forwarding, invoke an operation such as `ice_ping`
on an application object through the bridge.

Use `icebridge --help` to list command-line options and `icebridge --version` to display the Ice version. IceBridge also
supports running as a [Windows service or Unix daemon](../command-line-options).

## Connection Failures

If IceBridge cannot establish a target connection, it fails the requests waiting for that connection and closes the
client connection. A twoway invocation can report an `UnknownLocalException` containing details of the forwarding
failure.

Once the bridge establishes a pair of connections, it forwards requests on those connections for their remaining
lifetimes. If either closes, the bridge closes its counterpart. A later client connection creates a new pair; an
application that associates session state or callback proxies with a connection must reestablish them for the new
connection.

# IceBridge Limitations

### Single target server

A single IceBridge instance can support multiple clients simultaneously. All clients use the same configured target
endpoints, which provide alternative ways to reach one logical target server. A proxy returned by that server can use
the bridge only if its object is reachable through these target endpoints.

If your clients need to bridge to multiple servers, you must start a separate IceBridge instance for each target server.

### Facets

IceBridge forwards requests to the default facet of the target object. A request addressed to a named facet loses its
facet name when the bridge forwards it. This also applies to callbacks. Applications that use IceBridge must expose the
required operations on the default facet.

### Clients that create object adapters

A _mixed client-server_ application is one that creates an object adapter in order to receive new incoming connections,
while a _bidirectional client_ creates an object adapter solely to receive callbacks over an existing outgoing
connection that has been configured for bidirectional requests. IceBridge supports bidirectional clients, but a mixed
client-server application may require more administrative effort. For example, if the application wants to use IceBridge
for its outgoing connections, and also use IceBridge for its incoming connections, then you would need to start two
instances of IceBridge, one for each direction.

### SSL credentials

IceBridge terminates TLS on each secure connection. The target server authenticates the bridge's certificate when it
requires a client certificate. IceBridge uses the credentials configured with its
[IceSSL properties](/ice/3.8/property-reference/icessl-properties?lang=cpp) for both accepting secure client connections
and establishing secure connections to the target server.

### Bluetooth connection limit

As mentioned in the [IceBT](../icebt) discussion, a Bluetooth client process cannot establish multiple connections to
the same target endpoint. When using IceBridge with a Bluetooth target, only one client at a time can use the bridge.
Furthermore, that client must only establish one connection to the bridge. You can start additional IceBridge instances
to allow more clients to communicate with the Bluetooth device simultaneously.

### Session support

For connection-oriented transports, IceBridge maintains a one-to-one relationship between incoming client connections
and outgoing target connections. Applications can associate their own session state with these connections. IceBridge
provides no session authentication or authorization. If your application requires these features, use
[Glacier2](../glacier2).
