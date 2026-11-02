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

An invocation is a call to an operation of an Ice object through a _proxy_. A twoway invocation sends a request and
receives the corresponding response; an invocation in any other [invocation mode](./invocation-mode) (oneway, batch
oneway, datagram or batch datagram) receives no response.

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
