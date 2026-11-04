---
title: Invocation
pages:
  - creating-proxies
  - syntax-for-stringified-proxies
  - converting-proxies-to-strings
  - proxy-endpoints
  - invocation-mode
  - proxies-to-replicated-objects
  - proxy-based-load-balancing
  - request-contexts
  - invocation-timeouts
  - automatic-retries
  - concurrent-proxy-invocations
  - dynamic-invocation
  - routers
---

An _invocation_ is a call to an operation on an Ice object through a _proxy_.

A proxy is a local object that represents an Ice object, and encapsulates the following information:

- the [identity](../object-identity) of the target object, plus an optional [facet](../facets)
- the information the Ice runtime needs to reach the target object, such as its [endpoints](./proxy-endpoints) or an
  adapter ID
- invocation options and connection selection options

A proxy is associated with a [communicator](../communicator), which manages the connections that invocations on this
proxy use.

## See Also

- [Terminology](../../basics/terminology)
- [Object Identity](../object-identity)
- [Connection Establishment](../connection-management/connection-establishment)
