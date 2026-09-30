---
title: Invocation
pages:
  - creating-proxies
  - syntax-for-stringified-proxies
  - proxy-defaults-and-overrides
  - converting-proxies-to-strings
  - proxy-endpoints
  - invocation-mode
  - proxy-based-load-balancing
  - request-contexts
  - invocation-timeouts
  - automatic-retries
  - concurrent-proxy-invocations
  - routers
---

The process of sending a request and receiving the corresponding response is called an invocation.

{% callout type="info" %}

Making invocations is the primary activity of client applications.

{% /callout %}

With Ice, you need a _proxy_ to make an invocation - proxies provide the only invocation API.

A proxy is a local object that represents a remote Ice object, and encapsulates the following information:

- the [identity](../object-identity) of the target object, plus an optional [facet](../facets)
- addressing information to reach this remote object, namely one or more [endpoints](../proxy-endpoints)
- various invocation options and connection selection options

A proxy is also tied to a [communicator](../communicator) that provides the connection establishment and management
logic.

## See Also

- [Terminology](../terminology)
- [Object Identity](../object-identity)
- [Connection Establishment](../connection-establishment)
