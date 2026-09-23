---
title: How Glacier2 Works
---

The Ice core supports a generic router facility, represented by the `Ice::Router` interface, that allows a third-party
service to "intercept" requests on a properly-configured proxy and deliver them to the intended server. Glacier2 is an
implementation of this service, although other implementations are certainly possible.

Glacier2 normally runs on a host in the private network behind a
[port-forwarding firewall](../configuring-glacier2-behind-an-external-firewall), but it can also operate on a host with
access to both public and private networks. In this configuration it follows that Glacier2 must have endpoints on each
network.

![A public client at 1.2.3.4 connects to Glacier2 client endpoints at 5.6.7.8. Glacier2 sends requests to the private server at 10.0.0.2. The server sends callbacks to Glacier2 server endpoints at 10.0.0.1.](/attachments/3.8/how-glacier2-works/client-and-server-endpoints.svg)

{% callout type="info" %}

For the sake of example, the router's public address is 5.6.7.8 and its private address is 10.0.0.1.

{% /callout %}

In the client, proxies must be configured to use Glacier2 as a router. This configuration can be done statically for all
proxies created by a communicator, or programmatically for a particular proxy. A proxy configured to use a router is
called a _routed proxy_.

When a client invokes an operation on a routed proxy, the client connects to one of Glacier2's client endpoints and
sends the request as if Glacier2 is the server. Glacier2 then establishes an outgoing connection to the client's
intended server in the private network, forwards the request to that server, and returns the reply (if any) to the
client. Glacier2 is essentially acting as a local client on behalf of the remote client.

If a server returns a proxy as the result of an operation, that proxy contains the server's endpoints in the private
network, as usual. (Remember, the server is unaware of Glacier2's presence, and therefore assumes that the proxy is
usable by the client that requested it.) In the absence of a router, a client would receive an exception if it attempted
to use such a proxy. When configured with a router, however, the client ignores the proxy's endpoints and always sends
requests to the router's client endpoints instead.

Glacier2's server endpoints, which reside in the private network, are only used when a server makes a
[callback to a client](../callbacks-through-glacier2).

##### See Also

- [Callbacks through Glacier2](../callbacks-through-glacier2)
- [Configuring Glacier2 behind an External Firewall](../configuring-glacier2-behind-an-external-firewall)
