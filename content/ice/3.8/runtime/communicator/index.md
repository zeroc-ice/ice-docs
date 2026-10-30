---
title: Communicator
pages:
  - initialization-and-destruction
  - communicators-in-php
---

A [communicator](api:Ice/Communicator) is the central object of the Ice runtime. It creates and caches the outgoing
connections of your application, holds its [configuration properties](../properties-and-configuration) and its
[logger](../../administration/logger-facility), and runs the client-side [thread pool](../threading-model) that
processes the messages received on these connections. You create proxies with a communicator.

{% iflang langs="cpp,csharp,java,js,python,swift" %}

A communicator also creates the [object adapters](../dispatch) that dispatch incoming requests to your servants.

{% /iflang %}

Most applications use a single communicator, but an application can create several communicators when needed.
