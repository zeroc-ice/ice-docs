---
title: Property Reference
pages:
  - object-adapter-properties
  - proxy-properties
  - datastorm-node-properties
  - datastorm-topic-properties
  - datastorm-trace-properties
  - glacier2-properties
  - ice-properties
  - ice-admin-properties
  - ice-connection-properties
  - ice-default-properties
  - ice-override-properties
  - ice-plugin-properties
  - ice-tcp-properties
  - ice-threadpool-properties
  - ice-trace-properties
  - ice-udp-properties
  - ice-warn-properties
  - ice-ws-properties
  - icebox-properties
  - iceboxadmin-properties
  - icebridge-properties
  - icebt-properties
  - icediscovery-properties
  - icegrid-properties
  - icegridadmin-properties
  - icelocatordiscovery-properties
  - icemx-metrics-properties
  - icessl-properties
  - icestorm-properties
  - icestormadmin-properties
---

This section provides a reference for all properties used by the Ice runtime and its services.

Unless the description of a property says otherwise, its default value is the empty string. For a numeric property, that
means 0. The `getIceProperty` methods return a property's built-in default when the property is not set, while the plain
`getProperty` methods return the empty string, 0, or an empty list; see [the Properties class](../properties-class).

Note that Ice reads properties that control the runtime and its services only once on start-up, when you create a
communicator. This means that you must set Ice-related properties to their correct values before you create a
communicator. If you change the value of an Ice-related property after that point, it is likely that the new setting
will simply be ignored.
