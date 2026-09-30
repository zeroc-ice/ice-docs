---
title: IceBridge
---

IceBridge is an Ice service that forwards requests from one or more clients to a target server, like a very basic
reverse proxy. Use it when a client cannot connect directly to the server, for example because the client and the server
are on networks with no route between them, or because the client does not support the server's transport. IceBridge is
implemented in C++ and can forward requests from clients using any Ice language mapping.

## IceBridge Overview

IceBridge listens for client requests on its _source endpoints_ and forwards them to its configured _target endpoints_.
The bridge forwards the object identity, operation, context, and encoded parameters, so it does not need your
application's Slice definitions. Replies, including user exceptions, travel back through the bridge to the client.

IceBridge pairs each client connection with a dedicated connection to the target server. It opens the target connection
when it receives the first request to forward on the client connection, and closes either connection when the other
closes. This pairing lets applications that associate session state with a connection work through the bridge.

UDP is the exception: IceBridge forwards the datagrams it receives on a UDP source endpoint to a UDP target endpoint,
without per-client pairing.

For connection-oriented transports, IceBridge also provides:

- **Bidirectional requests** IceBridge configures every connection to the server to support
  [bidirectional requests](../bidirectional-connections). All bidirectional callback requests sent from the server are
  automatically forwarded back to the client via the client's connection with the bridge.
- **Router support** IceBridge implements the `Ice::Router` interface, allowing clients to use the bridge without
  replacing the endpoints in each application proxy. For session authentication and access control, use
  [Glacier2](../glacier2).

See [IceBridge Limitations](#icebridge-limitations) for restrictions on target servers, forwarding direction, facets,
and Bluetooth.

## Configuring IceBridge

Configure the bridge with the following [IceBridge properties](../icebridge-properties):

- `IceBridge.Source.Endpoints` This required property lists the endpoints on which IceBridge receives requests from
  clients. `IceBridge.Source` is also the name of an object adapter, which means all of the other
  [object adapter properties](../object-adapter-properties) can be configured as well.
- `IceBridge.Target.Endpoints` This required property lists the client endpoints of the target server, with the syntax
  used in a [stringified proxy](../syntax-for-stringified-proxies). Unlike `IceBridge.Source`, `IceBridge.Target` is not
  an object adapter. With several endpoints, IceBridge follows the usual Ice process for
  [establishing a connection](../connection-establishment) to the server, and then keeps that connection for the
  lifetime of the client's connection to the bridge.
- `IceBridge.InstanceName` This optional property specifies the identity category of the
  [router object](#icebridge-object-identities). Its default value is `IceBridge`.

Here's a simple example:

```config
IceBridge.Source.Endpoints=tcp -p 10000
IceBridge.Target.Endpoints=tcp -h target.host -p 21112
```

The bridge listens on TCP port 10000 for connections from clients and forwards requests to the target server on TCP
port 21112.

### Matching Transports

Source and target endpoints can use different connection-oriented transports, such as TCP and SSL, or TCP and Bluetooth.
For requests received on a UDP source endpoint, the target must provide a UDP endpoint. Likewise, requests arriving over
a connection-oriented transport require a connection-oriented target endpoint.

For example, the following configuration cannot forward requests:

```config
IceBridge.Source.Endpoints=udp -p 10000
IceBridge.Target.Endpoints=tcp -h target.host -p 21112
```

The bridge receives datagram requests on its source endpoint, but the target configuration provides only a TCP endpoint.
Forwarding fails when a request arrives.

### TLS

IceBridge terminates TLS: a secure client connection and a secure target connection are two independent TLS connections.
IceBridge chooses the target endpoint without regard to whether the client connection is secure. To encrypt the
connection to the target, configure only secure target endpoints.

IceBridge presents the credentials configured with its [IceSSL properties](../icessl-properties) on both connections:
when accepting secure client connections and when establishing secure connections to the target server. A target server
that requires a client certificate authenticates the bridge's certificate.

### Bridging to Bluetooth

On Linux, load the [IceBT transport plug-in](../icebt) to bridge between TCP and Bluetooth:

```config
Ice.Plugin.IceBT=IceBT:createIceBT
IceBridge.Source.Endpoints=tcp -p 10000
IceBridge.Target.Endpoints=bt -a "01:23:45:67:89:AB" -u "6a193943-1754-4869-8d0a-ddc5f9a2b294"
```

With this configuration, a client can connect to the bridge using TCP, and the bridge will establish a Bluetooth
connection to the device with the given address offering the service identified by the given UUID.

## IceBridge Object Identities

The bridge's source adapter hosts two objects with reserved identities:

| Identity              | Interface           | Purpose                                                  |
| --------------------- | ------------------- | -------------------------------------------------------- |
| `InstanceName/router` | `Ice::Router`       | Configures clients to route requests through the bridge. |
| `Ice/RouterFinder`    | `Ice::RouterFinder` | Returns the bridge's router proxy from `getRouter`.      |

`InstanceName` is the value of [IceBridge.InstanceName](../icebridge-properties#icebridge.instancename), `IceBridge` by
default. Clients can configure a router proxy using this identity together with the bridge's source endpoints. IceBridge
dispatches requests for these two identities itself and does not forward them to the target. For example, with:

```config
IceBridge.InstanceName=PublicBridge
```

the router's identity is `PublicBridge/router`, and the client's configuration must use it:

```config
Ice.Default.Router=PublicBridge/router:tcp -h bridge.host -p 10000
```

## Using IceBridge

Clients can address the bridge's source endpoints directly or use IceBridge as their router. In both cases, the bridge
forwards requests the same way; the choice only affects how the client's proxies obtain the bridge's endpoints.

Addressing the bridge directly is the simplest: replace the endpoints in the client's proxies for the target server with
the bridge's source endpoints.

Use IceBridge as the client's default router when the target server returns proxies that the client then invokes on.
Those proxies carry the server's own endpoints, which the client cannot reach; Ice configures each of them with the
default router, so their requests go to the bridge instead. Unlike Glacier2, the bridge's router needs no session:
setting the router is all the client has to do.

Both configurations are shown below.

Let's assume the bridge has the following configuration:

```config {% title="Bridge Configuration" %}
IceBridge.Target.Endpoints=tcp -h target.host -p 21112
IceBridge.Source.Endpoints=tcp -p 10000
```

The client can use IceBridge as a router by defining `Ice.Default.Router`:

```config {% title="Client Configuration with Router" %}
Ice.Default.Router=IceBridge/router:tcp -h bridge.host -p 10000
Client.Proxy=SomeObject:tcp -h other.host -p 9999
```

When the client loads `Client.Proxy` with `propertyToProxy`, invocations on this proxy go through the router to
`target.host` on port 21112. The bridge forwards requests for the identity `SomeObject`, which the target server must
provide.

{% callout type="info" %}

Setting `Ice.Default.Router` affects **all** proxies by default. Ice also provides more selective ways of configuring a
router, such as with a [proxy property](../proxy-properties) or a [proxy method](../routers).

{% /callout %}

To address the bridge directly, the client's proxies use the bridge's source endpoints:

```config {% title="Client Configuration without Router" %}
Client.Proxy=SomeObject:tcp -h bridge.host -p 10000
```

### Receiving Callbacks

The client must create an object adapter and register its callback objects. It can associate this adapter with the
bridge connection in either of these ways:

- When using the bridge as a router, configure the callback adapter with the same router proxy, using the
  [object adapter's `Router` property](../object-adapter-properties) or `createObjectAdapterWithRouter`.
- When connecting directly to the bridge's source endpoints, make the callback adapter the communicator's default object
  adapter with `setDefaultObjectAdapter`, as described in [Bidirectional Connections](../bidirectional-connections).

For example, a client that creates a callback adapter named `Callbacks` can use:

```config
Ice.Default.Router=IceBridge/router:tcp -h bridge.host -p 10000
Callbacks.Router=IceBridge/router:tcp -h bridge.host -p 10000
```

The target server sends callbacks using a fixed proxy bound to the connection on which it received the client's request.
It can create this proxy with the connection's `createProxy` method or bind a callback proxy with `ice_fixed`. IceBridge
forwards the callback over the paired client connection. See
[Configuring a Server for Bidirectional Connections](../bidirectional-connections#configuring-a-server-for-bidirectional-connections).

## Starting IceBridge

A minimal configuration file, `config`, contains the two required properties:

```config
IceBridge.Source.Endpoints=tcp -p 10000
IceBridge.Target.Endpoints=tcp -h target.host -p 21112
```

Start the service with:

```shell
icebridge --Ice.Config=config
```

IceBridge establishes target connections on demand, so successful startup does not verify that the target server is
reachable. To check forwarding, invoke an operation such as `ice_ping` on an application object through the bridge.

IceBridge supports the usual [command-line options](../command-line-options), including those for running it as a
Windows service or Unix daemon.

### Connection Failures

If IceBridge cannot establish a target connection, it fails the requests waiting for that connection and closes the
client connection.

When a client reconnects, the bridge pairs the new client connection with a new target connection, so an application
that associates session state or callback proxies with a connection must reestablish them for the new connection.

## IceBridge Limitations

### Single Target Server

A single IceBridge instance can support multiple clients simultaneously, but it forwards all of them to the same logical
target server. Listing several target endpoints lets the bridge choose among endpoints of that server, such as its
replicas or its other transports; it does not bridge to different servers. For connection-oriented transports, the
bridge makes this choice when it opens the target connection, so a client stays with the same endpoint for the lifetime
of its bridged connection. A proxy returned by the server can use the bridge only if its object is reachable through
these target endpoints.

If your clients need to bridge to multiple servers, you must start a separate IceBridge instance for each target server.

### One Direction per Bridge

IceBridge forwards connections in one direction: from the clients that connect to its source endpoints to the target
server. Callbacks over a bidirectional connection travel back over the same pair of connections and need nothing more.
If the server also opens its own connections to the client, for example because the client is itself a server with
endpoints, those connections need a second IceBridge instance configured in the opposite direction.

### Facets

IceBridge forwards requests to the default facet of the target object. A request addressed to a named facet loses its
facet name when the bridge forwards it. This also applies to callbacks. Applications that use IceBridge must expose the
required operations on the default facet.

### Bluetooth Connection Limit

As mentioned in the [IceBT](../icebt) discussion, a Bluetooth client process cannot establish multiple connections to
the same target endpoint. When using IceBridge with a Bluetooth target, only one client at a time can use the bridge.
Furthermore, that client must only establish one connection to the bridge. You can start additional IceBridge instances
to allow more clients to communicate with the Bluetooth device simultaneously.
