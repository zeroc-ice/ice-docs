---
title: Ice Services
pages:
  - datastorm
  - glacier2
  - icebridge
  - icebox
  - icegrid
  - icestorm
---

Ice includes services for tasks that applications commonly need beyond remote invocation, such as reaching servers
behind a firewall, starting servers on demand, and distributing events. Glacier2, IceBridge, IceGrid, and IceStorm are
Ice servers that your application uses as a client. IceBox is a server that hosts your own services, and DataStorm is a
library that your applications link with.

| Service                  | Purpose                                                                                                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [DataStorm](./datastorm) | Exchange data between applications without a central broker, with a C++ publish/subscribe library.                                                                             |
| [Glacier2](./glacier2)   | Let clients reach servers behind a firewall: a router forwards client requests to these servers, and server callbacks to clients over their existing connections.              |
| [IceBox](./icebox)       | Deploy several services in a single server process: IceBox loads services written in C++, C#, or Java, configures them with properties, and lets you administer them remotely. |
| [IceBridge](./icebridge) | Forward requests from clients to a server that they cannot reach directly.                                                                                                     |
| [IceGrid](./icegrid)     | Locate, start, and replicate servers: resolve indirect proxies, start servers on demand, balance load across replicas, and deploy applications to many computers.              |
| [IceStorm](./icestorm)   | Distribute events to many subscribers: forward each event published on a topic to every subscriber of that topic.                                                              |
