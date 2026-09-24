---
title: Communicator
pages:
  - communicator-initialization-and-destruction
  - communicators-in-php
---

The [Communicator](https://code.zeroc.com/manual/Ice/Communicator) class is the main entry point to the Ice API. A
communicator is simply an instance of this class. Its primary responsibility is to create outgoing connections, and to
maintain a cache of the outgoing connections it created. A communicator has many additional responsibilities, to the
point you can see it as the “central” Ice object.

A communicator serves as the registry and owner for:

- Outgoing connections A communicator maintains a cache of outgoing connections.
- Configuration properties Various aspects of the Ice runtime can be configured via properties. Each communicator has
  its own set of such [configuration properties](../properties-and-configuration).
- Logger object A [logger](../logger-facility) object implements the [Logger](https://code.zeroc.com/manual/Ice/Logger)
  abstraction and determines how log messages that are produced by the Ice runtime are handled.
- Object adapters [Object adapters](../dispatch) dispatch incoming requests and take care of passing each request to the
  correct servant.
- Client-side thread pool The client-side [thread pool](../the-ice-threading-model) is used to process messages received
  from outgoing connections.

and much more.

Most Ice-based applications create and use a single communicator, although it is possible and occasionally desirable to
have multiple `Communicator` objects in the same program.
