---
title: Application Descriptor
---

## Creating a New Application

You can create a new application using `File > New Application`: this opens a new Application tab, with an empty
application definition.

When you are connected to an IceGrid registry, you can also use
`File > New Application with Default Templates from Registry`. This also opens new Application tab with a brand new
application definition. This new application contains a copy of all the templates definitions contained in the IceGrid
registry default template file. See [IceGrid.Registry.DefaultTemplates](property-reference/icegrid-properties).

## Properties

The Application Properties panel offers the following fields:

- **Name** The name of the application. This field is not editable for live applications.
- **Description** A free-text description of this application.
- **Variables** This table shows application-level
  [IceGrid variables](services/icegrid/icegrid-gui-tool/application-tabs/icegrid-descriptors/variables-in-icegrid-descriptors).

## Children

An application node can have five types of children:

- [Node](services/icegrid/icegrid-gui-tool/application-tabs/icegrid-descriptors/node-descriptor)
- [Property Set](services/icegrid/icegrid-gui-tool/application-tabs/icegrid-descriptors/property-set-descriptor)
- [Replica Group](services/icegrid/icegrid-gui-tool/application-tabs/icegrid-descriptors/replica-group-descriptor)
- [Server Template](services/icegrid/icegrid-gui-tool/application-tabs/icegrid-descriptors/server-template-descriptor)
- [Service Template](services/icegrid/icegrid-gui-tool/application-tabs/icegrid-descriptors/service-template-descriptor)
