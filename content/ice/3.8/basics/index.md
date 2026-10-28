---
title: Basics
pages:
  - slice-and-slice-compilers
  - terminology
---

In the [Greeter example](../greeter-example), a client calls an operation of an [Ice object](./terminology#ice-objects)
hosted by a server, often on another computer, and the call looks like an ordinary method call. This is a
[remote procedure call](https://en.wikipedia.org/wiki/Remote_procedure_call) (RPC): an application calls an operation
that another application implements, and Ice takes care of the communication.

## How a Call Works

When a client calls an operation:

1. The client calls a method on a [_proxy_](./terminology#proxies), a local object that represents the remote Ice
   object.
2. Ice sends a request, with the operation's arguments, to the server that hosts the Ice object.
3. In the server, Ice dispatches the request to the [_servant_](./terminology#servants), the object in your server code
   that implements the Ice object.
4. Ice sends the result, or the exception the servant throws, back to the client, where the proxy method returns this
   result or throws this exception.

Ice sends requests and replies as messages of the [Ice protocol](../protocol), over a [transport](../runtime/transports)
such as TCP, SSL, or WebSocket. The Ice runtime creates and reads these messages: your application never handles them.

The client and the server agree on the operations and the types of their parameters through [Slice](../slice)
definitions. Slice does not depend on a programming language, so a client and a server written in different languages
can communicate.

## Client and Server Structure

![Three-layer Ice client and server structure. Client proxy code corresponds to server skeleton code, while both sides expose the Ice API above their Ice runtimes. The server also has an object adapter, part of the Ice API. The legend identifies Ice API and generated code.](/images/ice/3.8/basics/client-server.svg)

_Ice client and server structure._

An Ice client or server combines the code you write, code generated from your Slice definitions, and the Ice libraries:

- The application code is the code you write: a client calls operations through proxies, and a server implements them in
  servants.
- The generated code holds the proxies that a client calls and the skeletons that servants implement. Together with the
  Ice runtime, it marshals and unmarshals the arguments and results: it converts them to and from the byte sequences Ice
  sends over the network.
- The Ice runtime sends and receives requests and replies, and manages the network connections. Your application uses it
  through the Ice API.
- An [object adapter](./terminology#object-adapters), part of the Ice API, receives the requests for the servants
  registered with it, and dispatches each request to its servant.

_Client_ and _server_ are roles, not kinds of programs: the client sends a request, and the server processes it. An
application can take both roles, for example a client that receives callbacks from the server it calls. See
[Terminology](./terminology#clients-and-servers).

{% iflang langs="matlab,php,ruby" %}

This language mapping supports clients only: the servers your client calls are written with another mapping, such as
C++, C#, Java, Python, or Swift.

{% /iflang %}

The rest of this chapter introduces [Slice and the Slice compilers](./slice-and-slice-compilers) and
[Ice terminology](./terminology).
