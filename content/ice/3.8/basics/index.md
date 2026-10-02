---
title: Basics
pages:
  - slice-and-slice-compilers
  - terminology
  - protocol-in-a-nutshell
  - services-overview
---

Ice is at its core an [RPC framework](https://en.wikipedia.org/wiki/Remote_procedure_call) that allows you to build
client and server applications around the RPC paradigm.

With Ice, a client application calls local proxies to remote Ice objects hosted in server applications.

Clients and servers have this logical internal structure:

![Three-layer Ice client and server structure. Client proxy code corresponds to server skeleton code, while both sides expose the Ice API above their Ice runtimes. The server also has an object adapter, part of the Ice API. The legend identifies Ice API and generated code.](/images/ice/3.8/basics/client-server.svg)

_Ice client and server structure._

Both client and server consist of a mixture of application code, library code, and code generated from Slice
definitions:

- The Ice core or [runtime](../runtime) contains the client- and server-side runtime support for remote communication.
  Much of this code is concerned with the details of networking, threading, byte ordering, and many other
  networking-related issues that we want to keep away from application code.

- You use the Ice API to take care of administrative chores, such as initializing and finalizing the Ice runtime. The
  Ice API is identical for clients and servers (although servers use a larger part of the API than clients).

- The proxy code is generated from your Slice definitions and, therefore, specific to the types of objects and data you
  have defined in Slice. The proxy code has two major functions:

  - It provides a down-call interface for the client. Calling a method in the generated proxy API ultimately ends up
    sending an RPC message to the server that invokes a corresponding method on the target object.
  - It provides _marshaling_ and _unmarshaling_ code. Marshaling is the process of serializing a data structure, such as
    a sequence or a dictionary, for transmission on the wire. The marshaling code converts data into a form that is
    standardized for transmission and independent of the endian-ness and padding rules of the local machine.
    Unmarshaling is the reverse of marshaling, that is, deserializing data that arrives over the network and
    reconstructing a local representation of the data in types that are appropriate for the programming language in use.

- The skeleton code is also generated from your Slice definition and, therefore, specific to the types of objects and
  data you have defined in Slice. The skeleton code is the server-side equivalent of the client-side proxy code: it
  provides an up-call interface that permits the Ice runtime to pass incoming requests to the application code you
  write. The skeleton also contains marshaling and unmarshaling code, so the server can receive parameters sent by the
  client, and return parameters and exceptions to the client.

- The object adapter is a part of the Ice API that is specific to the server side: only servers use object adapters. An
  object adapter dispatches incoming requests to object implementations (_servants_) you’ve registered with this object
  adapter, and sends back the corresponding responses.

Note that, as far as the process view is concerned, there are only two processes involved: the client and the server.
All the runtime support for distributed communication is provided by the Ice libraries and the code that is generated
from Slice definitions.
