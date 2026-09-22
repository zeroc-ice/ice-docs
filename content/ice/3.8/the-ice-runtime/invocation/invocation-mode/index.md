---
id: invocation-mode
title: Invocation Mode
---

Each proxy has an invocation mode that configures its invocation behavior. You can choose between the following
invocation modes:

| **Invocation mode**    | **Stringified proxy option** | **Meaning**                                                                                                                                        |
| ---------------------- | ---------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| twoway _(the default)_ | `-t`                         | An invocation sends a request and expects/waits for a reply.                                                                                       |
| oneway                 | `-o`                         | An invocation sends a request but does not expect/wait for a reply.                                                                                |
| batch oneway           | `-O`                         | An invocation sends requests in batches. It does not expect or wait for any reply.                                                                 |
| datagram               | `-d`                         | An invocation sends a request but does not expect/wait for a reply.It’s just like oneway, but for proxies with UDP endpoints.                      |
| batch datagram         | `-D`                         | An invocation sends requests in batches. It does not expect or wait for any reply.It’s just like batch oneway, but for proxies with UDP endpoints. |

For example, if you create a proxy from the stringified proxy `greeter:tcp -h localhost -p 4061`, you’ll get a two-way
proxy, just like if you created this proxy from `greeter -t:tcp -h -localhost -p 4061`. And if you create a proxy from
`greeter -O:tcp - localhost -p 4061`, you’ll get a batch one-way proxy.

You can also set the invocation method on a proxy programmatically using a proxy factory method: `ice_twoway`,
`ice_oneway`, `ice_batchOneway`, etc.

{% callout type="info" %}

Keep in mind that proxies are immutable and all proxy factory methods create new proxies - they don’t change the source
proxy.

{% /callout %}

## Twoway, Oneway, Batch Oneway

These invocation modes are only applicable to proxies with non-UDP endpoints, such as `tcp`, `ssl`, `wss`.

If you select oneway or batch oneway for a proxy with a UDP endpoint, you won’t get an error - you’ll just made this
proxy unusable. If you later make an invocation with such a proxy, you’ll receive a `NoEndpointException`.

## Datagram and Batch Datagram

These invocation modes are only applicable to proxies with UDP endpoints.

If you select datagram or batch datagram for a proxy with a TCP endpoint, you won’t get an error - you’ll just made this
proxy unusable. If you later make an invocation with such a proxy, you’ll receive a `NoEndpointException`.

In theory, the datagram and batch datagram invocation modes are applicable to any datagram transport. In practice, Ice
provides a single datagram transport, UDP, and we don’t anticipate ever adding another datagram transport.

##### See Also

- [Proxy Endpoints](../proxy-endpoints)
- [Connection Establishment](../connection-establishment)
