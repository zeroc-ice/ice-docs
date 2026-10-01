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
means 0.

The default value listed in an entry is the value the Ice runtime uses when the property is not set. It is also what the
`getIceProperty` methods return for an unset property. The plain `getProperty` methods do not know about these defaults:
they return the empty string, 0, or an empty list for any unset property. See
[the Properties class](../properties-class).

Set properties before initializing the runtime component or service that uses them. For updates that take effect at run
time, see [the Properties facet](../properties-facet).
