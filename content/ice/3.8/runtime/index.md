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

The Ice runtime handles communication between Ice clients and servers. It manages network connections, sends requests,
receives responses, and dispatches incoming requests to servants. You can configure its behavior through its API and
[Ice properties](./properties-and-configuration).

An application starts by creating a [communicator](./communicator), the entry point into the Ice runtime. A client makes
[invocations](./invocation) through [proxies](./invocation/creating-proxies). The communicator establishes the
[connections](./connection-management) these invocations need, over the [transports](./transports) named in the
endpoints of the proxies. A server creates object adapters and adds servants to them. Each incoming request names an Ice
object by its [identity](./object-identity) and one of its [facets](./facets), and the runtime [dispatches](./dispatch)
the request to the servant that implements this facet.
