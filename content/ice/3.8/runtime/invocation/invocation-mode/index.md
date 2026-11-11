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

| Invocation mode        | Stringified proxy option | Description                                                               |
| ---------------------- | ------------------------ | ------------------------------------------------------------------------- |
| twoway _(the default)_ | `-t`                     | Sends the request and waits for the reply.                                |
| oneway                 | `-o`                     | Sends the request; there is no reply.                                     |
| datagram               | `-d`                     | Sends the request over UDP; there is no reply.                            |
| batch oneway           | `-O`                     | Queues the request, and Ice sends the queued requests together; no reply. |
| batch datagram         | `-D`                     | Like batch oneway, over UDP.                                              |

Twoway is the default mode. A twoway invocation sends the request and completes when the reply arrives, and it is the
only mode that returns a result or a user exception to the caller: the oneway, datagram, batch oneway and batch datagram
modes apply only to operations that have a `void` return type, no out-parameters and no exception specification.

A proxy factory method, such as `ice_twoway` or `ice_oneway`, returns a proxy with the given invocation mode, and a
[stringified proxy](../syntax-for-stringified-proxies) sets it with the option shown above.

## Invocation Modes and Endpoints

The datagram and batch datagram modes require a proxy with `udp` endpoints, and the twoway, oneway and batch oneway
modes require a proxy with endpoints of another transport, such as `tcp` or `ssl`. An invocation whose mode does not
match the endpoints of its proxy fails.

## See Also

- [Proxy Endpoints](../proxy-endpoints)
- [Connection Establishment](../../connection-management/connection-establishment)
