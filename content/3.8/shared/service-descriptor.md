---
id: service-descriptor
title: Service Descriptor
---

A service represents an IceBox service deployed on an IceBox server. IceGrid supports two kinds of services:

- **Plain Service**
  A service defined directly with a service descriptor
- **Service Instance**
  A service defined using a service template

# Load Order

The load-order of services within an IceBox server is determined by their display order in IceGrid GUI. You can reorder services using `Edit > Move Up` or `Edit > Move Down` (also available from each service's contextual menu).

# Plain Service

## Properties

The Service Properties panel offers the following fields:

- **Service Name**
  The name of the service. Must be unique within the enclosing IceBox server.
- **Description**
  A free-text description of this service.
- **Property Sets**
  List of property-set IDs; you refer to a [property set](../property-set-descriptor) to "include" all its properties in the service.
- **Properties**
  Ice properties private to this service.
- **Log Files**
  This table can be used to declare a number of log files used by this service. Path is the path to the log file (a relative path is relative to the IceGrid node working directory); when Property is set, IceGrid generates a property with this name and the log file path as value.
  You declare log files to be able to conveniently retrieve them using IceGrid GUI (in the [Live Deployment](../live-deployment-tab) pane) or with the [icegridadmin](../icegridadmin-command-line-tool) command-line utility.
- **Entry Point**
  The service's [entry point](../configuring-icebox-services), for example `IceStormService,35:createIceStorm`.
  IceGrid will append `--Ice.Config=path-to-service-config-file` to this entry point when it generates the [IceBox.Service.*name*](../icebox-properties) property in the enclosing IceBox server config file.

## Children

A plain service can have [Adapter](../adapter-descriptor) children.

# Service Instance

## Properties

The Service Instance Properties panel offers the following fields:

- **Template**
  The name of the [Service Template](../service-template-descriptor).
- **Parameters**
  Use this table to give values to the template parameters defined in the service template.
- **Property Sets**
  List of property-set IDs; you refer to a [property set](../property-set-descriptor) to "include" all its properties in the service.
- **Properties**
  Ice properties private to this service.
