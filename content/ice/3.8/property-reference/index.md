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

The `getIceProperty` methods return the built-in default for an unset Ice property. The plain `getProperty` methods
return the empty string, 0, or an empty list for an unset property; these return values do not determine the runtime's
defaults. See [the Properties class](../properties-class).

Set properties before initializing the runtime component or service that uses them. Changing a property generally does
not reconfigure an initialized component. When both the Metrics and [Properties facets](../properties-facet) are
enabled, updating `IceMX.Metrics.*` through the Properties facet reconfigures the metrics views.
