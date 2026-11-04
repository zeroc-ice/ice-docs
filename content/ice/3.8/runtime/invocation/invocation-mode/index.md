---
title: Invocation Mode
pages:
  - oneway-invocations
  - datagram-invocations
  - batched-invocations
  - batched-invocation-interceptors
---

The invocation mode of a proxy determines how an invocation on this proxy sends its request, and whether it waits for a
reply:

| Invocation mode        | Description                                                               |
| ---------------------- | ------------------------------------------------------------------------- |
| twoway _(the default)_ | Sends the request and waits for the reply.                                |
| oneway                 | Sends the request; there is no reply.                                     |
| datagram               | Sends the request over UDP; there is no reply.                            |
| batch oneway           | Queues the request, and Ice sends the queued requests together; no reply. |
| batch datagram         | Like batch oneway, over UDP.                                              |

A proxy factory method, such as `ice_oneway` or `ice_batchOneway`, returns a proxy with the given invocation mode, and a
stringified proxy sets it with an [option](../syntax-for-stringified-proxies).

The oneway, datagram, batch oneway and batch datagram modes apply only to operations that have a `void` return type, no
out-parameters and no exception specification.

## Invocation Modes and Endpoints

When it sends a request, Ice uses only the proxy's endpoints that suit the proxy's invocation mode: `udp` endpoints for
the datagram and batch datagram modes, and the endpoints of the other transports, such as `tcp` and `ssl`, for the
twoway, oneway and batch oneway modes. An invocation on a proxy with no such endpoint fails.

## See Also

- [Proxy Endpoints](../proxy-endpoints)
- [Connection Establishment](../../connection-management/connection-establishment)
