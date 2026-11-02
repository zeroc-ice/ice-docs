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

- [Communicator](./communicator): create and destroy a communicator.
- [Invocation](./invocation): call operations through proxies. Create and configure proxies, choose an invocation mode,
  and control timeouts, retries, and request contexts.
- [Dispatch](./dispatch): accept requests. Create object adapters, add servants to them, and route each request to a
  servant.
- [Collocation](./collocated-invocation-and-dispatch): invoke a servant in an object adapter of the same communicator
  without going through a transport.
- [Object Identity](./object-identity): identify an Ice object by name and category, convert identities to and from
  strings, and compare proxies by identity.
- [Facets](./facets): view an Ice object as a collection of facets, each with its own interface, under a single
  identity.
- [Configuration](./properties-and-configuration): configure the runtime and your application with properties, set in
  configuration files, on the command line, or through the API.
- [Local and Dispatch Exceptions](./local-and-dispatch-exceptions): handle the errors that the runtime detects locally
  and the errors that a server reports, such as a missing servant.
- [Streams](./input-and-output-streams): marshal and unmarshal Slice values yourself, for example to store them in a
  file or a database.
- [Connection Management](./connection-management): control when the communicator establishes and closes connections.
- [Locators](./locators): resolve indirect proxies through a location service, such as IceGrid.
- [Threading](./threading-model): configure the thread pools of the Ice runtime.
- [Transports](./transports): choose the transports for your endpoints, and get endpoint and connection information.
- [SSL Transport](./ssl-transport): secure connections with TLS. Configure certificates, trusted certificate
  authorities, and certificate validation.
- [Compression](./compression): compress requests and replies with bzip2 to save bandwidth on slow links.
- [Endpoint Syntax](./endpoint-syntax): look up the syntax of endpoints.
