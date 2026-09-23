---
title: The Ice Runtime
pages:
  - communicator
  - invocation
  - dispatch
  - collocated-invocation-and-dispatch
  - object-identity
  - facets
  - properties-and-configuration
  - local-and-dispatch-exceptions
  - connection-management
  - locators
  - the-ice-threading-model
  - transports
  - the-ssl-transport
  - endpoint-syntax
---

The very core of the Ice framework is the Ice runtime library. It’s the runtime that creates and caches network
connections, sends requests over these connections, reads these requests off the network and sends the corresponding
responses, and offers you various features to tailor this process for your needs.

We present in this chapter the components that form the Ice runtime.
