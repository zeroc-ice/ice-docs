---
title: Invocation Mode
pages:
  - oneway-invocations
  - datagram-invocations
  - batched-invocations
  - batched-invocation-interceptors
---

Each proxy has an invocation mode that configures its invocation behavior. You can choose between the following
invocation modes:

| **Invocation mode**    | **Stringified proxy option** | **Meaning**                                                                                         |
| ---------------------- | ---------------------------- | --------------------------------------------------------------------------------------------------- |
| twoway _(the default)_ | `-t`                         | The invocation sends a request and receives a reply.                                                |
| oneway                 | `-o`                         | The invocation sends a request and receives no reply.                                               |
| batch oneway           | `-O`                         | The invocation queues the request, and Ice sends the queued requests in a batch; there is no reply. |
| datagram               | `-d`                         | Like oneway, for proxies with UDP endpoints.                                                        |
| batch datagram         | `-D`                         | Like batch oneway, for proxies with UDP endpoints.                                                  |

For example, if you create a proxy from the stringified proxy `greeter:tcp -h localhost -p 4061`, you’ll get a two-way
proxy, just like if you created this proxy from `greeter -t:tcp -h localhost -p 4061`. And if you create a proxy from
`greeter -O:tcp -h localhost -p 4061`, you’ll get a batch one-way proxy.

You can also set the invocation mode on a proxy programmatically using a proxy factory method: `ice_twoway`,
`ice_oneway`, `ice_batchOneway`, etc.

{% callout type="note" %}

Keep in mind that proxies are immutable and all proxy factory methods create new proxies - they don’t change the source
proxy.

{% /callout %}

## Invocation Modes and Endpoints

When it sends a request, Ice uses only the proxy's endpoints that suit the proxy's invocation mode: `udp` endpoints for
the datagram and batch datagram modes, and the endpoints of the other transports, such as `tcp` and `ssl`, for the
twoway, oneway and batch oneway modes. An invocation on a proxy with no such endpoint fails.

## See Also

- [Proxy Endpoints](../proxy-endpoints)
- [Connection Establishment](../../connection-management/connection-establishment)
