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

Ice includes services for tasks that applications commonly need beyond RPC, such as reaching servers behind a firewall,
starting servers on demand, and distributing events. Glacier2, IceBridge, IceGrid, and IceStorm are Ice servers that
your application uses as a client. IceBox is a server that hosts your own services, and DataStorm is a library that your
applications link with.

| Service                  | Purpose                                                                                                                                                           | Availability                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [DataStorm](./datastorm) | Exchange data between applications: publishers write data to topics, and subscribers read it.                                                                     | C++.                                                                                 |
| [Glacier2](./glacier2)   | Let clients reach servers behind a firewall: the Glacier2 router forwards the clients' requests to these servers and the servers' callbacks to the clients.       | Clients in any language mapping.                                                     |
| [IceBox](./icebox)       | Deploy several services in a single server process: IceBox loads your services, configures them with properties, and lets you administer them remotely.           | Services implemented in C++, C#, or Java.                                            |
| [IceBridge](./icebridge) | Forward requests from clients to a server they cannot connect to directly, such as a server on another network or with a transport the client does not support.   | Clients in any language mapping.                                                     |
| [IceGrid](./icegrid)     | Locate, start, and replicate servers: resolve indirect proxies, start servers on demand, balance load across replicas, and deploy applications to many computers. | Clients in any language mapping.                                                     |
| [IceStorm](./icestorm)   | Distribute events to many subscribers: forward each event published on a topic to every subscriber of that topic.                                                 | Publishers in any language mapping; subscribers in C++, C#, Java, Python, and Swift. |
