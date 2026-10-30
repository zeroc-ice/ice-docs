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

This chapter introduces the main components and features of the Ice runtime.

| Page                                                             | What it covers                                                                                                                                 | Availability                                    |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- |
| [Communicator](./communicator)                                   | Create and destroy a communicator.                                                                                                             | All mappings.                                   |
| [Invocation](./invocation)                                       | Call operations through proxies: create and configure proxies, choose an invocation mode, and control timeouts, retries, and request contexts. | All mappings.                                   |
| [Dispatch](./dispatch)                                           | Accept requests: create and activate object adapters, route requests to servants, and intercept dispatches with middleware.                    | C++, C#, Java, JavaScript, Python, and Swift.   |
| [Collocation](./collocated-invocation-and-dispatch)              | Skip the transport for invocations on a servant in an object adapter of the same communicator.                                                 | C++, C#, Java, Python, and Swift.               |
| [Object Identity](./object-identity)                             | Identify an Ice object by name and category, convert identities to and from strings, and compare proxies by identity.                          | All mappings.                                   |
| [Facets](./facets)                                               | Expose several sub-objects, each with its own interface, under a single identity.                                                              | All mappings.                                   |
| [Configuration](./properties-and-configuration)                  | Configure the runtime and your application with properties, set in configuration files, on the command line, or through the API.               | All mappings.                                   |
| [Local and Dispatch Exceptions](./local-and-dispatch-exceptions) | Handle the errors that the runtime detects locally and the errors that a server reports, such as a missing servant.                            | All mappings.                                   |
| [Streams](./input-and-output-streams)                            | Marshal and unmarshal Slice values yourself, for example to store them in a file or a database.                                                | C++, C#, Java, JavaScript, MATLAB, and Swift.   |
| [Connection Management](./connection-management)                 | Control when connections open and close, and use bidirectional connections for callbacks through a firewall.                                   | All mappings.                                   |
| [Locators](./locators)                                           | Resolve indirect proxies and register object adapter endpoints with a location service, such as IceGrid or IceDiscovery.                       | All mappings.                                   |
| [Threading](./threading-model)                                   | Configure the thread pools that dispatch requests and process replies, and avoid deadlocks with nested invocations.                            | All mappings except JavaScript.                 |
| [Transports](./transports)                                       | Choose the transports for your endpoints, and get endpoint and connection information.                                                         | All mappings; JavaScript supports a subset.     |
| [SSL Transport](./ssl-transport)                                 | Secure connections with TLS: configure certificates, trusted certificate authorities, and certificate validation.                              | All mappings except JavaScript, which uses WSS. |
| [Compression](./compression)                                     | Compress requests and replies with bzip2 to save bandwidth on slow links.                                                                      | All mappings except JavaScript.                 |
| [Endpoint Syntax](./endpoint-syntax)                             | Look up the syntax of the endpoints in proxies and object adapter configuration.                                                               | All mappings.                                   |
