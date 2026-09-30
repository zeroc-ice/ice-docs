---
title: How Glacier2 Uses Request Contexts
---

The Glacier2 router examines the [context](../request-contexts) of an incoming request for special keys that affect how
the router forwards the request. These contexts have the same semantics regardless of whether the request is sent from
client to server or from server to client.

## The `_fwd` Context

The `_fwd` context determines the proxy mode that the router uses when forwarding the request. The value associated with
the `_fwd` key must be a string containing one or more of the characters shown in the following table:

| **Value** | **Mode** |
| --------- | -------- |
| d or D    | Datagram |
| o or O    | Oneway   |
| t         | Twoway   |
| z         | Compress |

_Legal values for the `_fwd` context key_.

These characters match the corresponding [stringified proxy options](../syntax-for-stringified-proxies), except the
Glacier2 router does not support batched invocations.

If the `_fwd` key is not present in a request context, the mode used by the router to forward that request depends on
the request ID:

- If the sender sent the request as twoway (request ID > 0), the router also uses twoway mode.
- If the sender sent the request as a oneway or batch oneway (request ID == 0), the router forwards the request as a
  oneway request.

## Context Forwarding

The configuration properties [Glacier2.Client.ForwardContext](../glacier2-properties) and
[Glacier2.Server.ForwardContext](../glacier2-properties) determine whether the router includes the context when
forwarding a request. The former property affects requests from clients to servers, while the latter affects requests
from servers to clients. If a property is not defined or has the value zero, the router does not include the context
when forwarding requests.

When [Glacier2.AddConnectionContext](../glacier2-properties) is 1, the router includes connection information when
forwarding requests from clients to servers, even if `Glacier2.Client.ForwardContext` is 0.

## See Also

- [Request Contexts](../request-contexts)
- [Invocation Mode](../invocation-mode)
- [Syntax for Stringified Proxies](../syntax-for-stringified-proxies)
- [Glacier2.*](../glacier2-properties)
