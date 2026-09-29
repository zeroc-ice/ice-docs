---
title: Runtime Components
pages:
  - registry-runtime-component
  - slave-registry-runtime-component
  - node-runtime-component
  - server-runtime-component
  - adapter-runtime-component
  - service-runtime-component
  - metrics-view-runtime-component
---

IceGrid GUI shows the following runtime components:

- [Registry](../registry-runtime-component) ![registry](/attachments/3.8/runtime-components/registry.jpeg) Represents
  the IceGrid registry process with which IceGrid GUI communicates
- [Slave Registry](../slave-registry-runtime-component)
  ![slave registry](/attachments/3.8/runtime-components/slave-registry.jpeg)  
  Represents a slave registry process, when you have several replicated IceGrid registries
- [Node](../node-runtime-component) ![node](/attachments/3.8/runtime-components/node.jpeg)  
  Represents an IceGrid node process
- [Regular Server](../server-runtime-component)
  ![regular server](/attachments/3.8/runtime-components/regular-server.jpeg)  
  Represents a regular server process, started and monitored by an IceGrid node
- [IceBox Server](../server-runtime-component)
  ![icebox server](/attachments/3.8/runtime-components/icebox-server.jpeg)  
  Represents an IceBox server process, started and monitored by an IceGrid node
- [Adapter](../adapter-runtime-component) ![adapter](/attachments/3.8/runtime-components/adapter.jpeg)

  Represents an Ice indirect object adapter, deployed within a server or a service

- [IceBox Service](../service-runtime-component)
  ![icebox service](/attachments/3.8/runtime-components/icebox-service.jpeg)  
  Represents an IceBox service, deployed on an IceBox server
- [Metrics View](../metrics-view-runtime-component)
  ![metrics view](/attachments/3.8/runtime-components/metrics-view.jpeg)  
  Represents a Metrics view associated with an Ice server, an Ice service, an IceGrid node, the Registry or a Slave
  Registry

All actions on these components (through menus, buttons and keyboard short-cuts) affect directly and immediately the
running IceGrid deployment.
