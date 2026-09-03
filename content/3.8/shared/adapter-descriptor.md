---
id: adapter-descriptor
title: Adapter Descriptor
---

Each indirect object adapter registered with IceGrid requires its own Adapter descriptor. If you need to specify a direct adapter, simply create a number of Ice properties in your server.

# Properties

The Adapter Properties panel offers the following fields:

- **Adapter Name**
  The name of the object adapter. This name must be unique within the enclosing Ice communicator, and is only used to lookup adapter properties.
- **Description**
  A free-text description of this object adapter.
- **Adapter ID**
  The ID of the object adapter. This ID must be unique within an IceGrid deployment. Default value: ${server}.*adapter-name*.
- **Replica Group**
  The ID of this adapter's [Replica Group](../replica-group-descriptor). By default, an adapter does not belong to any replica group.
- **Priority**
  The adapter priority in its [Replica Group](../replica-group-descriptor). The default priority is 0.
- **Endpoints**
  The configured endpoints for this object adapter. Corresponds to the [*adapter-name*.Endpoints](../object-adapter-properties) property. Default: default, which means listen using the default protocol (tcp by default) on an OS assigned port, on all interfaces.
- **Published Endpoints**
  The configured published endpoints for this object adapter. Corresponds to the [*adapter-name*.PublishedEndpoints](../object-adapter-properties) property. Default: actual endpoints (computed at run time), derived by Ice from the Endpoints field above.
- **Proxy** **Options**
  The default Proxy Options for well-known objects defined within this object adapter, and the Proxy Options for proxies created by this object adapter. Corresponds to the [*adapter-name*.ProxyEndpoints](../object-adapter-properties) property. Default: empty string.
- **Server Lifetime**
  When checked, IceGrid expects this adapter to register its endpoints during server startup and unregister them during server shutdown. See also Activation Timeout in [Server Properties](../server-descriptor). Default: true (checked).
- **Well-known Objects**
  A table of well-known objects defined by this adapter. When Property is set, IceGrid generates a property with this name and with Identity as value.
- **Allocatable Objects**
  A table of allocatable objects defined by this adapter. When Property is set, IceGrid generates a property with this name and with Identity as value.
