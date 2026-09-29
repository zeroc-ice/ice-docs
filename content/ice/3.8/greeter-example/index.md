---
title: Greeter Example
pages:
  - defining-the-greeter-interface-in-slice
  - writing-a-greeter-client
  - writing-a-greeter-server
---

Writing a client-server application with Ice does not take much code. See for yourself!

In this example, we describe how to write a simple client-server application, step by step.

This application is a typical Greeter: a server hosts a Greeter object that produces custom greetings, and the client
calls the server to get these greetings. Even though it’s simple, this application demonstrates best practices and
provides a good foundation for starting any Ice project.

We present this example in the following sections:

{% iflang langs="cpp,csharp,java,python,swift" %}

1. **Using Slice** - How to use the [Slice IDL](../slice) to define a contract between clients and servers.
2. **Writing a server** - How to implement Ice objects and host them in a server.
3. **Writing a client** - How to write a client that communicates with an Ice server.

We write the server first: a client has nothing to call until a server is running.

{% /iflang %}

{% iflang langs="js,matlab,php,ruby" %}

1. **Using Slice** - How to use the [Slice IDL](../slice) to define a contract between clients and servers.
2. **Writing a client** - How to write a client that communicates with an Ice server.

This example has no server section for this language mapping. You can run the Greeter server from C++, C#, Java, Python
or Swift, and call it from the client you write here.

{% /iflang %}

{% language-section name="lang-1" /%}
