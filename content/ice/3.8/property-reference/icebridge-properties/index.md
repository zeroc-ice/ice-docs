---
title: IceBridge.*
---

[IceBridge](../icebridge) is an Ice service that acts as a bridge between one or more clients and a server.

# IceBridge.InstanceName

#### Synopsis

`IceBridge.InstanceName=name`

#### Description

Specifies the identity category of the IceBridge router object. The router's identity is `name/router`. The
`Ice::RouterFinder` object retains the identity `Ice/RouterFinder`.

If not defined, the default value is `IceBridge`.

# IceBridge.Source._AdapterProperty_

#### Synopsis

`IceBridge.Source.AdapterProperty=value`

#### Description

IceBridge uses the adapter name `IceBridge.Source` for the object adapter that it provides to clients. Therefore,
[adapter properties](../object-adapter-properties) can be used to configure this adapter. The only required adapter
property is `IceBridge.Source.Endpoints`.

This adapter must be accessible to IceBridge clients.

# IceBridge.Target.Endpoints

#### Synopsis

`IceBridge.Target.Endpoints=endpoints`

#### Description

This required property specifies the [endpoints](../endpoint-syntax) of the target server. For connection-oriented
transports, IceBridge creates a dedicated outgoing connection when it receives the first request to forward on a client
connection. The bridge uses the same outgoing connection for subsequent requests on that client connection. Closing
either connection causes the bridge to close the other.

Multiple endpoints provide alternative ways to connect to the same logical target server. Datagram requests require a
datagram target endpoint; requests arriving over a connection-oriented transport require a connection-oriented target
endpoint. `IceBridge.Target` is not an object adapter.
