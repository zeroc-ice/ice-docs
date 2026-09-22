---
id: icebridge-properties
title: IceBridge.*
---

[IceBridge](../icebridge) is an Ice service that acts as a bridge between one or more clients and a server.

# IceBridge.InstanceName

#### Synopsis

`IceBridge.InstanceName=name`

#### Description

Specifies a default identity category for IceBridge objects. If defined, the identity of the IceBridge router interface
becomes `name/router`.

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

This property specifies the [endpoints](../endpoint-syntax) of the target server. For each new connection that a client
establishes to an endpoint in `IceBridge.Source.Endpoints`, IceBridge will create a matching outgoing connection to a
target endpoint.
