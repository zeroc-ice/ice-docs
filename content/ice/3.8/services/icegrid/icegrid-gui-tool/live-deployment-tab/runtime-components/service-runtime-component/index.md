---
title: Service Runtime Component
---

A service represents an IceBox service loaded (or potentially loaded) within an IceBox server.

## States

A service can be either started ![service started](/images/ice/3.8/service-runtime-component/service-started.jpeg) or
stopped ![service stopped](/images/ice/3.8/service-runtime-component/service-stopped.jpeg) within an IceBox server.

## Actions

An IceBox service provides the following actions, from its contextual menu, from the `Tools > Service` menu, and from
buttons on the Service Properties panel:

- **Start** Instruct the IceBox server to start the service.
- **Stop** Instruct the IceBox server to stop this service.
- **Retrieve Ice log** Retrieve the log messages sent to the service's
  [logger](../../../../../../administration/logger-facility) into an [Ice Log Dialog](../../ice-log-dialog). The Ice Log
  Dialog attaches a [remote logger](../../../../../../administration/administrative-facility/logger-facet) to the
  service's logger.
- **Retrieve log file** Retrieve the log file of this service into a [Log File Dialog](../../log-file-dialog).

## Properties

The Service Properties panel shows first the Runtime Status of the service, i.e. "live" values retrieved directly from
the service:

- **State** A checkbox that is checked when the service is started.
- **Build Id** The build Id of this service: this corresponds to the Ice property
  [BuildId](../../../../icegrid-and-the-administrative-facility).
- **Properties** A table showing all the Ice properties currently set in this service. These properties are retrieved
  each time you select a new service in IceGrid GUI, and each time you click on the Refresh button next to the Build Id
  field.

The remaining Server Properties come from the IceGrid descriptors associated with this service:

- **Description** A free-text description of this service.
- **Properties** A table showing all the Ice properties of this service. These properties may come from template
  definitions, property sets, service-instance properties etc. They are all combined in this table.
- **Entry Point** The entry point for this service. This corresponds to the value of the
  [IceBox.Service._name_](../../../../../../property-reference/icebox-properties) property.

## Children

An IceBox service can have the following types of children:

- [Metrics View](../metrics-view-runtime-component)
- [Adapter](../adapter-runtime-component)
