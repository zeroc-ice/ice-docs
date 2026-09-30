---
title: IceBridge.*
---

[IceBridge](../icebridge) is an Ice service that forwards requests from one or more clients to a target server.

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

This required property specifies the client [endpoints](../endpoint-syntax) of the target server, with the syntax used
in a [stringified proxy](../syntax-for-stringified-proxies). Unlike `IceBridge.Source`, `IceBridge.Target` is not an
object adapter. For connection-oriented transports, IceBridge creates a dedicated outgoing connection when it receives
the first request to forward on a client connection. The bridge uses the same outgoing connection for subsequent
requests on that client connection. Closing either connection causes the bridge to close the other.

Multiple endpoints must all reach the same logical target server, for example its replicas or its other transports. A
UDP source endpoint requires a UDP target endpoint; a connection-oriented source endpoint requires a connection-oriented
target endpoint.
