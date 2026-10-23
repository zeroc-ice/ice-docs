---
title: The Ice Runtime
sidebarLabel: Ice Runtime
pages:
  - communicator
  - invocation
  - dispatch
  - collocated-invocation-and-dispatch
  - object-identity
  - facets
  - properties-and-configuration
  - local-and-dispatch-exceptions
  - input-and-output-streams
  - connection-management
  - locators
  - threading-model
  - transports
  - ssl-transport
  - compression
  - endpoint-syntax
---

The Ice runtime is the core of the Ice framework. It manages network connections, sends requests, receives responses,
and dispatches incoming requests to servants. You can customize its behavior through its API and through
[Ice properties](./properties-and-configuration).

This chapter introduces the main components of the Ice runtime.
