---
title: IceBridge.*
---

[IceBridge](../../services/icebridge) is an Ice service that forwards requests from one or more clients to a target
server.

## IceBridge.InstanceName

### Synopsis {% id="icebridge.instancename-synopsis" %}

`IceBridge.InstanceName=name`

### Description {% id="icebridge.instancename-description" %}

Specifies the identity category of the IceBridge router object. The router's identity is `name/router`. The
`Ice::RouterFinder` object retains the identity `Ice/RouterFinder`.

If not defined, the default value is `IceBridge`.

## IceBridge.Source._AdapterProperty_

### Synopsis {% id="icebridge.source.adapterproperty-synopsis" %}

`IceBridge.Source.AdapterProperty=value`

### Description {% id="icebridge.source.adapterproperty-description" %}

IceBridge uses the adapter name `IceBridge.Source` for the object adapter that it provides to clients. Therefore,
[adapter properties](../object-adapter-properties) can be used to configure this adapter. The only required adapter
property is `IceBridge.Source.Endpoints`.

This adapter must be accessible to IceBridge clients.

## IceBridge.Target.Endpoints

### Synopsis {% id="icebridge.target.endpoints-synopsis" %}

`IceBridge.Target.Endpoints=endpoints`

### Description {% id="icebridge.target.endpoints-description" %}

This required property specifies the client [endpoints](../../runtime/endpoint-syntax) of the target server, with the
syntax used in a [stringified proxy](../../runtime/invocation/syntax-for-stringified-proxies). Unlike
`IceBridge.Source`, `IceBridge.Target` is not an object adapter. IceBridge creates a dedicated outgoing connection when
it receives the first request to forward on a client connection. The bridge uses the same outgoing connection for
subsequent requests on that client connection. Closing either connection causes the bridge to close the other.

Multiple endpoints must all reach the same logical target server, for example its replicas or its other transports.
