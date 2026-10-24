---
title: IceGrid
pages:
  - icegrid-architecture
  - getting-started-with-icegrid
  - using-icegrid-deployment
  - well-known-objects
  - icegrid-templates
  - icebox-integration-with-icegrid
  - object-adapter-replication
  - load-balancing
  - resource-allocation-using-icegrid-sessions
  - registry-replication
  - icegrid-administrative-sessions
  - glacier2-integration-with-icegrid
  - icegrid-xml-reference
  - using-descriptor-variables-and-parameters
  - icegrid-property-set-semantics
  - icegrid-xml-features
  - icegrid-server-reference
  - icegrid-and-the-administrative-facility
  - securing-icegrid
  - icegridadmin-command-line-tool
  - icegrid-gui-tool
  - icegrid-server-activation
  - icegrid-troubleshooting
  - icegrid-database-utility
---

IceGrid is a location and activation service for Ice applications. Clients reach the servers of an IceGrid deployment
without knowing the host and port of each server, and IceGrid starts, stops and monitors these servers on the computers
where they run. IceGrid provides the following features:

- **Location service**: As an implementation of an Ice [location service](../../runtime/locators), IceGrid enables
  clients to bind indirectly to their servers, making applications more flexible and resilient to changing requirements.
  ([IceDiscovery](../../plugins/icediscovery) is an alternate, lightweight location service implementation for
  applications that don't require IceGrid's additional features.)
- **On-demand server activation**: Starting an Ice server process is called _server activation_. IceGrid can be given
  responsibility for activating a server on demand, that is, when a client attempts to access an object hosted by the
  server. Activation usually occurs as a side effect of indirect binding, and is completely transparent to the client.
- **Replication and load balancing**: IceGrid supports replication by grouping the object adapters of several servers
  into a single virtual object adapter. During indirect binding, a client can be bound to an endpoint of any of these
  adapters. Furthermore, IceGrid monitors the load on each computer and can use that information to decide which of the
  endpoints to return to a client.
- **Sessions and resource allocation**: An IceGrid client establishes a
  [session](./resource-allocation-using-icegrid-sessions) in order to allocate a resource such as an object or a server.
  IceGrid prevents other clients from allocating the resource until the client releases it or its session ends.
- **Automatic failover**: The proxy of an object in a replica group resolves to the endpoints of all the replicas. When
  the Ice runtime in the client cannot connect to one replica, it connects to another.
- **Dynamic queries**: In addition to transparent binding, applications can interact directly with IceGrid to locate
  objects in a variety of ways.
- **Status monitoring**: IceGrid supports Slice interfaces that allow applications to monitor its activities and receive
  notifications about significant events, enabling the development of custom tools or the integration of IceGrid status
  events into an existing management framework.
- **Administration**: IceGrid includes command-line and graphical administration tools. They are available on all
  supported platforms and allow you to start, stop, monitor, and reconfigure any server managed by IceGrid.
- **Deployment**: Using XML files, you can describe the servers to be deployed on each computer. Templates simplify the
  description of identical servers.
