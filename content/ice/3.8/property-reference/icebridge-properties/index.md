---
title: IceBridge.*
---

[IceBridge](../icebridge) is an Ice service that acts as a bridge between one or more clients and a server.

## IceBridge.InstanceName

### Synopsis {% id="icebridge.instancename-synopsis" %}

`IceBridge.InstanceName=name`

### Description {% id="icebridge.instancename-description" %}

Specifies a default identity category for IceBridge objects. If defined, the identity of the IceBridge router interface
becomes `name/router`.

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

This property specifies the [endpoints](../endpoint-syntax) of the target server. For each new connection that a client
establishes to an endpoint in `IceBridge.Source.Endpoints`, IceBridge will create a matching outgoing connection to a
target endpoint.
