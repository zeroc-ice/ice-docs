---
title: Ice Services Overview
---

The Ice core provides a sophisticated client-server platform for distributed application development. However, realistic
applications usually require more than just a remoting capability: typically, you also need a way to start servers on
demand, distribute proxies to clients, distribute asynchronous events, configure your application, and so on.

Ice ships with a number of services that provide these and other features. The services are implemented as Ice servers
to which your application acts as a client.

# DataStorm

[DataStorm](../datastorm) is a data-centric publish/subscribe framework for C++.

# Glacier2

[Glacier2](../glacier2) allows clients and servers to securely communicate through a firewall without compromising
security. Client-server traffic is SSL-encrypted using public key certificates and is bidirectional. Glacier2 offers
support for mutual authentication as well as secure session management.

# IceBox

[IceBox](../icebox) is an easy-to-use framework for Ice application services.

# IceBridge

[IceBridge](../icebridge) acts as a bridge between one or more clients and a server and makes every effort to be as
transparent as possible.

# IceGrid

[IceGrid](../icegrid) is an implementation of an Ice [location service](../locators) that resolves the symbolic
information in an indirect proxy to a protocol-address pair for indirect binding. A location service is only the
beginning of IceGrid's capabilities.

IceGrid:

- allows you to register servers for automatic start-up: instead of requiring a server to be running at the time a
  client issues a request, IceGrid starts servers on demand, when the first client request arrives.
- provides tools that make it easy to configure complex applications containing several servers.
- supports replication and load-balancing.
- provides a simple query service that allows clients to obtain proxies for objects they are interested in.

# IceStorm

[IceStorm](../icestorm) is a publish-subscribe service that decouples clients and servers. Fundamentally, IceStorm acts
as a distribution switch for events. Publishers send events to the service, which, in turn, passes the events to
subscribers. In this way, a single event published by a publisher can be sent to multiple subscribers. Events are
categorized by topic, and subscribers specify the topics they are interested in. Only events that match a subscriber's
topic are sent to that subscriber. The service permits selection of a number of quality-of-service criteria to allow
applications to choose the appropriate trade-off between reliability and performance.

IceStorm is particularly useful if you have a need to distribute information to large numbers of application components.
(A typical example is a stock ticker application with a large number of subscribers.) IceStorm decouples the publishers
of information from subscribers and takes care of the redistribution of the published events. In addition, IceStorm can
be run as a _federated_ service, that is, multiple instances of the service can be run on different machines to spread
the processing load over a number of CPUs.
