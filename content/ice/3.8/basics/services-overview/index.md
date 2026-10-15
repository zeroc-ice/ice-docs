---
title: Ice Services Overview
---

The Ice core provides a sophisticated client-server platform for distributed application development. However, realistic
applications usually require more than just a remoting capability: typically, you also need a way to start servers on
demand, distribute proxies to clients, distribute asynchronous events, configure your application, and so on.

Ice ships with a number of services that provide these and other features. Glacier2, IceBridge, IceGrid, and IceStorm
are Ice servers that your application uses as a client. IceBox is a server that hosts your own services, and DataStorm
is a library that your applications link with.

## DataStorm

To exchange data between applications without a central broker, use [DataStorm](../../services/datastorm), a C++
publish/subscribe library.

## Glacier2

To let clients reach servers behind a firewall, use [Glacier2](../../services/glacier2), a router that forwards client
requests to these servers and forwards server callbacks to clients over the clients' existing connections.

## IceBox

To deploy several services in a single server process, use [IceBox](../../services/icebox), which loads services written
in C++, C#, or Java into a generic server, configures them with properties, and lets you administer them remotely.

## IceBridge

To forward requests to a server that clients cannot reach directly, use [IceBridge](../../services/icebridge), which
relays requests from one or more clients to that server.

## IceGrid

To locate, start, and replicate servers, use [IceGrid](../../services/icegrid), a
[location service](../../runtime/locators) that resolves indirect proxies, starts servers on demand, balances load
across replicas, and deploys applications to a set of computers.

## IceStorm

To distribute events to many subscribers, use [IceStorm](../../services/icestorm), a publish/subscribe service that
forwards each event published on a topic to every subscriber of that topic.
