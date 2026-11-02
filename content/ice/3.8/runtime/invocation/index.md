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

The process of sending a request and receiving the corresponding response is called an invocation.

With Ice, you need a _proxy_ to make an invocation - proxies provide the only invocation API.

A proxy is a local object that represents an Ice object, and encapsulates the following information:

- the [identity](../object-identity) of the target object, plus an optional [facet](../facets)
- the addressing information of the target object: one or more [endpoints](./proxy-endpoints) for a direct proxy; no
  endpoint and an optional adapter ID for an indirect proxy, which Ice resolves when you make an invocation
- various invocation options and connection selection options

A proxy is also tied to a [communicator](../communicator) that provides the connection establishment and management
logic.

## See Also

- [Terminology](../../basics/terminology)
- [Object Identity](../object-identity)
- [Connection Establishment](../connection-management/connection-establishment)
